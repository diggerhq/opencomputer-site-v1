import type { Plugin } from "vite";
import { writeFileSync, mkdirSync, readFileSync } from "fs";
import { join } from "path";

interface BlogMeta {
  slug: string;
  title: string;
  description: string;
  author: string;
}

const SITE_NAME = "OpenComputer";
const BASE_URL = "https://opencomputer.dev";
const DEFAULT_IMAGE = `${BASE_URL}/social-preview.png`;

const blogPosts: BlogMeta[] = [
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

function replaceMeta(html: string, post: BlogMeta): string {
  const fullTitle = escapeAttr(`${post.title} – ${SITE_NAME}`);
  const description = escapeAttr(post.description);
  const author = escapeAttr(post.author);
  const url = `${BASE_URL}/blog/${post.slug}`;

  return html
    // Title tag
    .replace(
      /<title>[^<]*<\/title>/,
      `<title>${fullTitle}</title>`
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
      /<meta name="twitter:image:alt" content="[^"]*"/,
      `<meta name="twitter:image:alt" content="${fullTitle}"`
    );
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

      console.log(`[blog-meta] Generated HTML for ${blogPosts.length} blog posts`);
    },
  };
}
