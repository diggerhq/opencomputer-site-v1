import { useState } from "react";
import FadeIn from "@/components/FadeIn";
import SEO from "@/components/SEO";
import SitePageLayout from "@/components/SitePageLayout";
import { agentPrefillUrl } from "@/lib/deferred-action";

const examples = [
  "Triage my GitHub issues",
  "Email me a Hacker News digest",
  "Slack bot that answers from our docs",
];

const Playground = () => {
  const [prompt, setPrompt] = useState("");

  const createAgent = () => {
    window.location.href = agentPrefillUrl("https://app.opencomputer.dev", prompt);
  };

  return (
    <SitePageLayout contentClassName="max-w-[680px] mx-auto px-6 sm:px-10 pt-[10vh] pb-[60px]">
      <SEO
        title="Playground"
        description="Describe an agent. Get a managed agent running on its own computer."
        path="/playground"
      />

      <FadeIn>
        <p className="font-mono-brand text-[11px] uppercase tracking-[0.15em] text-muted-foreground font-semibold mb-4 text-center">
          playground
        </p>
        <h1 className="font-heading text-[clamp(34px,5vw,48px)] leading-[1.15] tracking-[-1px] mb-10 text-center">
          What should your agent do?
        </h1>
      </FadeIn>

      <FadeIn delay={0.08}>
        <div className="rounded-lg border border-border bg-background shadow-[0_1px_2px_rgba(0,0,0,0.04)] focus-within:border-foreground/50 transition-colors">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                createAgent();
              }
            }}
            rows={4}
            autoFocus
            placeholder="Describe it. We handle the computer."
            className="w-full resize-none bg-transparent px-5 pt-4 pb-1 text-[16px] leading-[1.6] text-foreground placeholder:text-muted-foreground/70 outline-none"
          />
          <div className="flex items-center justify-between gap-3 px-3 pb-3">
            <span className="font-mono-brand text-[11px] text-muted-foreground pl-2 hidden sm:inline">
              runs on its own computer
            </span>
            <button
              type="button"
              onClick={createAgent}
              className="ml-auto inline-flex items-center gap-2 text-[14px] font-medium px-5 py-2.5 rounded-md bg-foreground text-background hover:opacity-90 transition-opacity duration-150"
            >
              Create agent <span aria-hidden="true">&rarr;</span>
            </button>
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={0.14}>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {examples.map((example) => (
            <button
              key={example}
              type="button"
              onClick={() => setPrompt(example)}
              className="font-mono-brand text-[12px] text-muted-foreground hover:text-foreground border border-border hover:border-foreground/40 rounded-full px-3.5 py-1.5 transition-colors"
            >
              {example}
            </button>
          ))}
        </div>
      </FadeIn>

      <FadeIn delay={0.2}>
        <p className="mt-14 text-center font-mono-brand text-[12px] text-muted-foreground">
          Prefer the API?{" "}
          <a
            href="https://docs.opencomputer.dev/agent-sessions/overview"
            target="_blank"
            rel="noreferrer"
            className="text-foreground underline underline-offset-4 decoration-border hover:decoration-foreground transition-colors"
          >
            Read the docs &rarr;
          </a>
        </p>
      </FadeIn>
    </SitePageLayout>
  );
};

export default Playground;
