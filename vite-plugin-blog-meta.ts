import type { Plugin } from "vite";
import { writeFileSync, mkdirSync, readFileSync } from "fs";
import { join } from "path";

export interface BlogMeta {
  slug: string;
  title: string;
  description: string;
  author: string;
  image?: string;
  // ISO 8601 date — when set, an Article JSON-LD block is injected into the
  // prerendered HTML head so non-JS LLM crawlers see structured metadata.
  // Optional so existing posts opt in by adding this field; no change to others.
  datePublished?: string;
  authorUrl?: string;
  // URL of a markdown twin of the post (served by Cloudflare as a static file).
  // When set, a <link rel="alternate" type="text/markdown"> is injected into
  // the head so agents can discover and fetch the full-text version.
  markdownUrl?: string;
}

const SITE_NAME = "OpenComputer";
const BASE_URL = "https://opencomputer.dev";
const DEFAULT_IMAGE = `${BASE_URL}/social-preview.png`;

export const blogPosts: BlogMeta[] = [
  {
    slug: "open-ava-bdr-agent",
    title: "Build an Ava-Inspired BDR Agent That Runs on Its Own Computer",
    description:
      "A cookbook for building Open Ava: an inspectable BDR agent on a persistent OpenComputer VM. SQLite as the CRM, AgentMail as the inbox, Anthropic for research and drafting, with an approval gate and a checkpoint before any irreversible send.",
    author: "Utpal Nadiger",
    datePublished: "2026-06-27",
    markdownUrl: "/blog/open-ava-bdr-agent.md",
  },
  {
    slug: "scaling-one-vm-to-million-sandboxes",
    title: "Scaling OpenComputer from one VM to a million sandboxes",
    description:
      "From one VM to a million sandboxes: the architecture redesign behind OpenComputer's scaling — cells, edge routing on Cloudflare Workers, and per-second billing from 10-second heartbeats.",
    author: "Mohamed Habib",
    datePublished: "2026-06-17",
    markdownUrl: "/blog/scaling-one-vm-to-million-sandboxes.md",
  },
  {
    slug: "email-security-triage-agent",
    title: "I built an email agent to triage bogus security reports",
    description:
      "Most security reports arriving by email are AI-generated noise, but every one has to be reviewed. So I built an agent that triages them against the actual codebase: labels as signal, SecretStores against key exfiltration, and why the agent must never pick the email recipient.",
    author: "Igor Zalutski",
    datePublished: "2026-06-04",
  },
  {
    slug: "background-coding-agent",
    title: "Build a background coding agent that works while you sleep",
    description:
      "A 250-line self-hosted background coding agent. Label a GitHub issue with `agent`, wake up to a draft PR. ~$0.30/task. The snapshot, the agent loop, the webhook server, and the dead ends I'd save you from.",
    author: "Utpal Nadiger",
    datePublished: "2026-06-01",
    markdownUrl: "/blog/background-coding-agent.md",
  },
  {
    slug: "what-it-takes-to-run-an-ai-coworker-on-imessage",
    title: "What it takes to run an AI coworker on iMessage",
    description:
      "Lessons from shipping Clawputer, a managed openclaw that lives in your iMessage. Patterns for VM lifecycle, versioning, OAuth integrations, and browser offloading when building AI coworkers on long-lived compute.",
    author: "Mohamed Habib",
  },
  {
    slug: "stop-treating-sandboxes-as-cattle",
    title: "Stop Treating Agent Sandboxes as Cattle",
    description:
      "A direct response to 'The agent harness belongs outside the sandbox.' Why credentials, hibernation, elasticity, and checkpoints make a persistent in-sandbox harness the better default.",
    author: "Utpal Nadiger",
  },
  {
    slug: "the-race-to-build-the-next-wordpress",
    title: "The Race to Build the Next WordPress",
    description:
      "Agent harnesses are to this era what WordPress was to the early 2000s internet. The race to build the next one is already on.",
    author: "Igor Zalutski",
  },
  {
    slug: "what-elastic-compute-means",
    title: 'What "elastic compute" means in 2026',
    description:
      "From EC2 to agent sandboxes — how agents broke the compute paradigms we've relied on for 20 years, and what elasticity looks like now.",
    author: "Igor Zalutski",
  },
  {
    slug: "where-should-the-agent-live",
    title: "Where Should the Agent(s) Live?",
    description:
      "Isolation models, agent placement tradeoffs, credential design, and sandbox lifecycle patterns for agentic systems.",
    author: "Utpal Nadiger, Mohamed Habib, Igor Zalutski",
  },
  {
    slug: "agent-execution-new-http-request",
    title: "Agent Execution Is the New HTTP Request",
    description:
      "From CGI scripts to serverless, web infrastructure evolved over 30 years. Now agents are taking us full circle - back to files and scripts.",
    author: "Igor Zalutski",
  },
  {
    slug: "sandbox-fingerprinting",
    title: "I Asked Opus 4.6 to Fingerprint Sandbox Vendors",
    description:
      "We fingerprinted 6 sandbox providers to understand their isolation models - from containers to microVMs to full hypervisors. Here's what we found.",
    author: "Mohamed Habib",
  },
  {
    slug: "the-agentic-workload",
    title: "The Agentic Workload",
    description:
      "Agent code doesn't fit neatly into existing categories. It's not a traditional app, and it's not a CI job. It's something new.",
    author: "Igor Zalutski",
  },
  {
    slug: "building-open-lovable-part-1",
    title: "Building an Open Lovable - part 1",
    description:
      "A series to build a lovable clone to learn how lovable works under the hood using Claude Agent SDK and OpenComputer.",
    author: "Mohamed Habib",
  },
];

function escapeAttr(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Builds an Article JSON-LD block. Only invoked when a post sets `datePublished`,
// so existing posts (which don't set it) get no Article schema and their head is
// rewritten exactly as before.
function buildArticleSchema(post: BlogMeta): string {
  const url = `${BASE_URL}/blog/${post.slug}/`;
  const image = post.image ? `${BASE_URL}${post.image}` : DEFAULT_IMAGE;
  const author = post.authorUrl
    ? { "@type": "Person", name: post.author, url: post.authorUrl }
    : { "@type": "Person", name: post.author };
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    image,
    author,
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: BASE_URL,
      logo: { "@type": "ImageObject", url: image },
    },
    datePublished: post.datePublished,
    dateModified: post.datePublished,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
  };
  // JSON.stringify produces valid JSON; the only character that can break out of
  // a <script> context is `</`, which we escape.
  const json = JSON.stringify(schema).replace(/</g, "\\u003c");
  return `\n    <script type="application/ld+json">${json}</script>`;
}

function replaceMeta(html: string, post: BlogMeta): string {
  const fullTitle = escapeAttr(`${post.title} – ${SITE_NAME}`);
  const description = escapeAttr(post.description);
  const author = escapeAttr(post.author);
  // Trailing slash matches Cloudflare's auto-trailing-slash normalization, so
  // canonical/og:url point at the URL the server actually serves (no redirect hop).
  const url = `${BASE_URL}/blog/${post.slug}/`;
  const image = post.image ? `${BASE_URL}${post.image}` : DEFAULT_IMAGE;

  // Inject Article JSON-LD + markdown alternate link before </head>.
  // Both are opt-in: only emit them when the post declares the relevant field.
  const articleSchema = post.datePublished ? buildArticleSchema(post) : "";
  const markdownLink = post.markdownUrl
    ? `\n    <link rel="alternate" type="text/markdown" href="${BASE_URL}${post.markdownUrl}" title="${fullTitle} (markdown)">`
    : "";

  const headExtras = articleSchema + markdownLink;
  const withSchema = headExtras
    ? html.replace(/<\/head>/, `${headExtras}\n  </head>`)
    : html;

  return withSchema
    // Title tag
    .replace(
      /<title>[^<]*<\/title>/,
      `<title>${fullTitle}</title>`
    )
    // Canonical. Without this rewrite every post inherits the homepage canonical
    // and tells crawlers to index "/" instead of the post. The /guides/* mirror
    // gets the same /blog/* canonical, deduplicating the twin routes.
    .replace(
      /<link rel="canonical" href="[^"]*"/,
      `<link rel="canonical" href="${url}"`
    )
    // Primary meta
    .replace(
      /<meta name="description" content="[^"]*"/,
      `<meta name="description" content="${description}"`
    )
    .replace(
      /<meta name="author" content="[^"]*"/,
      `<meta name="author" content="${author}"`
    )
    // Open Graph
    .replace(
      /<meta property="og:title" content="[^"]*"/,
      `<meta property="og:title" content="${fullTitle}"`
    )
    .replace(
      /<meta property="og:description" content="[^"]*"/,
      `<meta property="og:description" content="${description}"`
    )
    .replace(
      /<meta property="og:type" content="[^"]*"/,
      `<meta property="og:type" content="article"`
    )
    .replace(
      /<meta property="og:url" content="[^"]*"/,
      `<meta property="og:url" content="${url}"`
    )
    .replace(
      /<meta property="og:image" content="[^"]*"/,
      `<meta property="og:image" content="${image}"`
    )
    .replace(
      /<meta property="og:image:alt" content="[^"]*"/,
      `<meta property="og:image:alt" content="${fullTitle}"`
    )
    // Twitter
    .replace(
      /<meta name="twitter:title" content="[^"]*"/,
      `<meta name="twitter:title" content="${fullTitle}"`
    )
    .replace(
      /<meta name="twitter:description" content="[^"]*"/,
      `<meta name="twitter:description" content="${description}"`
    )
    .replace(
      /<meta name="twitter:image" content="[^"]*"/,
      `<meta name="twitter:image" content="${image}"`
    )
    .replace(
      /<meta name="twitter:image:alt" content="[^"]*"/,
      `<meta name="twitter:image:alt" content="${fullTitle}"`
    );
}

// Generated from `blogPosts` so the sitemap can never drift from the route
// table again (the old static public/sitemap.xml was missing three posts).
// /guides/* mirrors are deliberately excluded: they canonicalize to /blog/*.
function buildSitemap(): string {
  const entry = (loc: string, changefreq: string, priority: string, lastmod?: string) =>
    [
      "  <url>",
      `    <loc>${BASE_URL}${loc}</loc>`,
      ...(lastmod ? [`    <lastmod>${lastmod}</lastmod>`] : []),
      `    <changefreq>${changefreq}</changefreq>`,
      `    <priority>${priority}</priority>`,
      "  </url>",
    ].join("\n");

  const urls = [
    entry("/", "weekly", "1.0"),
    entry("/blog/", "weekly", "0.8"),
    entry("/clawputer/", "monthly", "0.7"),
    entry("/partners/", "monthly", "0.7"),
    ...blogPosts.map((post) =>
      entry(`/blog/${post.slug}/`, "monthly", "0.6", post.datePublished),
    ),
  ];

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls,
    "</urlset>",
    "",
  ].join("\n");
}

export default function blogMetaPlugin(): Plugin {
  return {
    name: "blog-meta",
    closeBundle() {
      const distDir = join(process.cwd(), "dist");
      const indexHtml = readFileSync(join(distDir, "index.html"), "utf-8");

      for (const post of blogPosts) {
        for (const prefix of ["blog", "guides"]) {
          const dir = join(distDir, prefix, post.slug);
          mkdirSync(dir, { recursive: true });
          writeFileSync(join(dir, "index.html"), replaceMeta(indexHtml, post));
        }
      }

      writeFileSync(join(distDir, "sitemap.xml"), buildSitemap());

      console.log(`[blog-meta] Generated HTML for ${blogPosts.length} blog posts + sitemap.xml`);
    },
  };
}
