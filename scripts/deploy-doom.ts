#!/usr/bin/env tsx
/**
 * Deploys a shared DOOM sandbox on prod OpenComputer.
 *
 *   OPENCOMPUTER_API_KEY=... npx tsx scripts/deploy-doom.ts
 *   OPENCOMPUTER_API_KEY=... npx tsx scripts/deploy-doom.ts --logs <sandboxId>
 *   OPENCOMPUTER_API_KEY=... npx tsx scripts/deploy-doom.ts --kill <sandboxId>
 *
 * One sandbox runs Xvfb + chocolate-doom + freedoom under x11vnc in -shared
 * mode, with websockify serving noVNC on port 6080. Everyone who connects
 * sees the same screen and can mash inputs together.
 */

import { Sandbox } from "@opencomputer/sdk";

const VNC_PORT = 5900;
const WEB_PORT = 6080;

function die(msg: string): never {
  console.error(`error: ${msg}`);
  process.exit(1);
}

async function deploy() {
  if (!process.env.OPENCOMPUTER_API_KEY) {
    die("OPENCOMPUTER_API_KEY is required (set it to your prod API key)");
  }

  console.log("Creating sandbox on prod opencomputer…");
  const sb = await Sandbox.create({
    template: "base",
    timeout: 0,
    cpuCount: 1,
    memoryMB: 4096,
    metadata: { purpose: "doom-demo", site: "opencomputer-site-v1" },
  });
  console.log(`  sandbox: ${sb.sandboxId}`);

  console.log("Installing Xvfb + chocolate-doom + freedoom + x11vnc + novnc/websockify (~1–2 min)…");
  const installScript = [
    "export DEBIAN_FRONTEND=noninteractive",
    "sudo -E apt-get update -y",
    "sudo -E apt-get install -y --no-install-recommends " +
      "xvfb x11vnc chocolate-doom freedoom novnc websockify procps ca-certificates",
  ].join(" && ");
  const installCode = await runStreaming(sb, installScript, 600);
  if (installCode !== 0) {
    await sb.kill();
    die(`apt install failed (exit ${installCode})`);
  }

  console.log("Booting Xvfb → DOOM → x11vnc → websockify…");
  const startScript = `
    set -e
    export PATH="/usr/games:/usr/local/games:$PATH"
    mkdir -p /tmp/doom
    cd /tmp/doom

    # Xvfb needs /tmp/.X11-unix to exist with sticky perms; non-root can't mkdir it.
    sudo mkdir -p /tmp/.X11-unix
    sudo chmod 1777 /tmp/.X11-unix

    DOOM=$(command -v chocolate-doom || command -v crispy-doom || command -v prboom-plus || true)
    if [ -z "$DOOM" ]; then
      echo "no DOOM binary found in PATH ($PATH)" >&2
      exit 1
    fi
    echo "DOOM=$DOOM"

    WAD=$(find /usr/share -name 'freedoom1.wad' 2>/dev/null | head -1)
    if [ -z "$WAD" ]; then
      echo "freedoom1.wad not found" >&2
      exit 1
    fi
    echo "WAD=$WAD"

    # 1) virtual framebuffer
    setsid Xvfb :99 -screen 0 1024x768x24 -ac >/tmp/doom/xvfb.log 2>&1 </dev/null &
    sleep 1

    # 2) DOOM
    HOME=/tmp/doom DISPLAY=:99 setsid "$DOOM" \\
      -iwad "$WAD" -nosound -window -geometry 1024x768 \\
      >/tmp/doom/doom.log 2>&1 </dev/null &
    sleep 2

    # 3) x11vnc — -shared lets every visitor join the same framebuffer
    setsid x11vnc -display :99 -forever -shared -nopw \\
      -rfbport ${VNC_PORT} -quiet -bg \\
      -o /tmp/doom/x11vnc.log

    # 4) replace the default directory listing at "/" with a redirect to the
    #    auto-connecting noVNC client.
    sudo tee /usr/share/novnc/index.html >/dev/null <<'HTML'
<!doctype html>
<meta http-equiv="refresh" content="0;url=vnc.html?autoconnect=1&resize=scale">
<title>OpenComputer · DOOM</title>
HTML

    # 5) websockify — bridges WS → VNC and serves the noVNC client at /
    setsid websockify --web=/usr/share/novnc ${WEB_PORT} 127.0.0.1:${VNC_PORT} \\
      >/tmp/doom/websockify.log 2>&1 </dev/null &

    sleep 2
    pgrep -af 'Xvfb|chocolate-doom|crispy-doom|prboom-plus|x11vnc|websockify' || true
  `;
  const startCode = await runStreaming(sb, startScript, 60);
  if (startCode !== 0) {
    await tail(sb);
    await sb.kill();
    die(`startup script failed (exit ${startCode})`);
  }

  console.log(`Exposing port ${WEB_PORT} as a public preview URL…`);
  const preview = await sb.createPreviewURL({ port: WEB_PORT, authConfig: { public: true } });

  const novncUrl = `https://${preview.hostname}/vnc.html?autoconnect=1&resize=scale`;
  const wsUrl = `wss://${preview.hostname}/websockify`;

  console.log("\n──────────────────────────────────────────────");
  console.log(" 🦴 shared DOOM is live");
  console.log("──────────────────────────────────────────────");
  console.log(` sandbox:   ${sb.sandboxId}`);
  console.log(` host:      ${preview.hostname}`);
  console.log(` noVNC UI:  ${novncUrl}`);
  console.log(` ws URL:    ${wsUrl}`);
  console.log("──────────────────────────────────────────────");
  console.log(" tail logs:  npx tsx scripts/deploy-doom.ts --logs " + sb.sandboxId);
  console.log(" tear down:  npx tsx scripts/deploy-doom.ts --kill " + sb.sandboxId);
  console.log("──────────────────────────────────────────────\n");
}

async function runStreaming(sb: Sandbox, script: string, timeout: number): Promise<number> {
  const decoder = new TextDecoder();
  const writeStdout = (data: Uint8Array) => process.stdout.write(decoder.decode(data, { stream: true }));
  const writeStderr = (data: Uint8Array) => process.stderr.write(decoder.decode(data, { stream: true }));

  const session = await sb.exec.start("sh", {
    args: ["-c", script],
    timeout,
    onStdout: writeStdout,
    onStderr: writeStderr,
  });
  return session.done;
}

async function tail(sb: Sandbox) {
  const r = await sb.exec.run(
    "for f in /tmp/doom/*.log; do echo \"==> $f\"; tail -n 30 \"$f\" 2>/dev/null; done",
    { timeout: 30 },
  );
  console.log(r.stdout);
  if (r.stderr) console.error(r.stderr);
}

async function logs(sandboxId: string) {
  const sb = await Sandbox.connect(sandboxId);
  await tail(sb);
}

async function kill(sandboxId: string) {
  const sb = await Sandbox.connect(sandboxId);
  await sb.kill();
  console.log(`killed ${sandboxId}`);
}

const [cmd, arg] = process.argv.slice(2);
const run =
  cmd === "--kill" && arg ? kill(arg)
  : cmd === "--logs" && arg ? logs(arg)
  : deploy();

run.catch((e) => { console.error(e); process.exit(1); });
