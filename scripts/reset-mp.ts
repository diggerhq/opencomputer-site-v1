#!/usr/bin/env tsx
import { Sandbox } from "@opencomputer/sdk";

const sandboxId = process.argv[2] ?? "sb-540ca6e2";
const sb = await Sandbox.connect(sandboxId);

const script = `#!/bin/bash
set -x
echo "=== full pm2 + child reset ==="
sudo pm2 kill 2>&1 | tail -5
sleep 2
# kill any leftover child processes by comm name (won't match this script)
sudo pkill -9 -x websockify 2>/dev/null || true
sudo pkill -9 -x zandronum 2>/dev/null || true
sudo pkill -9 -x zandronum-server 2>/dev/null || true
sudo pkill -9 -x x11vnc 2>/dev/null || true
sudo pkill -9 -x Xvfb 2>/dev/null || true
sleep 2
echo "=== restart from ecosystem ==="
sudo bash -c 'ulimit -SHn 65536; pm2 start /tmp/doom-mp/ecosystem.config.cjs'
sleep 8
sudo pm2 list
echo "=== curl all 4 slots ==="
for n in 1 2 3 4; do
  printf "slot %s: HTTP %s\\n" "$n" "$(curl -sS -o /dev/null -w '%{http_code}' --max-time 5 http://127.0.0.1:608$n/)"
done
`;
await sb.files.write("/tmp/reset-mp.sh", script);
await sb.exec.run("chmod +x /tmp/reset-mp.sh", { timeout: 5 });
const r = await sb.exec.run("bash /tmp/reset-mp.sh", { timeout: 90 });
console.log(r.stdout);
if (r.stderr) console.error(r.stderr);
