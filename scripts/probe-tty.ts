#!/usr/bin/env tsx
import { Sandbox } from "@opencomputer/sdk";
const sb = await Sandbox.connect("sb-d8716609");
const script = `#!/bin/bash
set -x
echo "=== test 1: setsid with /dev/null stdin (mimics pm2) ==="
sudo rm -f /tmp/.X11-unix/X196 /tmp/.X196-lock
setsid sudo /usr/bin/Xvnc :196 -SecurityTypes None -DisableBasicAuth=1 -interface 0.0.0.0 -rfbport 0 -websocketPort 6196 < /dev/null > /tmp/test1.log 2>&1 &
SETSID_PID=$!
sleep 3
sudo kill $SETSID_PID 2>/dev/null
echo "--- test1 log: ---"
sudo tail -n 15 /tmp/test1.log

echo "=== test 2: same but with ptyrun (script -qfc) — fake TTY ==="
sudo rm -f /tmp/.X11-unix/X195 /tmp/.X195-lock
sudo apt-get install -y --no-install-recommends bsdutils 2>&1 | tail -1
sudo script -qfc "/usr/bin/Xvnc :195 -SecurityTypes None -DisableBasicAuth=1 -interface 0.0.0.0 -rfbport 0 -websocketPort 6195" /dev/null > /tmp/test2.log 2>&1 &
SCRIPT_PID=$!
sleep 3
sudo kill -9 $SCRIPT_PID 2>/dev/null
echo "--- test2 log: ---"
sudo tail -n 15 /tmp/test2.log

echo "=== test 3: launch via ssh-style nohup ==="
sudo rm -f /tmp/.X11-unix/X194 /tmp/.X194-lock
nohup sudo /usr/bin/Xvnc :194 -SecurityTypes None -DisableBasicAuth=1 -interface 0.0.0.0 -rfbport 0 -websocketPort 6194 > /tmp/test3.log 2>&1 &
NOHUP_PID=$!
sleep 3
sudo kill $NOHUP_PID 2>/dev/null
echo "--- test3 log: ---"
sudo tail -n 15 /tmp/test3.log
`;
await sb.files.write("/tmp/probe-tty.sh", script);
await sb.exec.run("chmod +x /tmp/probe-tty.sh", { timeout: 5 });
const r = await sb.exec.run("bash /tmp/probe-tty.sh", { timeout: 60 });
console.log(r.stdout);
console.log("--- STDERR ---");
console.log(r.stderr);
