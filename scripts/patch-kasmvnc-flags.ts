import { Sandbox } from "@opencomputer/sdk";
const sb = await Sandbox.connect("sb-d8716609");
const r = await sb.exec.run(`bash -lc '
  set -x
  for n in 1 2 3 4; do
    sudo pm2 delete kasmvnc-$n || true
    sudo rm -f /tmp/.X11-unix/X10$n
  done
  sleep 1
  for n in 1 2 3 4; do
    PORT=$((6080+n))
    sudo pm2 start /usr/bin/Xvnc \
      --name "kasmvnc-$n" \
      --interpreter none \
      --restart-delay 2000 \
      -- \
      :10$n \
      -geometry 1024x768 \
      -depth 24 \
      -SecurityTypes None \
      "-DisableBasicAuth=1" \
      -interface 0.0.0.0 \
      -rfbport 0 \
      -websocketPort $PORT
  done
  sleep 5
  sudo pm2 list | grep kasmvnc
  for n in 1 2 3 4; do
    echo "slot $n: $(curl -sS -o /dev/null -w "%{http_code}" --max-time 5 http://127.0.0.1:$((6080+n))/)"
  done
'`, { timeout: 60 });
console.log(r.stdout);
if (r.stderr) console.error(r.stderr);
