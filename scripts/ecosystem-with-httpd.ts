#!/usr/bin/env tsx
import { Sandbox } from "@opencomputer/sdk";
const sb = await Sandbox.connect("sb-d8716609");
const SLOTS = [1,2,3,4];
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
        "+name",`Player${n}`,"+vid_defwidth","1024","+vid_defheight","768","+vid_fullscreen","0"],
      env: { DISPLAY: `:10${n}`, HOME: "/tmp/doom-mp" },
      restart_delay: 3000, out_file: `/tmp/doom-mp/zandronum-${n}.log` },
  );
}
await sb.files.write("/tmp/doom-mp/ecosystem.config.cjs",
  `module.exports = { apps: ${JSON.stringify(apps, null, 2)} };\n`);

const script = `#!/bin/bash
set -x
sudo pm2 kill 2>/dev/null
sleep 2
sudo pkill -9 -x Xvnc 2>/dev/null || true
sudo pkill -9 -x zandronum 2>/dev/null || true
sudo pkill -9 -x zandronum-server 2>/dev/null || true
sudo rm -f /tmp/.X11-unix/X10* /tmp/.X10*-lock
sleep 2
echo "process count: $(ps -A | wc -l)"
sudo bash -c 'ulimit -SHn 65536; pm2 start /tmp/doom-mp/ecosystem.config.cjs'
sleep 8
sudo pm2 list
echo "=== local curl /vnc.html each slot ==="
for n in 1 2 3 4; do
  printf "slot %s: HTTP %s\\n" "$n" "$(curl -sS -o /dev/null -w '%{http_code}' --max-time 5 http://127.0.0.1:608$n/vnc.html)"
done
`;
await sb.files.write("/tmp/restart-with-httpd.sh", script);
await sb.exec.run("chmod +x /tmp/restart-with-httpd.sh", { timeout: 5 });
const r = await sb.exec.run("bash /tmp/restart-with-httpd.sh", { timeout: 90 });
console.log(r.stdout);
