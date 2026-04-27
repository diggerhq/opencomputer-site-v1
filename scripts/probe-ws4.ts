import { Sandbox } from "@opencomputer/sdk";
const sb = await Sandbox.connect("sb-fc4b0acf");
const r = await sb.exec.run(`bash -lc '
  echo "=== websockify-4 error log (last 30 lines) ==="
  sudo tail -n 30 /root/.pm2/logs/websockify-4-error.log 2>/dev/null
  echo "=== websockify-4 out log (last 10) ==="
  sudo tail -n 10 /root/.pm2/logs/websockify-4-out.log 2>/dev/null
  echo "=== test --idle-timeout flag manually ==="
  sudo timeout 3 /usr/local/bin/websockify --web=/usr/share/novnc --idle-timeout=30 6099 127.0.0.1:5904 2>&1 | head -20 || echo "(exit $?)"
  echo "=== websockify --help excerpt for idle-timeout ==="
  /usr/local/bin/websockify --help 2>&1 | grep -i -A1 idle || echo "(no idle option found)"
'`, { timeout: 30 });
console.log(r.stdout);
if (r.stderr) console.error(r.stderr);
