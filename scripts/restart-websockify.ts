#!/usr/bin/env tsx
/**
 *   OPENCOMPUTER_API_KEY=... npx tsx scripts/restart-websockify.ts <sandboxId>
 *
 * Kills any running websockify and starts a fresh one. Uses a precise pgrep
 * pattern so we don't accidentally kill our own driver script.
 */

import { Sandbox } from "@opencomputer/sdk";

const sandboxId = process.argv[2];
if (!sandboxId) { console.error("usage: restart-websockify.ts <sandboxId>"); process.exit(1); }
if (!process.env.OPENCOMPUTER_API_KEY) { console.error("OPENCOMPUTER_API_KEY required"); process.exit(1); }

const sb = await Sandbox.connect(sandboxId);

const script = `#!/bin/bash
set -x

echo "=== which websockify ==="
which websockify
ls -l /usr/local/bin/websockify /usr/bin/websockify 2>/dev/null

echo "=== kill running websockify (precise pattern) ==="
# Match only the daemon (must contain "--web=" in argv) so we don't kill
# our own driver script whose filename happens to contain "websockify".
sudo pkill -9 -f "websockify.*--web=" 2>/dev/null || true
sleep 2
sudo ps -A -o pid,stat,user,comm | awk '$4 ~ /websockify/' || echo "(none alive)"

echo "=== start fresh listener ==="
sudo rm -f /tmp/doom/websockify.log
sudo bash -c 'ulimit -SHn 65536; exec setsid websockify --web=/usr/share/novnc 6080 127.0.0.1:5900' >/tmp/doom/websockify.log 2>&1 </dev/null &
sleep 3

echo "=== verify ==="
LISTENER=$(sudo pgrep -of "websockify.*--web=" || true)
echo "listener pid: $LISTENER"
if [ -n "$LISTENER" ]; then
  sudo cat /proc/$LISTENER/limits | grep "Max open files"
  echo "binary: $(sudo readlink /proc/$LISTENER/exe)"
fi
sudo cat /tmp/doom/websockify.log
curl -sS -o /dev/null -w "local curl: HTTP %{http_code}\\n" --max-time 5 http://127.0.0.1:6080/
`;

await sb.files.write("/tmp/restart-ws.sh", script);
await sb.exec.run("chmod +x /tmp/restart-ws.sh", { timeout: 5 });
const r = await sb.exec.run("bash /tmp/restart-ws.sh", { timeout: 60 });
console.log("====== STDOUT ======");
console.log(r.stdout);
console.log("====== STDERR ======");
console.log(r.stderr);
console.log(`====== EXIT ${r.exitCode} ======`);
