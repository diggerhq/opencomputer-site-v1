import { Link } from "react-router-dom";

type SiteSection = "blog";

interface SiteHeaderProps {
  activeSection?: SiteSection;
}

const navLinkClass = (isActive: boolean) =>
  [
    "font-mono-brand text-[13px] transition-colors no-underline",
    isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground",
  ].join(" ");

const SiteHeader = ({ activeSection }: SiteHeaderProps) => {
  return (
    <nav className="mx-auto flex max-w-[994px] flex-col gap-4 px-6 py-6 sm:px-10 md:flex-row md:items-center md:justify-between md:gap-6">
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

      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 md:justify-end">
        <a
          href="https://docs.opencomputer.dev"
          target="_blank"
          className="font-mono-brand text-[13px] text-muted-foreground hover:text-foreground transition-colors no-underline"
        >
          docs
        </a>
        <Link to="/blog" className={navLinkClass(activeSection === "blog")}>
          blog
        </Link>
        <a
          href="https://cal.com/team/digger/opencomputer-founder-chat"
          target="_blank"
          className="font-mono-brand text-[13px] text-muted-foreground hover:text-foreground transition-colors no-underline"
        >
          talk to founders
        </a>
        <a
          href="https://github.com/diggerhq/opencomputer"
          target="_blank"
          className="font-mono-brand text-[13px] text-muted-foreground hover:text-foreground transition-colors no-underline flex items-center gap-1.5"
        >
          <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>
          <span className="hidden sm:inline">GitHub</span>
        </a>
      </div>
    </nav>
  );
};

export default SiteHeader;
