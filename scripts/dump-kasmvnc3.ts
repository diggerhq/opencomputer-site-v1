import { Sandbox } from "@opencomputer/sdk";
const sb = await Sandbox.connect("sb-d8716609");
const r = await sb.exec.run(`bash -lc '
  grep -n "StartXvncOrExit\\|cmd =\\|\\\$cmd =\\|XAUTHORITY\\|\\.Xauthority\\|\\.\\\$cmd\\|exec.*\\\$cmd\\|xkbcomp\\|XKB" /usr/bin/kasmvncserver | head -40
  echo "---"
  grep -n -A20 "sub StartXvncOrExit" /usr/bin/kasmvncserver | head -40
  echo "---"
  grep -n -B1 -A3 "system.*Xvnc\\|exec.*Xvnc\\|\\\$Xvnc =" /usr/bin/kasmvncserver
'`, { timeout: 30 });
console.log(r.stdout);
