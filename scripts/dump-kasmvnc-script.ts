import { Sandbox } from "@opencomputer/sdk";
const sb = await Sandbox.connect("sb-d8716609");
const r = await sb.exec.run(`bash -lc '
  echo "=== /usr/bin/kasmvncserver - looking for XKB / xkbcomp / env handling ==="
  grep -n -E "XKB|xkb|HOME|XAUTHORITY|XKBCOMP|setlocale|LANG|LC_|setpgrp|setsid|fork|environ|TMPDIR|/tmp" /usr/bin/kasmvncserver | head -60
  echo
  echo "=== first 60 lines of kasmvncserver ==="
  head -60 /usr/bin/kasmvncserver
'`, { timeout: 30 });
console.log(r.stdout);
