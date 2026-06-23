// Post-build prerender: snapshots the rendered HTML of every route into
// dist/ so crawlers that don't execute JavaScript (GPTBot, ClaudeBot,
// PerplexityBot, CCBot — and Googlebot's first-pass crawl) see full page
// content instead of an empty <div id="root">.
//
// Runs after `vite build` (which also runs the blog-meta plugin, so the
// per-post HTML shells already carry correct head meta — the snapshot
// preserves them). The client bundle still loads and re-renders on top of
// the prerendered DOM, so interactive behavior is unchanged.
//
// Requires a Playwright chromium binary: `npx playwright install chromium`.

import { createServer, type Server } from "http";
import { readFileSync, writeFileSync, mkdirSync, existsSync, statSync } from "fs";
import { join, extname, normalize } from "path";
import { execSync } from "child_process";
import { chromium } from "playwright";
import { blogPosts } from "../vite-plugin-blog-meta";

const DIST = join(process.cwd(), "dist");
const PORT = 4517;

// Head overrides for routes that don't get per-route HTML from the blog-meta
// plugin. Pages don't set <title> at runtime (no per-page Helmet), so without
// this every static route would snapshot the homepage head verbatim.
// /guides canonicalizes to /blog — it renders the same index component.
const staticRoutes: Array<{
  path: string;
  title?: string;
  description?: string;
  canonical: string;
}> = [
  { path: "/", canonical: "https://opencomputer.dev/" },
  {
    path: "/background-agents/",
    title: "Background Agent Maxxing – OpenComputer",
    description:
      "The 2026 market map of background coding agents. Devin, Cursor, Replit, Ona, Ramp's Inspect, Stripe's Minions, Coinbase's Mux, Harvey's Spectre and more. Every one of them runs on the same thing: one isolated computer per agent. That layer is OpenComputer.",
    canonical: "https://opencomputer.dev/background-agents/",
  },
  {
    path: "/blog/",
    title: "Blog – OpenComputer",
    description:
      "Long-form writing on agent infrastructure, sandbox isolation, and patterns for building on long-lived compute.",
    canonical: "https://opencomputer.dev/blog/",
  },
  {
    path: "/guides/",
    title: "Blog – OpenComputer",
    description:
      "Long-form writing on agent infrastructure, sandbox isolation, and patterns for building on long-lived compute.",
    canonical: "https://opencomputer.dev/blog/",
  },
  {
    path: "/durable-agent-sessions/",
    title: "Durable Agent Sessions – OpenComputer",
    description:
      "Build a background agent in three calls. Long-running agent sessions on OpenComputer: crashes resume from the event log, idle runs hibernate, you steer mid-run, and your model key never enters the sandbox. You write the agent, not the plumbing.",
    canonical: "https://opencomputer.dev/durable-agent-sessions/",
  },
  {
    path: "/partners/",
    title: "Design Partnership – OpenComputer",
    description:
      "Work directly with the OpenComputer team. For teams building AI employee products on long-lived compute.",
    canonical: "https://opencomputer.dev/partners/",
  },
  {
    path: "/clawputer/",
    title: "Clawputer – A personal AI assistant with a real computer",
    description:
      "A personal AI assistant with a real computer and memory that sticks. On iMessage or Telegram. Send a text to get started.",
    canonical: "https://opencomputer.dev/clawputer/",
  },
];

const blogRoutes = blogPosts.flatMap((post) => [
  `/blog/${post.slug}/`,
  `/guides/${post.slug}/`,
]);

const MIME: Record<string, string> = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".txt": "text/plain",
  ".xml": "application/xml",
  ".json": "application/json",
  ".md": "text/markdown",
  ".woff2": "font/woff2",
};

// Minimal static server with the same resolution order Cloudflare uses:
// exact file → directory index.html → SPA fallback to /index.html.
function serveDist(): Promise<Server> {
  const server = createServer((req, res) => {
    const urlPath = decodeURIComponent((req.url ?? "/").split("?")[0]);
    const safePath = normalize(urlPath).replace(/^(\.\.[/\\])+/, "");
    const candidates = [
      join(DIST, safePath),
      join(DIST, safePath, "index.html"),
      join(DIST, "index.html"),
    ];
    for (const candidate of candidates) {
      if (existsSync(candidate) && statSync(candidate).isFile()) {
        res.writeHead(200, {
          "content-type": MIME[extname(candidate)] ?? "application/octet-stream",
        });
        res.end(readFileSync(candidate));
        return;
      }
    }
    res.writeHead(404).end();
  });
  return new Promise((resolve) => server.listen(PORT, () => resolve(server)));
}

function escapeAttr(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function hasSystemLib(lib: string): boolean {
  try {
    return execSync("ldconfig -p", { encoding: "utf8" }).includes(lib);
  } catch {
    return false;
  }
}

// Playwright's chromium needs system libraries (libatk & co) that locked-down
// build images (Cloudflare Workers Builds) don't have and can't install
// without root. Detect that case and use @sparticuz/chromium instead — a
// self-contained chromium built for exactly these environments. Everywhere
// else, use the regular Playwright browser (installing it if missing).
async function launchBrowser() {
  if (process.platform === "linux" && !hasSystemLib("libatk-1.0.so.0")) {
    console.log("[prerender] system chromium libs missing — using @sparticuz/chromium");
    const { default: sparticuz } = await import("@sparticuz/chromium");
    return chromium.launch({
      executablePath: await sparticuz.executablePath(),
      args: sparticuz.args,
    });
  }
  if (!existsSync(chromium.executablePath())) {
    console.log("[prerender] chromium binary missing — running `npx playwright install chromium`");
    execSync("npx playwright install chromium", { stdio: "inherit" });
  }
  return chromium.launch();
}

function applyHeadOverrides(
  html: string,
  route: { title?: string; description?: string; canonical: string },
): string {
  let out = html
    .replace(
      /<link rel="canonical" href="[^"]*"/,
      `<link rel="canonical" href="${route.canonical}"`,
    )
    // og:url tracks the canonical so social/crawler URL hints never disagree
    // with it (the blog-meta plugin already does this for posts).
    .replace(
      /<meta property="og:url" content="[^"]*"/,
      `<meta property="og:url" content="${route.canonical}"`,
    );
  if (route.title) {
    const title = escapeAttr(route.title);
    out = out
      .replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`)
      .replace(/<meta property="og:title" content="[^"]*"/, `<meta property="og:title" content="${title}"`)
      .replace(/<meta name="twitter:title" content="[^"]*"/, `<meta name="twitter:title" content="${title}"`);
  }
  if (route.description) {
    const description = escapeAttr(route.description);
    out = out
      .replace(/<meta name="description" content="[^"]*"/, `<meta name="description" content="${description}"`)
      .replace(
        /<meta property="og:description" content="[^"]*"/,
        `<meta property="og:description" content="${description}"`,
      )
      .replace(
        /<meta name="twitter:description" content="[^"]*"/,
        `<meta name="twitter:description" content="${description}"`,
      );
  }
  return out;
}

async function main() {
  if (!existsSync(join(DIST, "index.html"))) {
    throw new Error("dist/index.html not found — run `vite build` first");
  }

  const server = await serveDist();
  const browser = await launchBrowser();
  const page = await browser.newPage();

  const routes: Array<{ path: string; overrides?: (typeof staticRoutes)[number] }> = [
    ...staticRoutes.map((r) => ({ path: r.path, overrides: r })),
    ...blogRoutes.map((path) => ({ path })),
  ];

  for (const route of routes) {
    // "load" rather than "networkidle": some pages keep the network busy
    // indefinitely (analytics, animation assets) and would never go idle.
    // The content check below is the real readiness signal.
    await page.goto(`http://localhost:${PORT}${route.path}`, { waitUntil: "load" });
    // Wait for real content, not just any node — the first children of #root
    // are invisible toast/notification regions.
    await page.waitForFunction(
      () => (document.getElementById("root")?.innerText.trim().length ?? 0) > 100,
      undefined,
      { timeout: 15_000 },
    );

    // FadeIn sections animate via whileInView — scroll the full page so
    // below-fold content settles at opacity 1 instead of snapshotting hidden.
    await page.evaluate(async () => {
      for (let y = 0; y <= document.body.scrollHeight; y += window.innerHeight) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 50));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(800); // let animations + async shiki highlighting settle

    let html = await page.content();
    if (route.overrides) {
      html = applyHeadOverrides(html, route.overrides);
    }
    // Drop react-helmet's runtime-injected <meta> duplicates (marked
    // data-rh="true"). The static head — rewritten per-post by the blog-meta
    // plugin, or by applyHeadOverrides above — is the single source of truth
    // for crawler-facing tags. Without this the snapshot carries two of every
    // og/twitter/description tag, and Helmet's og:url (slash-less) conflicts
    // with the trailing-slash canonical. Helmet re-injects these at runtime
    // for live SPA navigation, so interactive behavior is unchanged.
    html = html.replace(/\s*<meta\b[^>]*\bdata-rh="true"[^>]*>/g, "");

    const outDir = route.path === "/" ? DIST : join(DIST, route.path);
    mkdirSync(outDir, { recursive: true });
    const outFile = join(outDir, "index.html");
    writeFileSync(outFile, "<!doctype html>\n" + html.replace(/^<!doctype html>/i, "").trimStart());

    const bytes = statSync(outFile).size;
    console.log(`[prerender] ${route.path} → ${(bytes / 1024).toFixed(0)}kb`);
    if (bytes < 10_000) {
      throw new Error(`[prerender] ${route.path} looks empty (${bytes} bytes) — body likely failed to render`);
    }
  }

  await browser.close();
  server.close();
  console.log(`[prerender] Done: ${routes.length} routes`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
