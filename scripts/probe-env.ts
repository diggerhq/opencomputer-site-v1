#!/usr/bin/env tsx
import { Sandbox } from "@opencomputer/sdk";
const sb = await Sandbox.connect("sb-d8716609");
const script = `#!/bin/bash
set -x
sudo pm2 delete envtest 2>/dev/null || true
sudo pm2 start /usr/bin/env --name envtest --interpreter none --no-autorestart
sleep 2
echo "=== pm2-child env ==="
sudo cat /root/.pm2/logs/envtest-out.log | sort
echo
echo "=== exec-session env (this script's view) ==="
env | sort
`;
await sb.files.write("/tmp/probe-env.sh", script);
await sb.exec.run("chmod +x /tmp/probe-env.sh", { timeout: 5 });
const r = await sb.exec.run("bash /tmp/probe-env.sh", { timeout: 30 });
console.log(r.stdout);
