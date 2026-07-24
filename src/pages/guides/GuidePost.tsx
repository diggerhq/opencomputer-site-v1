import { Link, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import SitePageLayout from "@/components/SitePageLayout";
import SEO from "@/components/SEO";
import ShikiCodeBlock from "@/components/ShikiCodeBlock";
import NotFound from "@/pages/NotFound";
import { guidePosts, guideImageDimensions } from "@/content/guides/meta";
import type { BundledLanguage } from "shiki";

// Production markdown-rendered guide pages (/guides/<slug>). The markdown
// files in src/content/guides/ are reviewed finals from the deepdive
// pipeline — do not hand-edit them here; edit in the review repo and re-copy.
//
// Markdown is bundled at build time via ?raw imports (no runtime fetch), so
// the prerender snapshot always contains the full article text.

const sources = import.meta.glob("../../content/guides/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
});

const sourceBySlug = new Map<string, string>();
for (const [path, raw] of Object.entries(sources)) {
  const slug = path.split("/").pop()!.replace(/\.md$/, "");
  if (typeof raw === "string") sourceBySlug.set(slug, raw);
}

const KNOWN_LANGS = new Set([
  "ts", "tsx", "js", "jsx", "typescript", "javascript", "python", "py",
  "bash", "sh", "shell", "json", "yaml", "yml", "toml", "rust", "go", "c",
  "cpp", "diff", "sql", "html", "css", "dockerfile", "text",
]);

const headingId = (children: React.ReactNode): string =>
  String(
    Array.isArray(children)
      ? children.map((c) => (typeof c === "string" ? c : "")).join("")
      : children,
  )
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

const isInternalHref = (href: string | undefined): boolean =>
  !!href &&
  (href.startsWith("/") || href.startsWith("https://opencomputer.dev"));

const toInternalPath = (href: string): string =>
  href.replace(/^https:\/\/opencomputer\.dev/, "") || "/";

const GuidePost = () => {
  const { slug } = useParams<{ slug: string }>();
  const meta = guidePosts.find((g) => g.slug === slug);
  const source = slug ? sourceBySlug.get(slug) : undefined;

  if (!meta || !source) return <NotFound />;

  // The markdown's H1 + byline render in the page header, like blog posts.
  let title = meta.title;
  let byline = "";
  const rest: string[] = [];
  let seenTitle = false;
  let seenByline = false;
  for (const line of source.split("\n")) {
    if (!seenTitle && line.startsWith("# ")) {
      title = line.slice(2).trim();
      seenTitle = true;
      continue;
    }
    if (seenTitle && !seenByline && /^\*?_?[Bb]y /.test(line.trim())) {
      byline = line
        .trim()
        .replace(/^\*+|\*+$/g, "")
        .replace(/^_+|_+$/g, "");
      seenByline = true;
      continue;
    }
    rest.push(line);
  }
  const body = rest.join("\n");

  const dateLabel = new Date(`${meta.datePublished}T00:00:00Z`).toLocaleDateString(
    "en-US",
    { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" },
  );

  return (
    <SitePageLayout
      activeSection="blog"
      contentAs="article"
      contentClassName="max-w-[760px] mx-auto px-6 pt-10 pb-[60px]"
    >
      <SEO
        title={meta.title}
        description={meta.description}
        author={meta.author}
        path={`/guides/${meta.slug}`}
        type="article"
        image={meta.image}
      />

      <Link
        to="/guides"
        className="font-mono-brand text-[13px] text-muted-foreground transition-colors hover:text-foreground no-underline"
      >
        &larr; All guides
      </Link>

      <h1 className="mt-8 mb-4 font-heading text-[clamp(36px,5vw,52px)] leading-[1.15] tracking-[-1.5px]">
        {title}
      </h1>
      <p className="mb-10 font-mono-brand text-[13px] text-muted-foreground">
        {byline || `By ${meta.author}`} &middot; {dateLabel}
      </p>

      <div className="space-y-7 text-[17px] leading-[1.75] tracking-[-0.1px]">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h2: ({ children }) => (
              <h2
                id={headingId(children)}
                className="pt-6 font-heading text-[clamp(26px,3.6vw,34px)] leading-[1.3] tracking-[-0.7px]"
              >
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3
                id={headingId(children)}
                className="pt-2 font-heading text-[22px] leading-[1.35] tracking-[-0.4px]"
              >
                {children}
              </h3>
            ),
            p: ({ children }) => <p>{children}</p>,
            a: ({ href, children }) =>
              isInternalHref(href) ? (
                <Link
                  to={toInternalPath(href!)}
                  className="underline decoration-foreground/30 hover:decoration-foreground transition-colors"
                >
                  {children}
                </Link>
              ) : (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline decoration-foreground/30 hover:decoration-foreground transition-colors"
                >
                  {children}
                </a>
              ),
            ul: ({ children }) => (
              <ul className="list-disc space-y-3 pl-6">{children}</ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal space-y-3 pl-6">{children}</ol>
            ),
            blockquote: ({ children }) => (
              <blockquote className="border-l-[3px] border-foreground/80 py-1 pl-5 font-heading text-[19px] leading-[1.65] tracking-[-0.2px] italic text-foreground/85 [&_p]:m-0">
                {children}
              </blockquote>
            ),
            table: ({ children }) => (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-[15px] leading-[1.6]">
                  {children}
                </table>
              </div>
            ),
            th: ({ children }) => (
              <th className="border-b border-foreground/30 px-3 py-2 text-left font-heading text-[15px] tracking-[-0.2px]">
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td className="border-b border-border/70 px-3 py-2 align-top">
                {children}
              </td>
            ),
            hr: () => <div className="my-4 h-px w-12 bg-border" />,
            img: ({ src, alt }) => {
              const dims = src ? guideImageDimensions[src] : undefined;
              return (
                <img
                  src={src}
                  alt={alt}
                  width={dims?.width}
                  height={dims?.height}
                  loading="lazy"
                  className="my-2 h-auto w-full rounded-md border border-border/70"
                />
              );
            },
            code: ({ className, children }) => {
              const match = /language-(\w+)/.exec(className ?? "");
              const raw = String(children).replace(/\n$/, "");
              if (match || raw.includes("\n")) {
                const lang = match?.[1] ?? "text";
                return (
                  <ShikiCodeBlock
                    code={raw}
                    language={(KNOWN_LANGS.has(lang) ? lang : "text") as BundledLanguage}
                    copyable
                    className="my-2"
                    bodyClassName="[&_pre]:px-6 [&_pre]:py-5 [&_pre]:text-[13.5px] [&_pre]:leading-[1.9] [&_pre]:overflow-x-auto"
                  />
                );
              }
              return (
                <code className="font-mono-brand text-[15px] bg-[hsl(0,0%,93%)] px-1.5 py-0.5 rounded">
                  {children}
                </code>
              );
            },
            pre: ({ children }) => <>{children}</>,
          }}
        >
          {body}
        </ReactMarkdown>
      </div>
    </SitePageLayout>
  );
};

export default GuidePost;
