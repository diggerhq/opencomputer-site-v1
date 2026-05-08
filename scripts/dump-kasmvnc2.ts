import { Sandbox } from "@opencomputer/sdk";
const sb = await Sandbox.connect("sb-d8716609");
const r = await sb.exec.run(`bash -lc '
  echo "=== how kasmvncserver spawns Xvnc ==="
  grep -n -B2 -A8 "Xvnc\\|exec.*X.*vnc" /usr/bin/kasmvncserver | head -80
'`, { timeout: 30 });
console.log(r.stdout);
