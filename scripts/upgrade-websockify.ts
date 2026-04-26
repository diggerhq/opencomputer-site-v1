#!/usr/bin/env tsx
/**
 *   OPENCOMPUTER_API_KEY=... npx tsx scripts/upgrade-websockify.ts <sandboxId>
 *
 * Replaces the apt-installed websockify (which uses select() and dies once
 * any fd > 1023) with the latest pip version (uses epoll via selectors,
 * no FD_SETSIZE limit). Then restarts the listener.
 */

import { Sandbox } from "@opencomputer/sdk";

const sandboxId = process.argv[2];
if (!sandboxId) { console.error("usage: upgrade-websockify.ts <sandboxId>"); process.exit(1); }
if (!process.env.OPENCOMPUTER_API_KEY) { console.error("OPENCOMPUTER_API_KEY required"); process.exit(1); }

const sb = await Sandbox.connect(sandboxId);

const script = `#!/bin/bash
set -x

echo "=== current websockify version ==="
websockify --version 2>&1 || true
which websockify

echo "=== install latest websockify from pip ==="
sudo apt-get install -y python3-pip 2>&1 | tail -3
sudo pip install --break-system-packages --upgrade websockify 2>&1 | tail -8

echo "=== new version ==="
which websockify
websockify --version 2>&1 || true
ls -l $(which websockify) || true

echo "=== kill existing websockify ==="
sudo pkill -9 -f websockify 2>/dev/null || true
sleep 2

echo "=== clear log and restart ==="
sudo rm -f /tmp/doom/websockify.log
sudo bash -c 'ulimit -SHn 65536; exec setsid websockify --web=/usr/share/novnc 6080 127.0.0.1:5900' >/tmp/doom/websockify.log 2>&1 </dev/null &
sleep 3

echo "=== verify ==="
LISTENER=$(sudo pgrep -of websockify || true)
echo "listener pid: $LISTENER"
if [ -n "$LISTENER" ]; then
  sudo cat /proc/$LISTENER/limits | grep "Max open files"
fi
sudo cat /tmp/doom/websockify.log
curl -sS -o /dev/null -w "local curl: HTTP %{http_code}\\n" --max-time 5 http://127.0.0.1:6080/
`;

await sb.files.write("/tmp/upgrade-websockify.sh", script);
await sb.exec.run("chmod +x /tmp/upgrade-websockify.sh", { timeout: 5 });
const r = await sb.exec.run("bash /tmp/upgrade-websockify.sh", { timeout: 180 });
console.log("====== STDOUT ======");
console.log(r.stdout);
console.log("====== STDERR ======");
console.log(r.stderr);
console.log(`====== EXIT ${r.exitCode} ======`);
