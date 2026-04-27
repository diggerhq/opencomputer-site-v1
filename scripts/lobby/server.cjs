"use strict";

// In-sandbox lobby for the multiplayer DOOM demo.
// Pure Node http; no external deps. State lives in-process (lost on restart).

const http = require("node:http");
const { exec } = require("node:child_process");
const crypto = require("node:crypto");

const PORT = parseInt(process.env.LOBBY_PORT || "7000", 10);
const SLOT_NUMS = [1, 2, 3, 4];
const SESSION_TIMEOUT_MS = 90_000;          // hard cap per session
const HEARTBEAT_TIMEOUT_MS = 12_000;        // no-heartbeat-for-N-secs → reap
const REAPER_INTERVAL_MS = 1_000;

// Map slotN → preview hostname for that slot's websockify port. The deploy
// script writes this file before starting the lobby.
const SLOT_HOSTS_PATH = "/tmp/doom-mp/slot-hosts.json";
let slotHosts = {};
try {
  slotHosts = require(SLOT_HOSTS_PATH);
} catch (_e) {
  console.warn(`could not load ${SLOT_HOSTS_PATH}; slot URLs will be empty`);
}

/** @type {Map<number, {sessionId: string|null, claimedAt: number|null, lastHeartbeat: number|null, expiresAt: number|null}>} */
const slots = new Map(SLOT_NUMS.map((n) => [n, blankSlot()]));
/** @type {Array<{sessionId: string, joinedAt: number}>} */
const queue = [];
/** sessionId → slot number (when assigned) */
const sessionToSlot = new Map();

function blankSlot() {
  return { sessionId: null, claimedAt: null, lastHeartbeat: null, expiresAt: null };
}

function newSessionId() {
  return crypto.randomBytes(12).toString("hex");
}

function findFreeSlot() {
  for (const [n, s] of slots) if (!s.sessionId) return n;
  return null;
}

function publicState() {
  return {
    slots: SLOT_NUMS.map((n) => {
      const s = slots.get(n);
      return {
        slot: n,
        occupied: !!s.sessionId,
        expiresIn: s.expiresAt ? Math.max(0, Math.round((s.expiresAt - Date.now()) / 1000)) : null,
      };
    }),
    queueLength: queue.length,
  };
}

function slotUrl(n) {
  const host = slotHosts[n];
  return host ? `https://${host}/vnc.html?autoconnect=1&resize=scale` : null;
}

function assign(sessionId, slot) {
  const now = Date.now();
  slots.set(slot, {
    sessionId,
    claimedAt: now,
    lastHeartbeat: now,
    expiresAt: now + SESSION_TIMEOUT_MS,
  });
  sessionToSlot.set(sessionId, slot);
}

function release(slot, reason) {
  const s = slots.get(slot);
  if (!s.sessionId) return;
  console.log(`[lobby] release slot ${slot} (session ${s.sessionId}, reason: ${reason})`);
  sessionToSlot.delete(s.sessionId);
  slots.set(slot, blankSlot());

  // Reset that slot's zandronum so the next player gets a clean state.
  // We're already running as root under pm2; no sudo needed.
  exec(`/usr/bin/pm2 restart zandronum-${slot}`, (err) => {
    if (err) console.error(`[lobby] pm2 restart zandronum-${slot} failed:`, err.message);
  });

  // Promote first queued session if any.
  while (queue.length) {
    const next = queue.shift();
    if (Date.now() - next.joinedAt > 5 * 60_000) continue; // expired wait
    assign(next.sessionId, slot);
    console.log(`[lobby] promoted ${next.sessionId} → slot ${slot}`);
    break;
  }
}

// Reaper: enforce session caps and drop stale heartbeats.
setInterval(() => {
  const now = Date.now();
  for (const [n, s] of slots) {
    if (!s.sessionId) continue;
    if (s.expiresAt && now >= s.expiresAt) release(n, "session expired");
    else if (s.lastHeartbeat && now - s.lastHeartbeat > HEARTBEAT_TIMEOUT_MS) release(n, "heartbeat lost");
  }
}, REAPER_INTERVAL_MS);

// ── HTTP ───────────────────────────────────────────────────────────────────

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => {
      const buf = Buffer.concat(chunks).toString("utf8");
      try { resolve(buf ? JSON.parse(buf) : {}); } catch (e) { reject(e); }
    });
    req.on("error", reject);
  });
}

function send(res, code, body) {
  res.writeHead(code, {
    "content-type": "application/json",
    "access-control-allow-origin": "*",
    "access-control-allow-headers": "content-type",
    "access-control-allow-methods": "GET, POST, OPTIONS",
    "cache-control": "no-store",
  });
  res.end(JSON.stringify(body));
}

const server = http.createServer(async (req, res) => {
  if (req.method === "OPTIONS") return send(res, 204, {});

  if (req.method === "GET" && req.url === "/api/state") {
    return send(res, 200, publicState());
  }

  if (req.method === "POST" && req.url === "/api/claim") {
    const sessionId = newSessionId();
    const slot = findFreeSlot();
    if (slot != null) {
      assign(sessionId, slot);
      return send(res, 200, {
        status: "assigned",
        sessionId,
        slot,
        wsUrl: slotUrl(slot),
        expiresIn: Math.round(SESSION_TIMEOUT_MS / 1000),
      });
    }
    queue.push({ sessionId, joinedAt: Date.now() });
    return send(res, 200, {
      status: "queued",
      sessionId,
      position: queue.length,
    });
  }

  if (req.method === "POST" && req.url === "/api/heartbeat") {
    let body;
    try { body = await readBody(req); } catch { return send(res, 400, { error: "bad json" }); }
    const slot = sessionToSlot.get(body.sessionId);
    if (slot == null) {
      // session may be queued; report current position
      const idx = queue.findIndex((q) => q.sessionId === body.sessionId);
      if (idx >= 0) return send(res, 200, { status: "queued", position: idx + 1 });
      return send(res, 200, { status: "released" });
    }
    const s = slots.get(slot);
    s.lastHeartbeat = Date.now();
    slots.set(slot, s);
    return send(res, 200, {
      status: "ok",
      slot,
      wsUrl: slotUrl(slot),
      expiresIn: Math.max(0, Math.round((s.expiresAt - Date.now()) / 1000)),
    });
  }

  if (req.method === "POST" && req.url === "/api/release") {
    let body;
    try { body = await readBody(req); } catch { return send(res, 400, { error: "bad json" }); }
    const slot = sessionToSlot.get(body.sessionId);
    if (slot != null) release(slot, "client release");
    else {
      const idx = queue.findIndex((q) => q.sessionId === body.sessionId);
      if (idx >= 0) queue.splice(idx, 1);
    }
    return send(res, 200, { status: "ok" });
  }

  if (req.method === "GET" && req.url === "/api/health") {
    return send(res, 200, { ok: true });
  }

  send(res, 404, { error: "not found" });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`[lobby] listening on :${PORT}`);
  console.log(`[lobby] slot hosts: ${JSON.stringify(slotHosts)}`);
});
