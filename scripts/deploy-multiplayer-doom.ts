#!/usr/bin/env tsx
/**
 * Phase 1a — multiplayer DOOM stack on a fresh sandbox.
 *
 * One Zandronum server + 4 player slots. Each slot has its own Xvfb,
 * zandronum client connecting to the server, x11vnc, and websockify.
 * supervisord watches everything and restarts on crash.
 *
 *   OPENCOMPUTER_API_KEY=... npx tsx scripts/deploy-multiplayer-doom.ts
 *   OPENCOMPUTER_API_KEY=... npx tsx scripts/deploy-multiplayer-doom.ts --logs <id>
 *   OPENCOMPUTER_API_KEY=... npx tsx scripts/deploy-multiplayer-doom.ts --kill <id>
 *
 * No lobby yet — connect 4 browser tabs by hand to the printed URLs to
 * verify Zandronum + per-slot rendering works at all. Phase 1b adds the
 * lobby; phase 1c wires the site UI.
 */

import { Sandbox } from "@opencomputer/sdk";

const SLOTS = [1, 2, 3, 4];
const SERVER_PORT = 10666;
const VNC_BASE = 5900;
const WEB_BASE = 6080;

function die(msg: string): never {
  console.error(`error: ${msg}`);
  process.exit(1);
}

async function deploy() {
  if (!process.env.OPENCOMPUTER_API_KEY) {
    die("OPENCOMPUTER_API_KEY is required");
  }

  console.log("Creating 4 vCPU / 16 GB sandbox on prod opencomputer…");
  const sb = await Sandbox.create({
    template: "base",
    timeout: 0,
    cpuCount: 4,
    memoryMB: 16384,
    metadata: { purpose: "doom-multiplayer", phase: "1a" },
  });
  console.log(`  sandbox: ${sb.sandboxId}`);

  console.log("Installing apt packages + Zandronum (from drdteam.org repo) + pm2…");
  // freedoom2.wad for Doom-II-style maps. pm2 supervises the worker stack
  // (ditched supervisord — broken module resolution on this image).
  const installScript = [
    "export DEBIAN_FRONTEND=noninteractive",
    "sudo -E apt-get update -y",
    // NodeSource's nodejs package on this image bundles npm and conflicts with apt's npm — don't install npm separately.
    "sudo -E apt-get install -y --no-install-recommends " +
      "xvfb x11vnc novnc python3-pip nginx procps ca-certificates curl gnupg freedoom nodejs",
    "sudo install -d -m 0755 /etc/apt/keyrings",
    "curl -fsSL http://debian.drdteam.org/drdteam.gpg | sudo gpg --dearmor -o /etc/apt/keyrings/drdteam.gpg",
    `echo "deb [signed-by=/etc/apt/keyrings/drdteam.gpg] http://debian.drdteam.org/ stable multiverse" | sudo tee /etc/apt/sources.list.d/drdteam.list`,
    "sudo -E apt-get update -y",
    "sudo -E apt-get install -y --no-install-recommends zandronum zandronum-server",
    "sudo pip install --break-system-packages --upgrade websockify",
    "sudo npm install -g pm2",
  ].join(" && ");
  const installCode = await runStreaming(sb, installScript, 600);
  if (installCode !== 0) {
    await sb.kill();
    die(`apt install failed (exit ${installCode})`);
  }

  console.log("Writing config files (server.cfg, ecosystem.config.cjs, start.sh)…");
  await sb.files.write("/tmp/doom-mp/server.cfg", serverCfg());
  await sb.files.write("/tmp/doom-mp/ecosystem.config.cjs", pm2Ecosystem());
  await sb.files.write("/tmp/doom-mp/start.sh", startSh());

  console.log("Booting the multiplayer stack…");
  // - sudo mkdir state dirs
  // - tee novnc index.html redirect (same trick as single-player demo)
  // - chmod +x start.sh
  // - run start.sh (ulimit + supervisord daemonized)
  const bootScript = `
    set -e
    sudo mkdir -p /tmp/doom-mp /tmp/.X11-unix
    sudo chmod 1777 /tmp/.X11-unix
    sudo chown -R sandbox:sandbox /tmp/doom-mp

    # noVNC root: redirect "/" to vnc.html?autoconnect=1 (per-slot websockify
    # serves /usr/share/novnc, so each slot inherits this).
    sudo tee /usr/share/novnc/index.html >/dev/null <<'HTML'
<!doctype html>
<meta http-equiv="refresh" content="0;url=vnc.html?autoconnect=1&resize=scale">
<title>OpenComputer · DOOM MP</title>
HTML

    chmod +x /tmp/doom-mp/start.sh
    sudo /tmp/doom-mp/start.sh
    sleep 5
    sudo pm2 list
  `;
  const bootCode = await runStreaming(sb, bootScript, 60);
  if (bootCode !== 0) {
    await tail(sb);
    await sb.kill();
    die(`boot failed (exit ${bootCode})`);
  }

  console.log("Exposing per-slot websockify ports…");
  const slotUrls: { slot: number; host: string }[] = [];
  for (const n of SLOTS) {
    const preview = await sb.createPreviewURL({
      port: WEB_BASE + n,
      authConfig: { public: true },
    });
    slotUrls.push({ slot: n, host: preview.hostname });
    console.log(`  slot ${n}: https://${preview.hostname}/`);
  }

  console.log("\n──────────────────────────────────────────────");
  console.log(" 🎮 multiplayer DOOM (phase 1a) is live");
  console.log("──────────────────────────────────────────────");
  console.log(` sandbox: ${sb.sandboxId}`);
  for (const { slot, host } of slotUrls) {
    console.log(` Player ${slot}:  https://${host}/`);
  }
  console.log("──────────────────────────────────────────────");
  console.log(" Open all 4 in separate browser windows to test deathmatch.");
  console.log(` logs:  npx tsx scripts/deploy-multiplayer-doom.ts --logs ${sb.sandboxId}`);
  console.log(` kill:  npx tsx scripts/deploy-multiplayer-doom.ts --kill ${sb.sandboxId}`);
  console.log("──────────────────────────────────────────────\n");
}

function serverCfg(): string {
  // sv_maxclientsperip defaults to 2; all 4 slot clients connect from
  // 127.0.0.1, so slots 3 and 4 get rejected as "too many connections from
  // this IP". Bump it to 8 to let the local-loopback fleet through.
  return `// Zandronum dedicated server config
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
}

function pm2Ecosystem(): string {
  // interpreter: "none" — without this, pm2 reads the script file (zandronum
  // and zandronum-server are shell wrappers, websockify is a Python script)
  // and tries to compile it as JS, which obviously fails.
  const common = { autorestart: true, interpreter: "none" as const, merge_logs: true };
  const apps: object[] = [
    {
      ...common,
      name: "zandronum-server",
      script: "/usr/bin/zandronum-server",
      args: [
        "-iwad", "/usr/share/games/doom/freedoom2.wad",
        "+exec", "/tmp/doom-mp/server.cfg",
        "+map", "MAP01",
        "-port", String(SERVER_PORT),
      ],
      cwd: "/tmp/doom-mp",
      restart_delay: 1000,
      out_file: "/tmp/doom-mp/zandronum-server.log",
    },
  ];
  for (const n of SLOTS) {
    apps.push(
      {
        ...common,
        name: `xvfb-${n}`,
        script: "/usr/bin/Xvfb",
        args: [`:10${n}`, "-screen", "0", "1024x768x24", "-ac"],
        out_file: `/tmp/doom-mp/xvfb-${n}.log`,
      },
      {
        ...common,
        name: `zandronum-${n}`,
        script: "/usr/bin/zandronum",
        // -width/-height force the Zandronum render surface to fill the Xvfb;
        // without these it defaults to 640x480 with black borders around it.
        args: [
          "-iwad", "/usr/share/games/doom/freedoom2.wad",
          "-connect", `127.0.0.1:${SERVER_PORT}`,
          "-width", "1024",
          "-height", "768",
          "+name", `Player${n}`,
          "+vid_defwidth", "1024",
          "+vid_defheight", "768",
          "+vid_fullscreen", "0",
        ],
        env: { DISPLAY: `:10${n}`, HOME: "/tmp/doom-mp" },
        restart_delay: 2000,
        out_file: `/tmp/doom-mp/zandronum-${n}.log`,
      },
      {
        ...common,
        name: `x11vnc-${n}`,
        script: "/usr/bin/x11vnc",
        args: [
          "-display", `:10${n}`,
          "-forever", "-shared", "-nopw",
          "-rfbport", String(VNC_BASE + n),
          "-quiet",
        ],
        restart_delay: 2000,
        out_file: `/tmp/doom-mp/x11vnc-${n}.log`,
      },
      {
        ...common,
        name: `websockify-${n}`,
        script: "/usr/local/bin/websockify",
        args: [
          "--web=/usr/share/novnc",
          String(WEB_BASE + n),
          `127.0.0.1:${VNC_BASE + n}`,
        ],
        out_file: `/tmp/doom-mp/websockify-${n}.log`,
      },
    );
  }
  return `module.exports = { apps: ${JSON.stringify(apps, null, 2)} };\n`;
}

function startSh(): string {
  // Set high FD limit for pm2's children (the websockify processes inherit it).
  return `#!/bin/bash
set -e
ulimit -SHn 65536
echo "ulimit -n: soft=$(ulimit -Sn) hard=$(ulimit -Hn)"
exec pm2 start /tmp/doom-mp/ecosystem.config.cjs
`;
}

async function runStreaming(sb: Sandbox, script: string, timeout: number): Promise<number> {
  const decoder = new TextDecoder();
  const session = await sb.exec.start("sh", {
    args: ["-c", script],
    timeout,
    onStdout: (d) => process.stdout.write(decoder.decode(d, { stream: true })),
    onStderr: (d) => process.stderr.write(decoder.decode(d, { stream: true })),
  });
  return session.done;
}

async function tail(sb: Sandbox) {
  const r = await sb.exec.run(
    "for f in /tmp/doom-mp/*.log; do echo \"==> $f\"; sudo tail -n 30 \"$f\" 2>/dev/null; done",
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
