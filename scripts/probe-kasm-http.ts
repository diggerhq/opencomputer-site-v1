#!/usr/bin/env tsx
import { Sandbox } from "@opencomputer/sdk";
const sb = await Sandbox.connect("sb-d8716609");
const r = await sb.exec.run(`bash -lc '
  echo "=== curl -v http://127.0.0.1:6081/ from inside ==="
  curl -v --max-time 5 http://127.0.0.1:6081/ 2>&1 | head -30
  echo
  echo "=== curl https://127.0.0.1:6081/ (force https) ==="
  curl -kv --max-time 5 https://127.0.0.1:6081/ 2>&1 | head -20
  echo
  echo "=== latest kasmvnc-1 log ==="
  sudo tail -n 12 /root/.pm2/logs/kasmvnc-1-error.log
'`, { timeout: 30 });
console.log(r.stdout);
