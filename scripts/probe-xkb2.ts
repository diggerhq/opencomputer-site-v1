import { Sandbox } from "@opencomputer/sdk";
const sb = await Sandbox.connect("sb-d8716609");
const r = await sb.exec.run(`bash -lc '
  echo "=== check pm2 env for kasmvnc-test ==="
  sudo cat /proc/$(sudo pgrep -of -f "Xvnc :199")/environ 2>/dev/null | tr "\0" "\n" | head -20 || true
  echo
  echo "=== restart with explicit PATH env ==="
  sudo pm2 delete kasmvnc-test 2>/dev/null || true
  sleep 1
  sudo pm2 start /usr/bin/Xvnc \
    --name kasmvnc-test \
    --interpreter none \
    --update-env \
    -- \
    :199 -geometry 1024x768 -depth 24 -SecurityTypes None "-DisableBasicAuth=1" \
    -interface 0.0.0.0 -rfbport 0 -websocketPort 6199
  # set env via API after start
  sudo PATH="/usr/local/bin:/usr/bin:/bin" pm2 restart kasmvnc-test --update-env
  sleep 4
  sudo pm2 list | grep kasmvnc-test
  echo "=== test log (last 15 lines) ==="
  sudo tail -n 15 /root/.pm2/logs/kasmvnc-test-error.log
'`, { timeout: 60 });
console.log(r.stdout);
