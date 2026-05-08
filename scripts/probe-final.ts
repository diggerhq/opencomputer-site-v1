#!/usr/bin/env tsx
import { Sandbox } from "@opencomputer/sdk";
const sb = await Sandbox.connect("sb-d8716609");
const r = await sb.exec.run(`bash -lc '
  echo "=== listening ports ==="
  sudo ss -tlnp | grep -E ":(60[0-9]{2}|7000)" | head -10
  echo
  echo "=== kasmvnc-1 error log (last 20 lines) ==="
  sudo tail -n 20 /root/.pm2/logs/kasmvnc-1-error.log
  echo
  echo "=== Xvnc procs running ==="
  sudo ps -o pid,stat,user,comm,args | grep Xvnc | grep -v grep | head
'`, { timeout: 30 });
console.log(r.stdout);
