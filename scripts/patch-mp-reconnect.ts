#!/usr/bin/env tsx
/**
 *   OPENCOMPUTER_API_KEY=... npx tsx scripts/patch-mp-reconnect.ts <sandboxId>
 *
 * Hot-patches an existing multiplayer DOOM sandbox with:
 *   - --idle-timeout=30 on websockify (server-side stuck-conn reaper)
 *   - lobby returns reconnect=false in slot wsUrls (client-side reconnect off)
 */

import { Sandbox } from "@opencomputer/sdk";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const sandboxId = process.argv[2];
if (!sandboxId) { console.error("usage: patch-mp-reconnect.ts <sandboxId>"); process.exit(1); }
if (!process.env.OPENCOMPUTER_API_KEY) { console.error("OPENCOMPUTER_API_KEY required"); process.exit(1); }

const __dirname = dirname(fileURLToPath(import.meta.url));
const lobbySrc = readFileSync(resolve(__dirname, "lobby/server.cjs"), "utf8");

const sb = await Sandbox.connect(sandboxId);

const SLOTS = [1, 2, 3, 4];
const VNC_BASE = 5900;
const WEB_BASE = 6080;
const SERVER_PORT = 10666;
const LOBBY_PORT = 7000;

// Rebuild ecosystem with the new websockify --idle-timeout flag.
const common = { autorestart: true, interpreter: "none", merge_logs: true };
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
    { ...common, name: `xvfb-${n}`, script: "/usr/bin/Xvfb",
      args: [`:10${n}`, "-screen", "0", "1024x768x24", "-ac"],
      out_file: `/tmp/doom-mp/xvfb-${n}.log` },
    { ...common, name: `zandronum-${n}`, script: "/usr/bin/zandronum",
      args: ["-iwad", "/usr/share/games/doom/freedoom2.wad",
        "-connect", `127.0.0.1:${SERVER_PORT}`, "-width", "1024", "-height", "768",
        "+name", `Player${n}`, "+vid_defwidth", "1024", "+vid_defheight", "768", "+vid_fullscreen", "0"],
      env: { DISPLAY: `:10${n}`, HOME: "/tmp/doom-mp" },
      restart_delay: 2000, out_file: `/tmp/doom-mp/zandronum-${n}.log` },
    { ...common, name: `x11vnc-${n}`, script: "/usr/bin/x11vnc",
      args: ["-display", `:10${n}`, "-forever", "-shared", "-nopw",
        "-rfbport", String(VNC_BASE + n), "-quiet"],
      restart_delay: 2000, out_file: `/tmp/doom-mp/x11vnc-${n}.log` },
    { ...common, name: `websockify-${n}`, script: "/usr/local/bin/websockify",
      args: ["--web=/usr/share/novnc", "--idle-timeout=30",
        String(WEB_BASE + n), `127.0.0.1:${VNC_BASE + n}`],
      out_file: `/tmp/doom-mp/websockify-${n}.log` },
  );
}
const ecosystem = `module.exports = { apps: ${JSON.stringify(apps, null, 2)} };\n`;

await sb.files.write("/tmp/doom-mp/ecosystem.config.cjs", ecosystem);
await sb.files.write("/tmp/doom-mp/lobby.cjs", lobbySrc);

const script = `#!/bin/bash
set -x
sudo pm2 delete websockify-1 websockify-2 websockify-3 websockify-4 lobby || true
sleep 1
sudo pkill -9 -x websockify 2>/dev/null || true
sleep 2
sudo pm2 start /tmp/doom-mp/ecosystem.config.cjs --only lobby,websockify-1,websockify-2,websockify-3,websockify-4
sleep 4
for n in 1 2 3 4; do
  printf "slot %s: HTTP %s\\n" "$n" "$(curl -sS -o /dev/null -w '%{http_code}' --max-time 5 http://127.0.0.1:608$n/)"
done
echo "lobby state:"
curl -sS http://127.0.0.1:7000/api/state | head -c 200; echo
`;
await sb.files.write("/tmp/patch-mp.sh", script);
await sb.exec.run("chmod +x /tmp/patch-mp.sh", { timeout: 5 });
const r = await sb.exec.run("bash /tmp/patch-mp.sh", { timeout: 60 });
console.log(r.stdout);
if (r.stderr) console.error(r.stderr);
