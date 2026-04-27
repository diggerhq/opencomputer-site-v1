#!/usr/bin/env tsx
/**
 *   OPENCOMPUTER_API_KEY=... npx tsx scripts/probe-zandronum.ts <sandboxId>
 */

import { Sandbox } from "@opencomputer/sdk";

const sandboxId = process.argv[2];
if (!sandboxId) { console.error("usage: probe-zandronum.ts <sandboxId>"); process.exit(1); }
if (!process.env.OPENCOMPUTER_API_KEY) { console.error("OPENCOMPUTER_API_KEY required"); process.exit(1); }

const sb = await Sandbox.connect(sandboxId);

const r = await sb.exec.run(
  `bash -lc '
    set -x
    echo "=== zandronum-server-error.log first 80 lines ==="
    sudo head -n 80 /root/.pm2/logs/zandronum-server-error.log

    echo "=== zandronum-1-error.log first 60 lines ==="
    sudo head -n 60 /root/.pm2/logs/zandronum-1-error.log

    echo "=== try running zandronum-server directly ==="
    sudo timeout 5 /usr/bin/zandronum-server -iwad /usr/share/games/doom/freedoom2.wad +exec /tmp/doom-mp/server.cfg -port 10666 2>&1 | head -50 || echo "(exit $?)"

    echo "=== try freedoom files ==="
    ls -la /usr/share/games/doom/ 2>&1 || echo "(missing)"
    find / -name "freedoom2.wad" 2>/dev/null | head -3

    echo "=== zandronum --help shape ==="
    /usr/bin/zandronum-server -help 2>&1 | head -30 || true
  '`,
  { timeout: 30 },
);
console.log(r.stdout);
console.log("--- STDERR ---");
console.log(r.stderr);
