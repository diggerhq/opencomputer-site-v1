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
        <Link
          to="/guides"
          className="font-mono-brand text-[13px] text-muted-foreground hover:text-foreground transition-colors no-underline"
        >
          guides
        </Link>
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
      <footer className="max-w-[994px] mx-auto px-10 py-10 border-t border-border">
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
      </footer>
    </div>
  );
};

export default Guides;
