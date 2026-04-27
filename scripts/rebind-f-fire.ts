#!/usr/bin/env tsx
import { Sandbox } from "@opencomputer/sdk";
const sb = await Sandbox.connect("sb-d8716609");
const SLOTS = [1, 2, 3, 4];
const SERVER_PORT = 10666, WEB_BASE = 6080, LOBBY_PORT = 7000;
const common = { autorestart: true, interpreter: "none", merge_logs: true, max_restarts: 10, min_uptime: "10s" };
const apps: object[] = [
  { ...common, name: "zandronum-server", script: "/usr/bin/zandronum-server",
    args: ["-iwad","/usr/share/games/doom/freedoom2.wad","+exec","/tmp/doom-mp/server.cfg","+map","MAP01","-port",String(SERVER_PORT)],
    cwd: "/tmp/doom-mp", restart_delay: 1000, out_file: "/tmp/doom-mp/zandronum-server.log" },
  { autorestart: true, merge_logs: true, max_restarts: 10, min_uptime: "10s",
    name: "lobby", script: "/tmp/doom-mp/lobby.cjs",
    env: { LOBBY_PORT: String(LOBBY_PORT) }, restart_delay: 2000, out_file: "/tmp/doom-mp/lobby.log" },
];
for (const n of SLOTS) {
  apps.push(
    { ...common, name: `kasmvnc-${n}`, script: "/usr/bin/Xvnc",
      args: [`:10${n}`,"-geometry","1024x768","-depth","24",
        "-SecurityTypes","None","-DisableBasicAuth=1",
        "-interface","0.0.0.0","-rfbport","0",
        "-websocketPort", String(WEB_BASE + n),
        "-httpd","/usr/share/kasmvnc/www"],
      out_file: `/tmp/doom-mp/kasmvnc-${n}.log`, restart_delay: 2000 },
    { ...common, name: `zandronum-${n}`, script: "/usr/bin/zandronum",
      args: ["-iwad","/usr/share/games/doom/freedoom2.wad",
        "-connect",`127.0.0.1:${SERVER_PORT}`,"-width","1024","-height","768",
        "+name",`Player${n}`,"+vid_defwidth","1024","+vid_defheight","768","+vid_fullscreen","0",
        "+bind","f","+attack"],
      env: { DISPLAY: `:10${n}`, HOME: "/tmp/doom-mp" },
      restart_delay: 3000, out_file: `/tmp/doom-mp/zandronum-${n}.log` },
  );
}
await sb.files.write("/tmp/doom-mp/ecosystem.config.cjs",
  `module.exports = { apps: ${JSON.stringify(apps, null, 2)} };\n`);
const r = await sb.exec.run(
  "sudo pm2 restart zandronum-1 zandronum-2 zandronum-3 zandronum-4 --update-env",
  { timeout: 30 },
);
console.log(r.stdout);
