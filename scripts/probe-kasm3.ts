import { Sandbox } from "@opencomputer/sdk";
const sb = await Sandbox.connect("sb-d8716609");
const r = await sb.exec.run(`bash -lc '
  echo "=== kasmvnc-1 latest error log ==="
  sudo tail -n 30 /root/.pm2/logs/kasmvnc-1-error.log
  echo
  echo "=== run Xvnc manually with new flags ==="
  sudo timeout 5 /usr/bin/Xvnc :199 -geometry 1024x768 -depth 24 -SecurityTypes None "-DisableBasicAuth=1" -interface 0.0.0.0 -rfbport 0 -websocketPort 6099 2>&1 | head -40 || true
'`, { timeout: 30 });
console.log(r.stdout);
