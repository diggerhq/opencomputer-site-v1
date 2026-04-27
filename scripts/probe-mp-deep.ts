#!/usr/bin/env tsx
import { Sandbox } from "@opencomputer/sdk";

const sandboxId = process.argv[2] ?? "sb-540ca6e2";
const sb = await Sandbox.connect(sandboxId);

const r = await sb.exec.run(
  `bash -lc '
    set -x
    echo "=== zandronum-server out (last 80) ==="
    sudo tail -n 80 /root/.pm2/logs/zandronum-server-out.log 2>/dev/null || sudo tail -n 80 /root/.pm2/logs/zandronum-server.log 2>/dev/null

    echo "=== zandronum-server err (last 30) ==="
    sudo tail -n 30 /root/.pm2/logs/zandronum-server-error.log 2>/dev/null

    echo "=== zandronum-1 out (last 60) ==="
    sudo tail -n 60 /root/.pm2/logs/zandronum-1-out.log 2>/dev/null || sudo tail -n 60 /root/.pm2/logs/zandronum-1.log 2>/dev/null

    echo "=== zandronum-1 err (last 30) ==="
    sudo tail -n 30 /root/.pm2/logs/zandronum-1-error.log 2>/dev/null

    echo "=== websockify-1 out (last 30) ==="
    sudo tail -n 30 /root/.pm2/logs/websockify-1-out.log 2>/dev/null

    echo "=== websockify-1 err (last 30) ==="
    sudo tail -n 30 /root/.pm2/logs/websockify-1-error.log 2>/dev/null

    echo "=== Xvfb display alive? ==="
    sudo DISPLAY=:101 xdpyinfo 2>&1 | head -10 || echo "(xdpyinfo unavailable)"

    echo "=== windows on Xvfb :101 ==="
    sudo DISPLAY=:101 xwininfo -root -tree 2>&1 | head -30 || true

    echo "=== test direct VNC handshake ==="
    sudo timeout 3 bash -c "exec 3<>/dev/tcp/127.0.0.1/5901; head -c 12 <&3 | xxd | head" 2>&1 || echo "(handshake failed)"

    echo "=== test UDP server reachable ==="
    sudo nc -u -z -v 127.0.0.1 10666 2>&1 | head -3 || echo "(nc unavailable)"

    echo "=== pm2 logs for app 0 zandronum-server ==="
    sudo pm2 logs zandronum-server --lines 40 --nostream 2>&1 | tail -50
  '`,
  { timeout: 60 },
);
console.log(r.stdout);
console.log("--- STDERR ---");
console.log(r.stderr);
