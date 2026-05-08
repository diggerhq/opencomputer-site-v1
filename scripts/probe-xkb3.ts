#!/usr/bin/env tsx
import { Sandbox } from "@opencomputer/sdk";
const sb = await Sandbox.connect("sb-d8716609");
const script = `#!/bin/bash
set -x
sudo pm2 delete kasmvnc-test 2>/dev/null || true
sleep 1

cat > /tmp/run-xvnc.sh <<'SCRIPT'
#!/bin/bash
export PATH=/usr/local/bin:/usr/bin:/bin
export HOME=/tmp/doom-mp
exec /usr/bin/Xvnc :199 -geometry 1024x768 -depth 24 -SecurityTypes None -DisableBasicAuth=1 -interface 0.0.0.0 -rfbport 0 -websocketPort 6199
SCRIPT
chmod +x /tmp/run-xvnc.sh

sudo pm2 start /tmp/run-xvnc.sh --name kasmvnc-test --interpreter bash
sleep 4
sudo pm2 list | grep kasmvnc-test
echo "=== test error log (last 20) ==="
sudo tail -n 20 /root/.pm2/logs/kasmvnc-test-error.log
echo "=== try curl ==="
curl -sS -o /dev/null -w "test slot: HTTP %{http_code}\\n" --max-time 5 http://127.0.0.1:6199/
`;
await sb.files.write("/tmp/xkbtest.sh", script);
await sb.exec.run("chmod +x /tmp/xkbtest.sh", { timeout: 5 });
const r = await sb.exec.run("bash /tmp/xkbtest.sh", { timeout: 30 });
console.log(r.stdout);
if (r.stderr) console.error(r.stderr);
