#!/usr/bin/env tsx
import { Sandbox } from "@opencomputer/sdk";
const sb = await Sandbox.connect("sb-d8716609");
const script = `#!/bin/bash
set -x
echo "=== existing X fonts ==="
ls /usr/share/fonts/X11/ 2>&1 || echo "(no X11 fonts)"
dpkg -l | grep -i xfont | head

echo "=== install xfonts-base + xkb-data already there ==="
sudo apt-get install -y --no-install-recommends xfonts-base xfonts-utils 2>&1 | tail -3

echo "=== test Xvnc via pm2 with HOME, XAUTHORITY, -fp set ==="
sudo pm2 delete kasmvnc-test 2>/dev/null || true
sleep 1
sudo rm -f /tmp/.X11-unix/X198 /tmp/.X198-lock
sudo mkdir -p /tmp/doom-mp
sudo touch /tmp/doom-mp/.Xauthority

cat > /tmp/run-xvnc-test.sh <<'SCRIPT'
#!/bin/bash
export HOME=/tmp/doom-mp
export XAUTHORITY=/tmp/doom-mp/.Xauthority
export PATH=/usr/local/bin:/usr/bin:/bin
exec /usr/bin/Xvnc :198 \
  -geometry 1024x768 -depth 24 \
  -SecurityTypes None -DisableBasicAuth=1 \
  -interface 0.0.0.0 -rfbport 0 \
  -websocketPort 6198 \
  -fp /usr/share/fonts/X11/misc/
SCRIPT
chmod +x /tmp/run-xvnc-test.sh

sudo pm2 start /tmp/run-xvnc-test.sh --name kasmvnc-test --interpreter bash --no-autorestart
sleep 4
echo "=== test status ==="
sudo pm2 list | grep kasmvnc-test
echo "=== test error log ==="
sudo tail -n 30 /root/.pm2/logs/kasmvnc-test-error.log
echo "=== curl test slot ==="
curl -sS -o /dev/null -w "HTTP %{http_code}\\n" --max-time 5 http://127.0.0.1:6198/
`;
await sb.files.write("/tmp/probe-fonts.sh", script);
await sb.exec.run("chmod +x /tmp/probe-fonts.sh", { timeout: 5 });
const r = await sb.exec.run("bash /tmp/probe-fonts.sh", { timeout: 90 });
console.log(r.stdout);
console.log("--- STDERR ---");
console.log(r.stderr);
