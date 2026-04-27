#!/usr/bin/env tsx
import { Sandbox } from "@opencomputer/sdk";

const sandboxId = process.argv[2] ?? "sb-540ca6e2";
const sb = await Sandbox.connect(sandboxId);

// Match by process *name* (comm) instead of full cmdline so we don't
// accidentally kill our own driver script.
const script = `#!/bin/bash
set -x
sudo pm2 stop websockify-1 websockify-2 websockify-3 websockify-4
sleep 1
# kill orphan children (still holding the listening sockets via inherited fd)
sudo pkill -9 -x websockify 2>/dev/null || true
sleep 2
ps -A -o pid,comm | awk '$2 == "websockify"' || echo "(none)"
sudo pm2 start websockify-1 websockify-2 websockify-3 websockify-4
sleep 4
for n in 1 2 3 4; do
  printf "slot %s: HTTP %s\\n" "$n" "$(curl -sS -o /dev/null -w '%{http_code}' --max-time 5 http://127.0.0.1:608$n/)"
done
`;
await sb.files.write("/tmp/restart-ws.sh", script);
await sb.exec.run("chmod +x /tmp/restart-ws.sh", { timeout: 5 });
const r = await sb.exec.run("bash /tmp/restart-ws.sh", { timeout: 60 });
console.log(r.stdout);
if (r.stderr) console.error(r.stderr);
