#!/usr/bin/env tsx
/**
 *   OPENCOMPUTER_API_KEY=... npx tsx scripts/probe-mp.ts <sandboxId>
 */

import { Sandbox } from "@opencomputer/sdk";

const sandboxId = process.argv[2];
if (!sandboxId) { console.error("usage: probe-mp.ts <sandboxId>"); process.exit(1); }
if (!process.env.OPENCOMPUTER_API_KEY) { console.error("OPENCOMPUTER_API_KEY required"); process.exit(1); }

const sb = await Sandbox.connect(sandboxId);

const script = `#!/bin/bash
set -x

echo "=== pm2 list (sudo) ==="
sudo pm2 list 2>&1 || true

echo "=== pm2 list (user) ==="
pm2 list 2>&1 || echo "(no user pm2)"

echo "=== running processes ==="
sudo ps -eo pid,user,stat,comm,args | grep -E '(zandronum|Xvfb|x11vnc|websockify)' | grep -v grep || echo "(none)"

echo "=== listening sockets ==="
sudo ss -tlnp 2>&1 | grep -E ':(10666|59[0-9]{2}|60[0-9]{2})' || echo "(none on doom ports)"

echo "=== pm2 logs (last 50) ==="
sudo pm2 logs --lines 50 --nostream 2>&1 | head -200 || true

echo "=== ecosystem.config.cjs ==="
sudo cat /tmp/doom-mp/ecosystem.config.cjs | head -40

echo "=== /root/.pm2/logs (if any) ==="
sudo ls -la /root/.pm2/logs/ 2>&1 | head -30 || true

echo "=== zandronum binary ==="
which zandronum zandronum-server
sudo zandronum --version 2>&1 | head -3 || true
`;

await sb.files.write("/tmp/probe-mp.sh", script);
await sb.exec.run("chmod +x /tmp/probe-mp.sh", { timeout: 5 });
const r = await sb.exec.run("bash /tmp/probe-mp.sh", { timeout: 60 });
console.log(r.stdout);
console.log("--- STDERR ---");
console.log(r.stderr);
console.log("EXIT:", r.exitCode);
