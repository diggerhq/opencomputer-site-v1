#!/usr/bin/env tsx
/**
 * Try to recover a wedged DOOM sandbox by rebooting the guest kernel
 * (processes die, disk persists, sandbox ID stays the same), then
 * re-launches the DOOM stack.
 *
 *   OPENCOMPUTER_API_KEY=... npx tsx scripts/reboot-doom.ts <sandboxId>
 *
 * If sudo reboot is rejected by the sandbox, fall back to:
 *   npx tsx scripts/deploy-doom.ts --kill <sandboxId>
 *   npx tsx scripts/deploy-doom.ts
 */

import { Sandbox } from "@opencomputer/sdk";

const sandboxId = process.argv[2];
if (!sandboxId) { console.error("usage: reboot-doom.ts <sandboxId>"); process.exit(1); }
if (!process.env.OPENCOMPUTER_API_KEY) { console.error("OPENCOMPUTER_API_KEY required"); process.exit(1); }

const sb = await Sandbox.connect(sandboxId);

console.log("Triggering guest reboot…");
// Schedule reboot 1s in the future so the exec returns before the kernel goes down.
try {
  await sb.exec.run("sudo bash -c '(sleep 1; reboot -f) &' </dev/null", { timeout: 15 });
} catch (e: any) {
  console.error("reboot exec failed:", e.message);
  process.exit(1);
}
console.log("Reboot signal sent. Waiting 30s for the guest to come back…");

const deadline = Date.now() + 90_000;
let alive = false;
while (Date.now() < deadline) {
  await new Promise((r) => setTimeout(r, 5_000));
  try {
    const probe = await sb.exec.run("uptime", { timeout: 5 });
    if (probe.exitCode === 0) {
      console.log("Sandbox responsive again:");
      console.log(probe.stdout.trim());
      alive = true;
      break;
    }
  } catch {
    process.stdout.write(".");
  }
}
if (!alive) {
  console.error("\nSandbox did not come back. Try the kill+redeploy path.");
  process.exit(1);
}

console.log("\nRe-launching the DOOM stack (Xvfb + chocolate-doom + x11vnc + websockify)…");
const startScript = `
  set -e
  export PATH="/usr/games:/usr/local/games:$PATH"
  mkdir -p /tmp/doom
  cd /tmp/doom

  sudo mkdir -p /tmp/.X11-unix
  sudo chmod 1777 /tmp/.X11-unix

  DOOM=$(command -v chocolate-doom || command -v crispy-doom || command -v prboom-plus || true)
  WAD=$(find /usr/share -name 'freedoom1.wad' 2>/dev/null | head -1)

  setsid Xvfb :99 -screen 0 1024x768x24 -ac >/tmp/doom/xvfb.log 2>&1 </dev/null &
  sleep 1

  HOME=/tmp/doom DISPLAY=:99 setsid "$DOOM" \\
    -iwad "$WAD" -nosound -window -geometry 1024x768 \\
    >/tmp/doom/doom.log 2>&1 </dev/null &
  sleep 2

  setsid x11vnc -display :99 -forever -shared -nopw \\
    -rfbport 5900 -quiet -bg -o /tmp/doom/x11vnc.log

  sudo bash -c "ulimit -n 65536; exec setsid runuser -u sandbox -- \\
    websockify --web=/usr/share/novnc 6080 127.0.0.1:5900" \\
    >/tmp/doom/websockify.log 2>&1 </dev/null &
  sleep 2

  pgrep -af 'Xvfb|chocolate-doom|x11vnc|websockify' || true
`;
const r = await sb.exec.run(`bash -lc ${JSON.stringify(startScript)}`, { timeout: 60 });
process.stdout.write(r.stdout);
if (r.stderr) process.stderr.write(r.stderr);
if (r.exitCode !== 0) {
  console.error(`startup failed (exit ${r.exitCode})`);
  process.exit(r.exitCode);
}
console.log("DOOM stack re-launched.");
