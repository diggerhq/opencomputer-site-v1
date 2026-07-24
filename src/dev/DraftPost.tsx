import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import SitePageLayout from "@/components/SitePageLayout";
import ShikiCodeBlock from "@/components/ShikiCodeBlock";
import type { BundledLanguage } from "shiki";

// Dev-only markdown draft viewer for the deepdive review loop. Renders
// ~/opencomputer-posts/posts/<slug>.md (symlinked at public/drafts) with the
// same typography as the hardcoded blog components, so drafts can be reviewed
// in real site clothing before conversion. Not registered in prod routes.

const KNOWN_LANGS = new Set([
  "ts", "tsx", "js", "jsx", "typescript", "javascript", "python", "py",
  "bash", "sh", "shell", "json", "yaml", "yml", "toml", "rust", "go", "c",
  "cpp", "diff", "sql", "html", "css", "dockerfile", "text",
]);

const DraftPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [source, setSource] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    setSource(null);
    setError(null);
    fetch(`/draft-md/${slug}.md`)
      .then((res) => {
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
        return res.text();
      })
      .then(setSource)
      .catch((e: unknown) => setError(e instanceof Error ? e.message : String(e)));
  }, [slug]);

  // Strip the H1 + byline lines out of the body; render them in the page
  // header like real posts do.
  let title = slug ?? "";
  let byline = "";
  let body = source ?? "";
  if (source) {
    const lines = source.split("\n");
    const rest: string[] = [];
    let seenTitle = false;
    let seenByline = false;
    for (const line of lines) {
      if (!seenTitle && line.startsWith("# ")) {
        title = line.slice(2).trim();
        seenTitle = true;
        continue;
      }
      if (seenTitle && !seenByline && /^\*?_?[Bb]y /.test(line.trim())) {
        byline = line.trim().replace(/^\*+|\*+$/g, "").replace(/^_+|_+$/g, "");
        seenByline = true;
        continue;
      }
      rest.push(line);
    }
    body = rest.join("\n");
  }

  return (
    <SitePageLayout activeSection="blog" contentAs="article" contentClassName="max-w-[760px] mx-auto px-6 pt-10 pb-[60px]">
      <Link
        to="/drafts"
        className="font-mono-brand text-[13px] text-muted-foreground transition-colors hover:text-foreground no-underline"
      >
        &larr; All drafts
      </Link>
      <p className="mt-6 inline-block rounded-full border border-amber-400 bg-amber-50 px-3 py-1 font-mono-brand text-[11px] uppercase tracking-[0.16em] text-amber-700">
        Draft preview &middot; {slug}.md
      </p>

      {error && (
        <p className="mt-10 font-mono-brand text-[14px] text-destructive">
          Could not load draft: {error}
        </p>
      )}

      {source !== null && (
        <>
          <h1 className="mt-8 mb-4 font-heading text-[clamp(36px,5vw,52px)] leading-[1.15] tracking-[-1.5px]">
            {title}
          </h1>
          {byline && (
            <p className="mb-10 font-mono-brand text-[13px] text-muted-foreground">
              {byline}
            </p>
          )}
          <div className="space-y-7 text-[17px] leading-[1.75] tracking-[-0.1px]">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h2: ({ children }) => (
                  <h2 className="pt-6 font-heading text-[clamp(26px,3.6vw,34px)] leading-[1.3] tracking-[-0.7px]">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="pt-2 font-heading text-[22px] leading-[1.35] tracking-[-0.4px]">
                    {children}
                  </h3>
                ),
                p: ({ children }) => <p>{children}</p>,
                a: ({ href, children }) => (
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
                // Draft markdown references images relative to the posts dir
                // (assets/<slug>/...); resolve them through the /draft-md symlink.
                img: ({ src, alt }) => (
                  <img
                    src={src && !/^(https?:)?\//.test(src) ? `/draft-md/${src}` : src}
                    alt={alt}
                    className="my-2 w-full rounded-md border border-border/70"
                  />
                ),
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
        </>
      )}
    </SitePageLayout>
  );
};

export default DraftPost;
