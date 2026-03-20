import { mkdtemp, mkdir, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import process from "node:process";
import { spawn } from "node:child_process";
import { chromium } from "playwright";

function parseArgs(argv) {
  const options = {
    scene: "ephemeral-sessions",
    fps: 30,
    width: 960,
    format: "mp4",
    output: "",
    summary: false,
    port: 4173,
    controls: {},
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    const next = argv[index + 1];

    if (arg === "--scene" && next) {
      options.scene = next;
      index += 1;
      continue;
    }
    if (arg === "--fps" && next) {
      options.fps = Number(next);
      index += 1;
      continue;
    }
    if (arg === "--width" && next) {
      options.width = Number(next);
      index += 1;
      continue;
    }
    if (arg === "--format" && next) {
      options.format = next;
      index += 1;
      continue;
    }
    if (arg === "--output" && next) {
      options.output = next;
      index += 1;
      continue;
    }
    if (arg === "--port" && next) {
      options.port = Number(next);
      index += 1;
      continue;
    }
    if (arg === "--summary") {
      options.summary = true;
      continue;
    }
    if (arg === "--control" && next) {
      const [key, rawValue] = next.split("=");
      if (key && rawValue) {
        options.controls[key] = rawValue;
      }
      index += 1;
      continue;
    }
  }

  if (!options.output) {
    options.output = path.join("exports", `${options.scene}.${options.format}`);
  }

  return options;
}

function spawnCommand(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: options.stdio ?? "inherit",
      cwd: options.cwd,
      env: options.env,
    });

    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) {
        resolve(child);
        return;
      }
      reject(new Error(`${command} exited with code ${code}`));
    });
  });
}

async function waitForUrl(url, timeoutMs = 30000) {
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return;
      }
    } catch {}

    await new Promise((resolve) => setTimeout(resolve, 300));
  }

  throw new Error(`Timed out waiting for ${url}`);
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const rootDir = process.cwd();
  const outputPath = path.resolve(rootDir, options.output);
  const outputDir = path.dirname(outputPath);
  const tempDir = await mkdtemp(path.join(os.tmpdir(), "animation-video-"));
  const framesDir = path.join(tempDir, "frames");
  await mkdir(framesDir, { recursive: true });
  await mkdir(outputDir, { recursive: true });

  const server = spawn("npm", ["run", "dev", "--", "--host", "127.0.0.1", "--port", String(options.port), "--strictPort"], {
    cwd: rootDir,
    stdio: "pipe",
    env: process.env,
  });

  let browser;

  const cleanup = async () => {
    if (browser) {
      await browser.close();
    }
    server.kill("SIGTERM");
    await rm(tempDir, { recursive: true, force: true });
  };

  process.on("SIGINT", async () => {
    await cleanup();
    process.exit(1);
  });

  try {
    server.stdout.on("data", (chunk) => process.stdout.write(chunk));
    server.stderr.on("data", (chunk) => process.stderr.write(chunk));

    const query = new URLSearchParams({
      scene: options.scene,
      width: String(options.width),
      summary: options.summary ? "1" : "0",
      timeMs: "0",
    });

    for (const [key, value] of Object.entries(options.controls)) {
      query.set(key, value);
    }

    const renderUrl = `http://127.0.0.1:${options.port}/animation-render?${query.toString()}`;
    await waitForUrl(renderUrl);

    browser = await chromium.launch();
    const page = await browser.newPage({
      viewport: {
        width: Math.max(1280, options.width + 160),
        height: Math.round(options.width * 0.9),
      },
      deviceScaleFactor: 2,
    });

    await page.goto(renderUrl, { waitUntil: "networkidle" });
    await page.waitForFunction(() => document.documentElement.dataset.animationRenderReady === "true");
    await page.evaluate(() => document.fonts.ready);

    const meta = await page.evaluate(() => window.__animationRenderMeta);
    if (!meta) {
      throw new Error("Animation render metadata did not initialize.");
    }

    const durationMs = meta.durationMs;
    const frameCount = Math.max(1, Math.ceil((durationMs / 1000) * options.fps));
    const frameStepMs = durationMs / frameCount;
    const target = page.locator("[data-animation-render]");

    console.log(`Exporting ${frameCount} frames for ${meta.sceneId} (${durationMs}ms)`);

    for (let index = 0; index < frameCount; index += 1) {
      const timeMs = Math.round(index * frameStepMs);
      await page.evaluate((nextTimeMs) => {
        window.__setAnimationRenderTime?.(nextTimeMs);
      }, timeMs);
      await page.evaluate(
        () =>
          new Promise((resolve) => {
            requestAnimationFrame(() => {
              requestAnimationFrame(resolve);
            });
          }),
      );

      const framePath = path.join(framesDir, `frame-${String(index).padStart(5, "0")}.png`);
      await target.screenshot({ path: framePath });
    }

    const ffmpegArgs = [
      "-y",
      "-framerate",
      String(options.fps),
      "-i",
      path.join(framesDir, "frame-%05d.png"),
    ];

    if (options.format === "webm") {
      ffmpegArgs.push("-c:v", "libvpx-vp9", "-pix_fmt", "yuva420p", "-b:v", "0", "-crf", "30", outputPath);
    } else {
      ffmpegArgs.push("-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "18", outputPath);
    }

    await spawnCommand("ffmpeg", ffmpegArgs, { cwd: rootDir });
    console.log(`Saved ${outputPath}`);
  } finally {
    await cleanup();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
