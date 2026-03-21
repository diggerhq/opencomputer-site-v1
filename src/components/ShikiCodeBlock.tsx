import { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";
import type { BundledLanguage, BundledTheme } from "shiki";

type ShikiCodeBlockProps = {
  code: string;
  language: BundledLanguage;
  filename?: string;
  theme?: BundledTheme;
  className?: string;
  copyable?: boolean;
  headerTone?: "light" | "dark";
  bodyClassName?: string;
};

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const ShikiCodeBlock = ({
  code,
  language,
  filename,
  theme = "github-light",
  className = "",
  copyable = false,
  headerTone = "light",
  bodyClassName = "",
}: ShikiCodeBlockProps) => {
  const [html, setHtml] = useState<string>("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const highlight = async () => {
      const { codeToHtml } = await import("shiki");
      const rendered = await codeToHtml(code, {
        lang: language,
        theme,
      });

      if (!cancelled) {
        setHtml(rendered);
      }
    };

    void highlight();

    return () => {
      cancelled = true;
    };
  }, [code, language, theme]);

  const fallbackHtml = `<pre><code>${escapeHtml(code)}</code></pre>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  const headerClassName = headerTone === "dark"
    ? "border-b border-[hsl(0,0%,20%)] bg-[hsl(0,0%,12%)]"
    : "border-b border-border/70 bg-[hsl(0,0%,97.5%)]";

  const filenameClassName = headerTone === "dark"
    ? "text-[hsl(0,0%,68%)]"
    : "text-muted-foreground";

  const buttonClassName = headerTone === "dark"
    ? "text-[hsl(0,0%,68%)] hover:text-[hsl(0,0%,88%)]"
    : "text-muted-foreground hover:text-foreground";

  return (
    <div className={`overflow-hidden rounded-lg border border-border/70 bg-white ${className}`.trim()}>
      {filename || copyable ? (
        <div className={`flex items-center justify-between gap-3 px-3 py-2 ${headerClassName}`}>
          <p className={`font-mono-brand text-[10px] uppercase tracking-[0.14em] ${filenameClassName}`}>
            {filename}
          </p>
          {copyable ? (
            <button
              type="button"
              onClick={handleCopy}
              className={`transition-colors ${buttonClassName}`}
              aria-label="Copy code to clipboard"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </button>
          ) : null}
        </div>
      ) : null}
      <div
        className={`[&_code]:font-mono-brand [&_code]:text-[12px] [&_code]:leading-[1.7] [&_pre]:m-0 [&_pre]:overflow-x-auto [&_pre]:p-4 [&_pre]:font-mono-brand [&_pre]:text-[12px] [&_pre]:leading-[1.7] ${bodyClassName}`.trim()}
        dangerouslySetInnerHTML={{ __html: html || fallbackHtml }}
      />
    </div>
  );
};

export default ShikiCodeBlock;
