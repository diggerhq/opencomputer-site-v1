import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "fs";
import { join } from "path";
import {
  guidePosts,
  guideImageDimensions,
  extractFaq,
} from "./meta";
import { blogPosts } from "../../../vite-plugin-blog-meta";

// Regression suite for the /guides section. Guards the invariants that keep
// crawling/canonicals correct: every guide has a markdown source, every
// internal link resolves to a real route, every image exists with known
// dimensions, and guide slugs never collide with blog slugs (whose /guides/*
// mirrors canonicalize to /blog/* and must not be shadowed).

const ROOT = join(__dirname, "..", "..", "..");
const read = (slug: string) =>
  readFileSync(join(__dirname, `${slug}.md`), "utf-8");

const knownRoutes = new Set<string>([
  "/",
  "/blog",
  "/guides",
  "/durable-agent-sessions",
  "/durable-agents",
  "/background-agents",
  "/partners",
  "/clawputer",
  ...blogPosts.map((p) => `/blog/${p.slug}`),
  ...blogPosts.map((p) => `/guides/${p.slug}`),
  ...guidePosts.map((g) => `/guides/${g.slug}`),
]);

describe("guides collection", () => {
  it("has no slug collisions with blog posts", () => {
    const blogSlugs = new Set(blogPosts.map((p) => p.slug));
    for (const guide of guidePosts) {
      expect(blogSlugs.has(guide.slug), `guide slug '${guide.slug}' collides with a blog slug`).toBe(false);
    }
  });

  it("has unique guide slugs", () => {
    const slugs = guidePosts.map((g) => g.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  for (const guide of guidePosts) {
    describe(guide.slug, () => {
      it("has a markdown source file", () => {
        expect(existsSync(join(__dirname, `${guide.slug}.md`))).toBe(true);
      });

      it("starts with an H1 and has a byline", () => {
        const md = read(guide.slug);
        expect(md.startsWith("# ")).toBe(true);
        expect(md).toMatch(/^\*?_?[Bb]y /m);
      });

      it("declares complete metadata", () => {
        expect(guide.title.length).toBeGreaterThan(10);
        expect(guide.title.length).toBeLessThanOrEqual(70);
        expect(guide.description.length).toBeGreaterThan(50);
        expect(guide.description.length).toBeLessThanOrEqual(320);
        expect(guide.datePublished).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(guide.author.length).toBeGreaterThan(0);
      });

      it("every internal opencomputer.dev link resolves to a known route", () => {
        const md = read(guide.slug);
        const links = [...md.matchAll(/\]\((https:\/\/opencomputer\.dev[^)\s]*|\/[^)\s]*)\)/g)]
          .map((m) => m[1])
          .filter((href) => !href.startsWith("/guides/assets/"));
        for (const href of links) {
          const path = href
            .replace(/^https:\/\/opencomputer\.dev/, "")
            .replace(/[#?].*$/, "")
            .replace(/\/$/, "") || "/";
          expect(
            knownRoutes.has(path),
            `${guide.slug}.md links to unknown internal route: ${href}`,
          ).toBe(true);
        }
      });

      it("every referenced image exists in public/ with known dimensions", () => {
        const md = read(guide.slug);
        const images = [...md.matchAll(/!\[[^\]]*\]\(([^)\s]+)\)/g)].map((m) => m[1]);
        expect(images.length).toBeGreaterThan(0);
        for (const src of images) {
          expect(src.startsWith("/guides/assets/"), `non-local image src: ${src}`).toBe(true);
          expect(existsSync(join(ROOT, "public", src)), `missing image file: ${src}`).toBe(true);
          expect(guideImageDimensions[src], `no dimensions for: ${src}`).toBeDefined();
        }
      });

      it("every image has non-empty alt text", () => {
        const md = read(guide.slug);
        for (const m of md.matchAll(/!\[([^\]]*)\]\(/g)) {
          expect(m[1].trim().length, "image with empty alt text").toBeGreaterThan(10);
        }
      });

      it("has an extractable FAQ (feeds FAQPage JSON-LD)", () => {
        const faq = extractFaq(read(guide.slug));
        expect(faq.length).toBeGreaterThanOrEqual(3);
        for (const entry of faq) {
          expect(entry.question.length).toBeGreaterThan(10);
          expect(entry.answer.length).toBeGreaterThan(40);
          // Flattened answers must not leak markdown syntax into JSON-LD.
          expect(entry.answer).not.toMatch(/\]\(http/);
          expect(entry.answer).not.toContain("**");
        }
      });

      it("carries no leftover review artifacts", () => {
        const md = read(guide.slug);
        expect(md).not.toContain("TODO");
        expect(md).not.toContain("<<UNRESOLVED");
        expect(md).not.toContain("<!--");
      });
    });
  }
});

describe("prerender/meta wiring", () => {
  it("prerender.ts includes guide routes", () => {
    const src = readFileSync(join(ROOT, "scripts", "prerender.ts"), "utf-8");
    expect(src).toContain("guidePosts");
    expect(src).toContain("guideRoutes");
  });

  it("/guides/ index is self-canonical in prerender overrides", () => {
    const src = readFileSync(join(ROOT, "scripts", "prerender.ts"), "utf-8");
    const guidesBlock = src.match(/path: "\/guides\/",[\s\S]{0,400}?canonical: "([^"]+)"/);
    expect(guidesBlock?.[1]).toBe("https://opencomputer.dev/guides/");
  });

  it("blog-meta plugin emits guides into the sitemap", () => {
    const src = readFileSync(join(ROOT, "vite-plugin-blog-meta.ts"), "utf-8");
    expect(src).toContain("guidePosts.map((guide) =>");
    expect(src).toContain('entry("/guides/", "weekly", "0.8")');
  });

  it("llms.txt lists every guide's markdown twin", () => {
    const llms = readFileSync(join(ROOT, "public", "llms.txt"), "utf-8");
    for (const guide of guidePosts) {
      expect(llms).toContain(`https://opencomputer.dev/guides/${guide.slug}.md`);
    }
  });
});
