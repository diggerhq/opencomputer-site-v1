import { Sandbox } from "@opencomputer/sdk";
const sb = await Sandbox.connect("sb-fc4b0acf");
const r = await sb.exec.run(`bash -lc '
  echo "=== listening sockets on relevant ports ==="
  sudo ss -tlnp | grep -E ":(60[0-9]{2}|7000|59[0-9]{2})" || echo "(none)"
  echo "=== curl 127.0.0.1:6081 from inside ==="
  curl -sS -o /dev/null -w "HTTP %{http_code}\\n" --max-time 5 http://127.0.0.1:6081/
  echo "=== curl 127.0.0.1:7000/api/state from inside ==="
  curl -sS -o /dev/null -w "HTTP %{http_code}\\n" --max-time 5 http://127.0.0.1:7000/api/state
  echo "=== last 10 lines websockify-1 ==="
  sudo tail -n 10 /root/.pm2/logs/websockify-1-out.log 2>/dev/null
  sudo tail -n 10 /root/.pm2/logs/websockify-1-error.log 2>/dev/null
'`, { timeout: 30 });
console.log(r.stdout);
if (r.stderr) console.error(r.stderr);
