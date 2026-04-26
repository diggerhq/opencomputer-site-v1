#!/usr/bin/env tsx
/**
 *   OPENCOMPUTER_API_KEY=... npx tsx scripts/fix-doom-once.ts <sandboxId>
 */

import { Sandbox } from "@opencomputer/sdk";

const sandboxId = process.argv[2];
if (!sandboxId) { console.error("usage: fix-doom-once.ts <sandboxId>"); process.exit(1); }
if (!process.env.OPENCOMPUTER_API_KEY) { console.error("OPENCOMPUTER_API_KEY required"); process.exit(1); }

const sb = await Sandbox.connect(sandboxId);

const script = `#!/bin/bash
set -x

echo "=== STEP 1: tools available ==="
which sudo bash setsid websockify 2>&1 || true
type ulimit

echo "=== STEP 2: nuke existing websockify ==="
sudo pkill -9 -f websockify 2>/dev/null || true
sleep 2
sudo ps -A -o pid,stat,user,comm | awk '$4 ~ /websockify/' || echo "(none alive)"

echo "=== STEP 3: clear old log ==="
sudo rm -f /tmp/doom/websockify.log
sudo touch /tmp/doom/websockify.log
sudo chmod 666 /tmp/doom/websockify.log

echo "=== STEP 4: launch websockify as root with ulimit -SHn 65536 ==="
sudo bash -c 'ulimit -SHn 65536; echo "after ulimit: soft=$(ulimit -Sn) hard=$(ulimit -Hn)"; exec setsid websockify --web=/usr/share/novnc 6080 127.0.0.1:5900' >/tmp/doom/websockify.log 2>&1 </dev/null &
sleep 3

echo "=== STEP 5: what is running? ==="
sudo ps -A -o pid,stat,user,comm,args | grep -E '(websockify|setsid)' | grep -v grep || echo "(nothing matched)"

echo "=== STEP 6: limits of the listener ==="
LISTENER=$(sudo pgrep -of websockify 2>/dev/null || true)
echo "listener pid: $LISTENER"
if [ -n "$LISTENER" ]; then
  sudo cat /proc/$LISTENER/limits 2>&1 | grep "Max open files"
  echo "uid/gid:"
  sudo grep -E '^(Uid|Gid)' /proc/$LISTENER/status
fi

echo "=== STEP 7: websockify.log ==="
sudo cat /tmp/doom/websockify.log

echo "=== STEP 8: local curl ==="
curl -sS -o /dev/null -w "HTTP %{http_code}\\n" --max-time 5 http://127.0.0.1:6080/ 2>&1 || true
`;

await sb.files.write("/tmp/fix-doom.sh", script);
await sb.exec.run("chmod +x /tmp/fix-doom.sh", { timeout: 5 });

const r = await sb.exec.run("bash /tmp/fix-doom.sh", { timeout: 60 });
console.log("====== STDOUT ======");
console.log(r.stdout);
console.log("====== STDERR ======");
console.log(r.stderr);
console.log(`====== EXIT ${r.exitCode} ======`);
