#!/usr/bin/env tsx
import { Sandbox } from "@opencomputer/sdk";

const sandboxId = process.argv[2] ?? "sb-540ca6e2";
const sb = await Sandbox.connect(sandboxId);

// Send Zandronum a SIGUSR1 won't help; instead, restart the server with
// explicit deathmatch flag and short warmup so the match starts immediately.
// Players' Zandronum clients will auto-reconnect (they have -connect 127.0.0.1).
const r = await sb.exec.run(
  "sudo pm2 restart zandronum-server zandronum-1 zandronum-2 zandronum-3 zandronum-4",
  { timeout: 30 },
);
console.log(r.stdout);
console.log("\nWait ~10s for clients to reconnect, then refresh your browser tabs.");
