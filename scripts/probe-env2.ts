#!/usr/bin/env tsx
import { Sandbox } from "@opencomputer/sdk";
const sb = await Sandbox.connect("sb-d8716609");
const script = `#!/bin/bash
set -x
sudo rm -f /tmp/.X11-unix/X193 /tmp/.X193-lock
sudo pm2 delete kasmvnc-test 2>/dev/null || true
sleep 1

cat > /tmp/xvnc-wrapper.sh <<'SCRIPT'
#!/bin/bash
exec env -i \
  HOME=/root \
  PATH=/usr/local/bin:/usr/bin:/bin \
  LANG=C.UTF-8 \
  LC_ALL=C.UTF-8 \
  TERM=linux \
  /usr/bin/Xvnc :193 \
    -geometry 1024x768 -depth 24 \
    -SecurityTypes None -DisableBasicAuth=1 \
    -interface 0.0.0.0 -rfbport 0 \
    -websocketPort 6193
SCRIPT
chmod +x /tmp/xvnc-wrapper.sh
sudo mkdir -p /root/.vnc
echo "exec true" | sudo tee /root/.vnc/xstartup >/dev/null
sudo chmod +x /root/.vnc/xstartup

sudo pm2 start /tmp/xvnc-wrapper.sh --name kasmvnc-test --interpreter bash --no-autorestart
sleep 4
echo "=== status ==="
sudo pm2 list | grep kasmvnc-test
echo "=== error log (last 25) ==="
sudo tail -n 25 /root/.pm2/logs/kasmvnc-test-error.log
echo "=== curl ==="
curl -sS -o /dev/null -w "HTTP %{http_code}\\n" --max-time 5 http://127.0.0.1:6193/
`;
await sb.files.write("/tmp/probe-env2.sh", script);
await sb.exec.run("chmod +x /tmp/probe-env2.sh", { timeout: 5 });
const r = await sb.exec.run("bash /tmp/probe-env2.sh", { timeout: 30 });
console.log(r.stdout);
