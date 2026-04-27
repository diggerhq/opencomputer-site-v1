#!/usr/bin/env tsx
import { Sandbox } from "@opencomputer/sdk";
const sb = await Sandbox.connect("sb-d8716609");
const r = await sb.exec.run(`bash -lc '
  echo "=== try a bunch of paths from inside ==="
  for path in / /vnc.html /index.html /app /websockify; do
    code=$(curl -sS -o /dev/null -w "%{http_code}" --max-time 3 \
      -H "User-Agent: Mozilla/5.0" \
      -H "Accept: text/html,*/*" \
      "http://127.0.0.1:6081$path" 2>/dev/null || echo "000")
    echo "$path -> $code"
  done
  echo
  echo "=== try with WS Upgrade headers ==="
  curl -v --max-time 3 \
    -H "Upgrade: websocket" -H "Connection: Upgrade" \
    -H "Sec-WebSocket-Version: 13" -H "Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==" \
    http://127.0.0.1:6081/websockify 2>&1 | head -30
  echo
  echo "=== check if /usr/local/share/kasmvnc/www exists + has vnc.html ==="
  ls /usr/local/share/kasmvnc/www/ 2>&1 | head -10
  echo
  echo "=== look for httpd / http_port options in kasmvnc help ==="
  /usr/bin/Xvnc -help 2>&1 | grep -A1 -E "httpd|http_port|http " | head -10
'`, { timeout: 30 });
console.log(r.stdout);
