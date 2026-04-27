#!/usr/bin/env tsx
import { Sandbox } from "@opencomputer/sdk";
import { readFileSync } from "node:fs";

const sandboxId = process.argv[2] ?? "sb-540ca6e2";
const sb = await Sandbox.connect(sandboxId);

// Reuse the deploy script's ecosystem builder by re-deriving the config inline.
const SLOTS = [1, 2, 3, 4];
const SERVER_PORT = 10666;
const VNC_BASE = 5900;
const WEB_BASE = 6080;
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
];
for (const n of SLOTS) {
  apps.push(
    {
      ...common,
      name: `xvfb-${n}`,
      script: "/usr/bin/Xvfb",
      args: [`:10${n}`, "-screen", "0", "1024x768x24", "-ac"],
      out_file: `/tmp/doom-mp/xvfb-${n}.log`,
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
      restart_delay: 2000,
      out_file: `/tmp/doom-mp/zandronum-${n}.log`,
    },
    {
      ...common,
      name: `x11vnc-${n}`,
      script: "/usr/bin/x11vnc",
      args: [
        "-display", `:10${n}`,
        "-forever", "-shared", "-nopw",
        "-rfbport", String(VNC_BASE + n),
        "-quiet",
      ],
      restart_delay: 2000,
      out_file: `/tmp/doom-mp/x11vnc-${n}.log`,
    },
    {
      ...common,
      name: `websockify-${n}`,
      script: "/usr/local/bin/websockify",
      args: [
        "--web=/usr/share/novnc",
        String(WEB_BASE + n),
        `127.0.0.1:${VNC_BASE + n}`,
      ],
      out_file: `/tmp/doom-mp/websockify-${n}.log`,
    },
  );
}
const ecosystem = `module.exports = { apps: ${JSON.stringify(apps, null, 2)} };\n`;

await sb.files.write("/tmp/doom-mp/ecosystem.config.cjs", ecosystem);

// pm2 reload picks up arg changes without dropping listeners that don't need
// changes; for arg changes specifically we use `delete` + `start` to be safe.
const r = await sb.exec.run(
  "sudo pm2 delete zandronum-1 zandronum-2 zandronum-3 zandronum-4 || true; " +
    "sudo pm2 start /tmp/doom-mp/ecosystem.config.cjs --only zandronum-1,zandronum-2,zandronum-3,zandronum-4",
  { timeout: 30 },
);
console.log(r.stdout);
if (r.stderr) console.error(r.stderr);
