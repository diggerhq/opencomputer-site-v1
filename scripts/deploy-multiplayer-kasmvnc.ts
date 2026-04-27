#!/usr/bin/env tsx
/**
 * Multiplayer DOOM with KasmVNC instead of Xvfb+x11vnc+websockify.
 *
 *   OPENCOMPUTER_API_KEY=... npx tsx scripts/deploy-multiplayer-kasmvnc.ts
 *   OPENCOMPUTER_API_KEY=... npx tsx scripts/deploy-multiplayer-kasmvnc.ts --kill <id>
 *   OPENCOMPUTER_API_KEY=... npx tsx scripts/deploy-multiplayer-kasmvnc.ts --logs <id>
 *
 * Per slot: 1 Xvnc (KasmVNC) + 1 zandronum client. KasmVNC creates the X
 * display, encodes VNC, AND serves the noVNC HTML + WebSocket on a single
 * port — no separate websockify, no x11vnc, no Xvfb. Single multithreaded
 * process per slot, so no fork-per-connection wedge possible.
 */

import { Sandbox } from "@opencomputer/sdk";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const SLOTS = [1, 2, 3, 4];
const SERVER_PORT = 10666;
const WEB_BASE = 6080;
const LOBBY_PORT = 7000;

const __dirname = dirname(fileURLToPath(import.meta.url));
const LOBBY_SRC = resolve(__dirname, "lobby/server.cjs");

// KasmVNC release. Ubuntu 22.04 (jammy) is the typical opencomputer base.
const KASMVNC_DEB_URL =
  "https://github.com/kasmtech/KasmVNC/releases/download/v1.3.4/kasmvncserver_jammy_1.3.4_amd64.deb";

function die(msg: string): never {
  console.error(`error: ${msg}`);
  process.exit(1);
}

async function deploy() {
  if (!process.env.OPENCOMPUTER_API_KEY) die("OPENCOMPUTER_API_KEY is required");

  console.log("Creating 4 vCPU / 16 GB sandbox…");
  const sb = await Sandbox.create({
    template: "base",
    timeout: 0,
    cpuCount: 4,
    memoryMB: 16384,
    metadata: { purpose: "doom-multiplayer-kasmvnc" },
  });
  console.log(`  sandbox: ${sb.sandboxId}`);

  console.log("Detecting Ubuntu codename + downloading KasmVNC .deb…");
  const installScript = [
    "export DEBIAN_FRONTEND=noninteractive",
    "sudo -E apt-get update -y",
    "sudo -E apt-get install -y --no-install-recommends " +
      "ca-certificates curl gnupg procps freedoom nodejs " +
      // KasmVNC deps that auto-resolve from the .deb but we pre-pull in case:
      "libxfont2 libfontenc1 libssl3 libpixman-1-0 libgnutls30 libjpeg-turbo8",
    // Zandronum from drdteam (same as the old script).
    "sudo install -d -m 0755 /etc/apt/keyrings",
    "curl -fsSL http://debian.drdteam.org/drdteam.gpg | sudo gpg --dearmor -o /etc/apt/keyrings/drdteam.gpg",
    `echo "deb [signed-by=/etc/apt/keyrings/drdteam.gpg] http://debian.drdteam.org/ stable multiverse" | sudo tee /etc/apt/sources.list.d/drdteam.list`,
    "sudo -E apt-get update -y",
    "sudo -E apt-get install -y --no-install-recommends zandronum zandronum-server",
    // KasmVNC .deb.
    `curl -fsSL -o /tmp/kasmvnc.deb "${KASMVNC_DEB_URL}"`,
    "sudo apt-get install -y /tmp/kasmvnc.deb",
    // pm2 (sandbox already has nodejs from NodeSource bundle).
    "sudo npm install -g pm2",
    // Confirm what landed.
    "which Xvnc kasmvncserver vncserver 2>&1 | head",
  ].join(" && ");
  const installCode = await runStreaming(sb, installScript, 600);
  if (installCode !== 0) {
    await sb.kill();
    die(`apt/kasmvnc install failed (exit ${installCode})`);
  }

  console.log("Reserving preview URLs (4 slots + lobby)…");
  const slotUrls: { slot: number; host: string }[] = [];
  for (const n of SLOTS) {
    const preview = await sb.createPreviewURL({
      port: WEB_BASE + n,
      authConfig: { public: true },
    });
    slotUrls.push({ slot: n, host: preview.hostname });
    console.log(`  slot ${n}: https://${preview.hostname}/`);
  }
  const lobbyPreview = await sb.createPreviewURL({
    port: LOBBY_PORT,
    authConfig: { public: true },
  });
  console.log(`  lobby:  https://${lobbyPreview.hostname}/api/state`);

  console.log("Writing config files…");
  await sb.files.write("/tmp/doom-mp/server.cfg", serverCfg());
  await sb.files.write("/tmp/doom-mp/ecosystem.config.cjs", pm2Ecosystem());
  await sb.files.write("/tmp/doom-mp/lobby.cjs", readFileSync(LOBBY_SRC, "utf8"));
  await sb.files.write(
    "/tmp/doom-mp/slot-hosts.json",
    JSON.stringify(Object.fromEntries(slotUrls.map(({ slot, host }) => [slot, host])), null, 2),
  );
  await sb.files.write("/tmp/doom-mp/start.sh", startSh());

  console.log("Booting…");
  const bootScript = `
    set -e
    sudo mkdir -p /tmp/doom-mp
    sudo chown -R sandbox:sandbox /tmp/doom-mp
    chmod +x /tmp/doom-mp/start.sh
    sudo /tmp/doom-mp/start.sh
    sleep 6
    sudo pm2 list
  `;
  const bootCode = await runStreaming(sb, bootScript, 60);
  if (bootCode !== 0) {
    await tail(sb);
    await sb.kill();
    die(`boot failed (exit ${bootCode})`);
  }

  console.log("\n──────────────────────────────────────────────");
  console.log(" 🎮 KasmVNC multiplayer DOOM is live");
  console.log("──────────────────────────────────────────────");
  console.log(` sandbox: ${sb.sandboxId}`);
  for (const { slot, host } of slotUrls) {
    console.log(` Player ${slot}:  https://${host}/`);
  }
  console.log(` Lobby:    https://${lobbyPreview.hostname}/api/state`);
  console.log("──────────────────────────────────────────────");
  console.log(` logs:  npx tsx scripts/deploy-multiplayer-kasmvnc.ts --logs ${sb.sandboxId}`);
  console.log(` kill:  npx tsx scripts/deploy-multiplayer-kasmvnc.ts --kill ${sb.sandboxId}`);
  console.log("──────────────────────────────────────────────\n");
}

function serverCfg(): string {
  return `// Zandronum server config
sv_hostname "OpenComputer DOOM Demo"
sv_maxclients 8
sv_maxplayers 4
sv_maxclientsperip 8
sv_motd "deathmatch on a real OpenComputer VM"
deathmatch 1
fraglimit 20
timelimit 10
sv_itemrespawn 1
sv_smartaim 0
`;
}

function pm2Ecosystem(): string {
  const common = { autorestart: true, interpreter: "none" as const, merge_logs: true };
  const apps: object[] = [
    {
      ...common,
      name: "zandronum-server",
      script: "/usr/bin/zandronum-server",
      args: [
        "-iwad", "/usr/share/games/doom/freedoom2.wad",
        "+exec", "/tmp/doom-mp/server.cfg",
        "+map", "MAP01",
        "-port", String(SERVER_PORT),
      ],
      cwd: "/tmp/doom-mp",
      restart_delay: 1000,
      out_file: "/tmp/doom-mp/zandronum-server.log",
    },
    {
      autorestart: true,
      merge_logs: true,
      name: "lobby",
      script: "/tmp/doom-mp/lobby.cjs",
      env: { LOBBY_PORT: String(LOBBY_PORT) },
      restart_delay: 2000,
      out_file: "/tmp/doom-mp/lobby.log",
    },
  ];
  for (const n of SLOTS) {
    apps.push(
      {
        ...common,
        name: `kasmvnc-${n}`,
        script: "/usr/bin/Xvnc",
        // KasmVNC's Xvnc creates an X display, encodes VNC, AND serves
        // noVNC + WebSocket on a single port — all in one process.
        //   - :10N is the X display number
        //   - -SecurityTypes None: no VNC password (preview URL is the gate)
        //   - -interface 0.0.0.0: bind on all interfaces
        //   - -websocketPort/-httpPort: combined http+ws on the same port
        //   - -sslOnly off: serve plain http; CF terminates TLS in front
        //   - -RFBPort 0: don't open the raw VNC port (saves a port + FDs)
        args: [
          `:10${n}`,
          "-geometry", "1024x768",
          "-depth", "24",
          "-SecurityTypes", "None",
          "-interface", "0.0.0.0",
          "-rfbport", "0",
          "-websocketPort", String(WEB_BASE + n),
          "-httpPort", String(WEB_BASE + n),
          "-sslOnly", "off",
          "-AlwaysShared",
        ],
        out_file: `/tmp/doom-mp/kasmvnc-${n}.log`,
        restart_delay: 2000,
      },
      {
        ...common,
        name: `zandronum-${n}`,
        script: "/usr/bin/zandronum",
        args: [
          "-iwad", "/usr/share/games/doom/freedoom2.wad",
          "-connect", `127.0.0.1:${SERVER_PORT}`,
          "-width", "1024",
          "-height", "768",
          "+name", `Player${n}`,
          "+vid_defwidth", "1024",
          "+vid_defheight", "768",
          "+vid_fullscreen", "0",
        ],
        env: { DISPLAY: `:10${n}`, HOME: "/tmp/doom-mp" },
        restart_delay: 3000,
        out_file: `/tmp/doom-mp/zandronum-${n}.log`,
      },
    );
  }
  return `module.exports = { apps: ${JSON.stringify(apps, null, 2)} };\n`;
}

function startSh(): string {
  return `#!/bin/bash
set -e
ulimit -SHn 65536
echo "ulimit -n: soft=$(ulimit -Sn) hard=$(ulimit -Hn)"
exec pm2 start /tmp/doom-mp/ecosystem.config.cjs
`;
}

async function runStreaming(sb: Sandbox, script: string, timeout: number): Promise<number> {
  const decoder = new TextDecoder();
  const session = await sb.exec.start("sh", {
    args: ["-c", script],
    timeout,
    onStdout: (d) => process.stdout.write(decoder.decode(d, { stream: true })),
    onStderr: (d) => process.stderr.write(decoder.decode(d, { stream: true })),
  });
  return session.done;
}

async function tail(sb: Sandbox) {
  const r = await sb.exec.run(
    "for f in /tmp/doom-mp/*.log; do echo \"==> $f\"; sudo tail -n 30 \"$f\" 2>/dev/null; done",
    { timeout: 30 },
  );
  console.log(r.stdout);
  if (r.stderr) console.error(r.stderr);
}

async function logs(sandboxId: string) {
  const sb = await Sandbox.connect(sandboxId);
  await tail(sb);
}

async function kill(sandboxId: string) {
  const sb = await Sandbox.connect(sandboxId);
  await sb.kill();
  console.log(`killed ${sandboxId}`);
}

const [cmd, arg] = process.argv.slice(2);
const run =
  cmd === "--kill" && arg ? kill(arg)
  : cmd === "--logs" && arg ? logs(arg)
  : deploy();

run.catch((e) => { console.error(e); process.exit(1); });
