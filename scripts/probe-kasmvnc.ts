import { Sandbox } from "@opencomputer/sdk";
const sb = await Sandbox.connect("sb-d8716609");
const r = await sb.exec.run(`bash -lc '
  set -x
  echo "=== Xvnc binary location ==="
  which Xvnc kasmvncserver vncserver
  ls -la /usr/bin/Xvnc /usr/local/bin/Xvnc 2>/dev/null
  echo "=== Xvnc --help excerpt ==="
  /usr/bin/Xvnc -help 2>&1 | head -50 || true
  echo "=== kasmvnc-1 error log ==="
  sudo tail -n 50 /root/.pm2/logs/kasmvnc-1-error.log 2>/dev/null
  echo "=== kasmvnc-1 out log ==="
  sudo tail -n 30 /root/.pm2/logs/kasmvnc-1-out.log 2>/dev/null
  echo "=== try Xvnc manually with our flags ==="
  sudo timeout 5 /usr/bin/Xvnc :199 -geometry 1024x768 -depth 24 -SecurityTypes None -interface 0.0.0.0 -rfbport 0 -websocketPort 6099 -httpPort 6099 -sslOnly off -AlwaysShared 2>&1 | head -30 || true
'`, { timeout: 30 });
console.log(r.stdout);
if (r.stderr) console.error(r.stderr);
