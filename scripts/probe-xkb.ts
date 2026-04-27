import { Sandbox } from "@opencomputer/sdk";
const sb = await Sandbox.connect("sb-d8716609");
const r = await sb.exec.run(`bash -lc '
  echo "=== xkb tools/data check ==="
  which xkbcomp
  ls /usr/share/X11/xkb/ 2>&1 | head -8
  dpkg -l | grep -E "xkb|x11-xkb" | head
  echo "=== try Xvnc via pm2 with LANG/LC_ALL set + verbose ==="
  sudo pm2 delete kasmvnc-test 2>/dev/null || true
  sudo pm2 start /usr/bin/Xvnc \
    --name kasmvnc-test \
    --interpreter none \
    -- \
    :199 -geometry 1024x768 -depth 24 -SecurityTypes None "-DisableBasicAuth=1" \
    -interface 0.0.0.0 -rfbport 0 -websocketPort 6199
  sleep 4
  sudo pm2 list | grep kasmvnc-test
  echo "=== test log ==="
  sudo tail -n 30 /root/.pm2/logs/kasmvnc-test-error.log
'`, { timeout: 30 });
console.log(r.stdout);
