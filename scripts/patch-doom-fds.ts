#!/usr/bin/env tsx
/**
 * Restart websockify under a higher fd limit. The default 1024 ulimit falls
 * over once many viewers connect at once.
 *
 *   OPENCOMPUTER_API_KEY=... npx tsx scripts/patch-doom-fds.ts <sandboxId>
 */

import { Sandbox } from "@opencomputer/sdk";

const sandboxId = process.argv[2];
if (!sandboxId) {
  console.error("usage: patch-doom-fds.ts <sandboxId>");
  process.exit(1);
}
if (!process.env.OPENCOMPUTER_API_KEY) {
  console.error("OPENCOMPUTER_API_KEY is required");
  process.exit(1);
}

const sb = await Sandbox.connect(sandboxId);

const r = await sb.exec.run(
  `bash -lc '
    set -x
    # 1) nuke the entire websockify tree (parents + forked children)
    # Match only the daemon (must contain "--web=" in argv) so we don't kill
    # our own driver script whose filename happens to contain "websockify".
    sudo pkill -9 -f "websockify.*--web=" 2>/dev/null || true
    sleep 2
    ps -A -o pid,stat,cmd | grep -i websockify | grep -v grep || echo "no websockify processes left"
    # 2) start fresh websockify with raised FD limits.
    #    "ulimit -SHn 65536" sets BOTH soft and hard atomically (root only).
    sudo bash -c "ulimit -SHn 65536; exec setsid \\
      websockify --web=/usr/share/novnc 6080 127.0.0.1:5900" \\
      >/tmp/doom/websockify.log 2>&1 </dev/null &
    sleep 2
    NEW_PID=$(pgrep -f "websockify --web" | head -1)
    if [ -z "$NEW_PID" ]; then
      echo "FAIL: websockify did not start" >&2
      tail -n 20 /tmp/doom/websockify.log >&2
      exit 1
    fi
    echo "new pid: $NEW_PID"
    grep "Max open files" /proc/$NEW_PID/limits || true
    curl -sS -o /dev/null -w "local curl: %{http_code}\\n" --max-time 5 http://127.0.0.1:6080/
  '`,
  { timeout: 60 },
);
console.log(r.stdout);
if (r.stderr) console.error(r.stderr);
if (r.exitCode !== 0) process.exit(r.exitCode);
console.log(`patched ${sandboxId}: websockify restarted with ulimit -n 65536`);
