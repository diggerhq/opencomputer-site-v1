#!/usr/bin/env tsx
import { Sandbox } from "@opencomputer/sdk";

const sandboxId = process.argv[2] ?? "sb-ef24eef4";
const sb = await Sandbox.connect(sandboxId);

const out = await sb.exec.run(
  `sudo bash -lc '
    set -x
    pgrep -af websockify | head -5
    PID=$(pgrep --oldest -f "websockify --web")
    echo "===== listener pid: $PID ====="
    echo "----- ls -la /proc/$PID/ -----"
    ls -la /proc/$PID/ 2>&1 | head -8
    echo "----- /proc/$PID/limits -----"
    cat /proc/$PID/limits 2>&1
    echo "----- /proc/$PID/status (uid/gid) -----"
    grep -E "^(Name|Uid|Gid)" /proc/$PID/status
    echo "----- cmdline -----"
    tr "\\0" " " < /proc/$PID/cmdline; echo
    echo "----- fd count -----"
    ls /proc/$PID/fd | wc -l
  '`,
  { timeout: 30 },
);
console.log("STDOUT:");
console.log(out.stdout);
console.log("STDERR:");
console.log(out.stderr);
console.log("EXIT:", out.exitCode);
