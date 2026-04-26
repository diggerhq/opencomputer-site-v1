#!/usr/bin/env tsx
/**
 * Check the actual FD limit (and current FD count) on each websockify
 * process running inside a DOOM sandbox.
 *
 *   OPENCOMPUTER_API_KEY=... npx tsx scripts/check-doom-fds.ts <sandboxId>
 *
 * Looks for "Max open files" and reports both soft and hard limits per pid.
 */

import { Sandbox } from "@opencomputer/sdk";

const sandboxId = process.argv[2];
if (!sandboxId) { console.error("usage: check-doom-fds.ts <sandboxId>"); process.exit(1); }
if (!process.env.OPENCOMPUTER_API_KEY) { console.error("OPENCOMPUTER_API_KEY required"); process.exit(1); }

const sb = await Sandbox.connect(sandboxId);

// The forked children are recycled per-connection and can vanish mid-read.
// The LISTENER is the long-lived parent — find it via --oldest.
const pidRes = await sb.exec.run("sudo pgrep --oldest -f 'websockify --web'", { timeout: 10 });
const listenerPid = pidRes.stdout.trim();
if (!listenerPid) {
  console.error("no websockify listener found");
  process.exit(1);
}
console.log(`websockify listener pid: ${listenerPid}`);

const detail = await sb.exec.run(
  `sudo cat /proc/${listenerPid}/limits | grep 'Max open files';` +
  ` echo "fd_count=$(sudo ls /proc/${listenerPid}/fd | wc -l)";` +
  ` echo "cmdline=$(sudo tr '\\0' ' ' < /proc/${listenerPid}/cmdline)"`,
  { timeout: 10 },
);
console.log(detail.stdout);

console.log("verdict:");
const sample = await sb.exec.run(`sudo awk '/Max open files/{print $4}' /proc/${listenerPid}/limits`, { timeout: 5 });
const soft = parseInt(sample.stdout.trim(), 10);
if (soft >= 65536) console.log(`  ✓ ulimit raise took: soft = ${soft}`);
else if (soft <= 4096) console.log(`  ✗ ulimit raise FAILED: soft = ${soft} (still at user-default — runuser/PAM stripped it)`);
else console.log(`  ? unexpected soft limit: ${soft}`);
