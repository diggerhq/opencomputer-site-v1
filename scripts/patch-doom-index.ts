#!/usr/bin/env tsx
/**
 * Replaces the directory listing at the root of the noVNC web server with a
 * redirect to the auto-connecting client. Run against an existing DOOM sandbox.
 *
 *   OPENCOMPUTER_API_KEY=... npx tsx scripts/patch-doom-index.ts <sandboxId>
 */

import { Sandbox } from "@opencomputer/sdk";

const sandboxId = process.argv[2];
if (!sandboxId) {
  console.error("usage: patch-doom-index.ts <sandboxId>");
  process.exit(1);
}
if (!process.env.OPENCOMPUTER_API_KEY) {
  console.error("OPENCOMPUTER_API_KEY is required");
  process.exit(1);
}

const sb = await Sandbox.connect(sandboxId);
const r = await sb.exec.run(
  `sudo tee /usr/share/novnc/index.html >/dev/null <<'HTML'
<!doctype html>
<meta http-equiv="refresh" content="0;url=vnc.html?autoconnect=1&resize=scale">
<title>OpenComputer · DOOM</title>
HTML`,
);
if (r.exitCode !== 0) {
  console.error(r.stderr || r.stdout);
  process.exit(r.exitCode);
}
console.log(`patched ${sandboxId}: GET / now redirects to the noVNC client`);
