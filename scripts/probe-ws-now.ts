import { Sandbox } from "@opencomputer/sdk";
const sb = await Sandbox.connect("sb-540ca6e2");
const r = await sb.exec.run(`bash -lc '
  set -x
  echo "=== websockify children per slot ==="
  for n in 1 2 3 4; do echo "slot \$n: \$(sudo pgrep -af "websockify --web=/usr/share/novnc 608\$n " | wc -l) processes"; done
  echo "=== last 10 lines of each websockify error log ==="
  for n in 1 2 3 4; do echo "--- slot \$n ---"; sudo tail -n 10 /root/.pm2/logs/websockify-\${n}-error.log 2>/dev/null; done
  echo "=== try curl from inside ==="
  for n in 1 2 3 4; do echo "slot \$n: \$(curl -sS -o /dev/null -w \"%{http_code}\" --max-time 3 http://127.0.0.1:608\$n/)"; done
'`, { timeout: 30 });
console.log(r.stdout); if (r.stderr) console.error(r.stderr);
