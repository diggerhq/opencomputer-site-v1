import { Sandbox } from "@opencomputer/sdk";
const sb = await Sandbox.connect("sb-d8716609");
const r = await sb.exec.run(`bash -lc '
  echo "=== kasmvnc-1 error log ==="
  sudo tail -n 40 /root/.pm2/logs/kasmvnc-1-error.log 2>/dev/null
  echo "=== running Xvnc processes ==="
  sudo ps -A -o pid,stat,user,comm,args | grep Xvnc | grep -v grep || echo "(none)"
  echo "=== try running Xvnc manually with corrected flags ==="
  sudo timeout 3 /usr/bin/Xvnc :199 -geometry 1024x768 -depth 24 -SecurityTypes None -DisableBasicAuth -interface 0.0.0.0 -rfbport 0 -websocketPort 6099 -sslOnly off 2>&1 | head -30 || true
'`, { timeout: 30 });
console.log(r.stdout);
if (r.stderr) console.error(r.stderr);
