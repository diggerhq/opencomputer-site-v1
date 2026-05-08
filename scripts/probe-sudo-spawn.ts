#!/usr/bin/env tsx
import { Sandbox } from "@opencomputer/sdk";
const sb = await Sandbox.connect("sb-d8716609");
const script = `#!/bin/bash
set -x
sudo rm -f /tmp/.X11-unix/X192 /tmp/.X192-lock
sudo pm2 delete kasmvnc-test 2>/dev/null || true
sleep 1

echo "=== test A: pm2 launches /usr/bin/sudo /usr/bin/Xvnc ==="
sudo pm2 start /usr/bin/sudo --name kasmvnc-test --interpreter none --no-autorestart -- \
  /usr/bin/Xvnc :192 -SecurityTypes None -DisableBasicAuth=1 \
  -interface 0.0.0.0 -rfbport 0 -websocketPort 6192
sleep 4
echo "--- log: ---"
sudo tail -n 20 /root/.pm2/logs/kasmvnc-test-error.log 2>&1
echo "--- curl: ---"
curl -sS -o /dev/null -w "HTTP %{http_code}\\n" --max-time 5 http://127.0.0.1:6192/

echo "=== if A fails, try B: pm2 launches setsid sudo Xvnc ==="
sudo pm2 delete kasmvnc-test 2>/dev/null || true
sudo rm -f /tmp/.X11-unix/X191 /tmp/.X191-lock
sleep 1

cat > /tmp/xvnc-setsid.sh <<'SCRIPT'
#!/bin/bash
exec setsid -f /usr/bin/sudo /usr/bin/Xvnc :191 \
  -SecurityTypes None -DisableBasicAuth=1 \
  -interface 0.0.0.0 -rfbport 0 -websocketPort 6191
SCRIPT
chmod +x /tmp/xvnc-setsid.sh

# Note: setsid -f means daemonize; pm2 will think it exited. Use without -f
# and capture stdout/stderr.
cat > /tmp/xvnc-setsid2.sh <<'SCRIPT'
#!/bin/bash
exec setsid /usr/bin/sudo /usr/bin/Xvnc :191 \
  -SecurityTypes None -DisableBasicAuth=1 \
  -interface 0.0.0.0 -rfbport 0 -websocketPort 6191
SCRIPT
chmod +x /tmp/xvnc-setsid2.sh

sudo pm2 start /tmp/xvnc-setsid2.sh --name kasmvnc-test --interpreter bash --no-autorestart
sleep 4
echo "--- log: ---"
sudo tail -n 20 /root/.pm2/logs/kasmvnc-test-error.log 2>&1
echo "--- curl: ---"
curl -sS -o /dev/null -w "HTTP %{http_code}\\n" --max-time 5 http://127.0.0.1:6191/
`;
await sb.files.write("/tmp/probe-sudo.sh", script);
await sb.exec.run("chmod +x /tmp/probe-sudo.sh", { timeout: 5 });
const r = await sb.exec.run("bash /tmp/probe-sudo.sh", { timeout: 60 });
console.log(r.stdout);
