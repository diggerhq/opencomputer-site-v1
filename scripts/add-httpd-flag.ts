#!/usr/bin/env tsx
import { Sandbox } from "@opencomputer/sdk";
const sb = await Sandbox.connect("sb-d8716609");
const script = `#!/bin/bash
set -x
sudo pm2 delete kasmvnc-1 kasmvnc-2 kasmvnc-3 kasmvnc-4 || true
sleep 1
sudo rm -f /tmp/.X11-unix/X10* /tmp/.X10*-lock
sleep 1

# Symlink the www dir to the default location AND pass -httpd explicitly.
sudo mkdir -p /usr/local/share
sudo ln -snf /usr/share/kasmvnc/www /usr/local/share/kasmvnc 2>/dev/null
sudo ln -snf /usr/share/kasmvnc/www /usr/local/share/kasmvnc/www 2>/dev/null

for n in 1 2 3 4; do
  PORT=$((6080+n))
  sudo pm2 start /usr/bin/Xvnc \
    --name "kasmvnc-$n" \
    --interpreter none \
    --max-restarts 10 \
    --min-uptime 10000 \
    --restart-delay 2000 \
    -- \
    :10$n \
    -geometry 1024x768 -depth 24 \
    -SecurityTypes None "-DisableBasicAuth=1" \
    -interface 0.0.0.0 -rfbport 0 \
    -websocketPort $PORT \
    -httpd /usr/share/kasmvnc/www
done
sleep 5
echo "=== curl each slot ==="
for n in 1 2 3 4; do
  printf "slot %s: HTTP %s\\n" "$n" "$(curl -sS -o /dev/null -w '%{http_code}' --max-time 5 http://127.0.0.1:608$n/)"
done
echo "=== curl /vnc.html ==="
for n in 1 2 3 4; do
  printf "slot %s/vnc.html: HTTP %s\\n" "$n" "$(curl -sS -o /dev/null -w '%{http_code}' --max-time 5 http://127.0.0.1:608$n/vnc.html)"
done
echo "=== latest log line ==="
sudo tail -n 5 /root/.pm2/logs/kasmvnc-1-error.log
`;
await sb.files.write("/tmp/add-httpd.sh", script);
await sb.exec.run("chmod +x /tmp/add-httpd.sh", { timeout: 5 });
const r = await sb.exec.run("bash /tmp/add-httpd.sh", { timeout: 60 });
console.log(r.stdout);
