#!/usr/bin/env tsx
import { Sandbox } from "@opencomputer/sdk";
const sb = await Sandbox.connect("sb-d8716609");
const script = `#!/bin/bash
set -x
echo "=== process count BEFORE cleanup ==="
ps -A | wc -l

echo "=== pm2 kill (shut down daemon + all managed children) ==="
sudo pm2 kill 2>&1 | tail -3
sleep 2

echo "=== nuke any leftover Xvnc/Xvfb/zandronum/x11vnc/websockify by name ==="
sudo pkill -9 -x Xvnc 2>/dev/null || true
sudo pkill -9 -x Xvfb 2>/dev/null || true
sudo pkill -9 -x zandronum 2>/dev/null || true
sudo pkill -9 -x zandronum-server 2>/dev/null || true
sudo pkill -9 -x x11vnc 2>/dev/null || true
sudo pkill -9 -x websockify 2>/dev/null || true
sudo pkill -9 -x sudo 2>/dev/null || true
sleep 3
echo "=== process count AFTER cleanup ==="
ps -A | wc -l

echo "=== sanity: can we fork? ==="
for i in 1 2 3 4 5; do (true) & done
wait
echo "fork test passed"

echo "=== clean Xvnc test (single launch, no pm2) ==="
sudo rm -f /tmp/.X11-unix/* /tmp/.X*-lock 2>/dev/null
nohup sudo /usr/bin/Xvnc :190 -SecurityTypes None -DisableBasicAuth=1 \
  -interface 0.0.0.0 -rfbport 0 -websocketPort 6190 \
  > /tmp/xvnc-clean.log 2>&1 &
XPID=$!
sleep 4
echo "--- log: ---"
sudo tail -n 20 /tmp/xvnc-clean.log
echo "--- curl 6190: ---"
curl -sS -o /dev/null -w "HTTP %{http_code}\\n" --max-time 5 http://127.0.0.1:6190/
sudo kill $XPID 2>/dev/null
`;
await sb.files.write("/tmp/clean-restart.sh", script);
await sb.exec.run("chmod +x /tmp/clean-restart.sh", { timeout: 5 });
const r = await sb.exec.run("bash /tmp/clean-restart.sh", { timeout: 60 });
console.log(r.stdout);
