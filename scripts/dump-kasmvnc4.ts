import { Sandbox } from "@opencomputer/sdk";
const sb = await Sandbox.connect("sb-d8716609");
const r = await sb.exec.run(`bash -lc '
  grep -n -A40 "sub ConstructXvncCmd" /usr/bin/kasmvncserver | head -50
  echo "---"
  grep -n -A20 "sub StartXvncAndRecordPID" /usr/bin/kasmvncserver | head -30
'`, { timeout: 30 });
console.log(r.stdout);
