import { Link } from "react-router-dom";
import FadeIn from "@/components/FadeIn";

const guides = [
  {
    slug: "building-open-lovable-part-1",
    title: "Building an Open Lovable - part 1",
    description:
      "A series to build a lovable clone to learn how lovable works under the hood using Claude Agent SDK and OpenComputer.",
    author: "Mohamed Habib, CTO Digger",
    date: "March 11, 2026",
  },
];

const Guides = () => {
  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="max-w-[994px] mx-auto px-10 py-6 flex items-center justify-between">
        <span
          className="glitch-logo font-mono text-[15px] font-medium tracking-tight text-foreground"
          data-text="digger"
        >
          <a
            href="https://digger.dev"
            target="_blank"
            className="font-display text-lg font-medium tracking-tight text-foreground logo-ai-hover cursor-pointer no-underline"
            data-text="digger"
          >
            digger
          </a>{" "}
          /{" "}
          <a
            href="/"
            className="font-display text-lg font-medium tracking-tight text-foreground logo-ai-hover cursor-pointer no-underline"
            data-text="digger"
          >
            opencomputer
          </a>
        </span>
        <div className="flex items-center gap-5">
          <Link
            to="/guides"
            className="font-mono-brand text-[13px] text-muted-foreground hover:text-foreground transition-colors no-underline"
          >
            guides
          </Link>
          <a
            href="https://github.com/diggerhq/opencomputer"
            target="_blank"
            className="font-mono-brand text-[13px] text-muted-foreground hover:text-foreground transition-colors no-underline flex items-center gap-1.5"
          >
            <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>
            GitHub
          </a>
        </div>
      </nav>

      {/* Main */}
      <main className="max-w-[994px] mx-auto px-10 pt-10 pb-[60px]">
        <FadeIn>
          <h1 className="font-heading text-[clamp(42px,6vw,64px)] leading-[1.15] tracking-[-1.5px] mb-10">
            Guides
          </h1>
        </FadeIn>

        <div className="space-y-8">
          {guides.map((guide) => (
            <FadeIn key={guide.slug} delay={0.08}>
              <Link
                to={`/guides/${guide.slug}`}
                className="block p-6 rounded-lg border border-border/50 bg-[hsl(0,0%,98%)] hover:border-foreground/20 transition-colors duration-150 no-underline"
              >
                <h2 className="font-heading text-[24px] tracking-[-0.3px] mb-2 text-foreground">
                  {guide.title}
                </h2>
                <p className="text-[15px] leading-[1.7] text-muted-foreground mb-3">
                  {guide.description}
                </p>
                <p className="font-mono-brand text-[12px] text-muted-foreground">
                  {guide.author} &middot; {guide.date}
                </p>
              </Link>
            </FadeIn>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-[994px] mx-auto px-10 py-10 border-t border-border flex items-center justify-between">
        <span className="font-mono-brand text-[13px] text-muted-foreground">
          &copy; 2026 opencomputer by{" "}
          <span className="underline">
            <a
              href="https://digger.dev"
              target="_blank"
              data-text="digger"
            >
              digger
            </a>
          </span>
        </span>
        <a
          href="https://github.com/diggerhq/opencomputer"
          target="_blank"
          className="font-mono-brand text-[13px] text-muted-foreground hover:text-foreground transition-colors no-underline flex items-center gap-1.5"
        >
          <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>
          GitHub
        </a>
      </footer>
    </div>
  );
};

export default Guides;
