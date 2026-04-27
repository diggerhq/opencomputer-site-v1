#!/usr/bin/env tsx
import { Sandbox } from "@opencomputer/sdk";

const sandboxId = process.argv[2] ?? "sb-540ca6e2";
const sb = await Sandbox.connect(sandboxId);

const cfg = `// Zandronum dedicated server config
sv_hostname "OpenComputer DOOM Demo"
sv_maxclients 8
sv_maxplayers 4
sv_maxclientsperip 8
sv_motd "deathmatch on a real OpenComputer VM"
deathmatch 1
fraglimit 20
timelimit 10
sv_itemrespawn 1
sv_smartaim 0
`;
await sb.files.write("/tmp/doom-mp/server.cfg", cfg);
const r = await sb.exec.run(
  "sudo pm2 restart zandronum-server zandronum-1 zandronum-2 zandronum-3 zandronum-4",
  { timeout: 30 },
);
console.log(r.stdout);
if (r.stderr) console.error(r.stderr);
