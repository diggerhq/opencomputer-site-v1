#!/usr/bin/env tsx
/**
 *   OPENCOMPUTER_API_KEY=... npx tsx scripts/diagnose-doom.ts <sandboxId>
 */

import { Sandbox } from "@opencomputer/sdk";

const sandboxId = process.argv[2];
if (!sandboxId) { console.error("usage: diagnose-doom.ts <sandboxId>"); process.exit(1); }
if (!process.env.OPENCOMPUTER_API_KEY) { console.error("OPENCOMPUTER_API_KEY required"); process.exit(1); }

const sb = await Sandbox.connect(sandboxId);

const sections: Array<[string, string]> = [
  ["whoami / uid", "id"],
  ["current ulimit -n (soft/hard)", "ulimit -Sn; ulimit -Hn"],
  ["websockify processes", "ps -eo pid,user,cmd | grep -E 'websockify|x11vnc|chocolate|Xvfb' | grep -v grep"],
  ["websockify Max open files (from /proc/.../limits)", "for p in $(pgrep -f websockify); do echo \"pid=$p\"; grep 'Max open files' /proc/$p/limits 2>/dev/null; done"],
  ["websockify open FD count", "for p in $(pgrep -f websockify); do echo \"pid=$p fd_count=$(ls /proc/$p/fd 2>/dev/null | wc -l)\"; done"],
  ["TCP socket states (top 10)", "ss -tn state all | awk 'NR>1{print $1}' | sort | uniq -c | sort -rn | head"],
  ["sockets in CLOSE_WAIT", "ss -tn state close-wait | wc -l"],
  ["established sockets to :6080 or :5900", "ss -tn 'sport = :6080 or sport = :5900' | wc -l"],
  ["curl localhost:6080 (should 200)", "curl -sS -o /dev/null -w '%{http_code}\\n' --max-time 5 http://127.0.0.1:6080/ || true"],
  ["last 30 lines of websockify.log", "tail -n 30 /tmp/doom/websockify.log 2>/dev/null"],
];

for (const [label, cmd] of sections) {
  console.log(`\n── ${label} ─────────────────────────────`);
  const r = await sb.exec.run(`bash -lc ${JSON.stringify(cmd)}`, { timeout: 30 });
  process.stdout.write(r.stdout);
  if (r.stderr) process.stderr.write(r.stderr);
}
