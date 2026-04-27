#!/usr/bin/env tsx
import { Sandbox } from "@opencomputer/sdk";
const sb = await Sandbox.connect("sb-d8716609");
const r = await sb.exec.run(`bash -lc '
  echo "=== full pm2 list ==="
  sudo pm2 list
  echo
  echo "=== ports listening ==="
  sudo ss -tlnp | grep -E ":(60[0-9]{2}|7000)" | head -10
  echo
  echo "=== curl /vnc.html WITH realistic browser headers ==="
  for n in 1 2 3 4; do
    code=$(curl -sS -o /dev/null -w "%{http_code}" --max-time 5 \
      -H "User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36" \
      -H "Accept: text/html,application/xhtml+xml" \
      "http://127.0.0.1:608$n/vnc.html" 2>/dev/null || echo "000")
    echo "slot $n vnc.html: $code"
  done
  echo
  echo "=== check Xvnc help for AllowedOrigins or origin check ==="
  /usr/bin/Xvnc -help 2>&1 | grep -i -A1 "origin\\|allowedorigins\\|sec-web" | head
'`, { timeout: 30 });
console.log(r.stdout);
