import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Link } from "react-router-dom";
import FadeIn from "@/components/FadeIn";
import SitePageLayout from "@/components/SitePageLayout";

const features = [
  {
    title: "Agent Friendly",
    description:
      "Purpose built for running harnesses such as Claude Agent SDK.",
  },
  {
    title: "Elastic Compute",
    description:
      "Resize memory and CPU while VM is running.",
  },
  {
    title: "Persistent VMs",
    description:
      "Always-on VMs with elastic resizing. Hibernate when not needed, wake at any point.",
  },
  {
    title: "Checkpoints",
    description:
      "Instant snapshots. Fork or restore to any point. Bad VM state? Roll back in a second.",
  },
];

const pricingTiers = [
  {
    mem: "1 GB",
    cpu: "1 vCPU",
    reserved: { min: "$0.0002", hr: "$0.012", mo: "$8.76" },
    instant: { min: "$0.001", hr: "$0.06", mo: "$42.18" },
  },
  {
    mem: "2 GB",
    cpu: "1 vCPU",
    reserved: { min: "$0.0004", hr: "$0.024", mo: "$17.52" },
    instant: { min: "$0.002", hr: "$0.12", mo: "$84.36" },
  },
  {
    mem: "4 GB",
    cpu: "1 vCPU",
    reserved: { min: "$0.0008", hr: "$0.048", mo: "$35.04" },
    instant: { min: "$0.004", hr: "$0.24", mo: "$168.72" },
  },
  {
    mem: "8 GB",
    cpu: "2 vCPU",
    reserved: { min: "$0.0016", hr: "$0.096", mo: "$70.08" },
    instant: { min: "$0.008", hr: "$0.48", mo: "$337.44" },
  },
  {
    mem: "16 GB",
    cpu: "4 vCPU",
    reserved: { min: "$0.0032", hr: "$0.192", mo: "$140.16" },
    instant: { min: "$0.016", hr: "$0.96", mo: "$674.88" },
  },
];

const SKILL_INSTALL_CMD = "npx skills add diggerhq/opencomputer";

const Index = () => {
  const [skillCopied, setSkillCopied] = useState(false);
  const [tierIndex, setTierIndex] = useState(1);

  const handleSkillCopy = () => {
    navigator.clipboard.writeText(SKILL_INSTALL_CMD);
    setSkillCopied(true);
    setTimeout(() => setSkillCopied(false), 2000);
  };

  return (
    <SitePageLayout>
      <FadeIn>
        <h1 className="font-heading text-[clamp(42px,6vw,64px)] leading-[1.15] tracking-[-1.5px] mb-10">
          Beyond sandboxes.
        </h1>
      </FadeIn>

      <FadeIn delay={0.08}>
        <div className="mb-10 space-y-7">
          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            Today, agents use sandboxes to run untrusted code. Disposable
            computers that spin up, do a task, and disappear. But agents are
            getting more ambitious. They need a whole computer at their
            disposal - always on, always persistent, always ready.
          </p>
          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            Sandboxes are for throwaway tasks. Agents need something that
            sticks around.
          </p>
        </div>
      </FadeIn>

      <FadeIn delay={0.12}>
        <div className="mb-10 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 items-start">
          <div>
            <p className="font-mono-brand text-[11px] uppercase tracking-[0.15em] text-foreground font-semibold mb-3">
              Try it now
            </p>
            <button
              type="button"
              onClick={handleSkillCopy}
              className="w-full flex items-center justify-between gap-4 text-left text-[15px] font-medium px-5 py-4 rounded-md bg-foreground text-background hover:opacity-90 transition-opacity duration-150"
              aria-label="Copy setup instructions for my agent"
            >
              <span>{skillCopied ? "Copied!" : "Copy setup instructions for my agent"}</span>
              {skillCopied ? (
                <Check className="w-4 h-4 flex-shrink-0 opacity-90" />
              ) : (
                <Copy className="w-4 h-4 flex-shrink-0 opacity-90" />
              )}
            </button>
          </div>

          <div>
            <p className="font-mono-brand text-[11px] uppercase tracking-[0.15em] text-foreground font-semibold mb-3">
              Works with every agent
            </p>
            <div className="flex items-center gap-7 flex-wrap min-h-[44px]">
              {/* OpenCode */}
              <svg
                className="h-7 w-auto text-foreground"
                viewBox="0 0 24 36"
                fill="currentColor"
                aria-label="OpenCode"
              >
                <path d="M18 30H6V18H18V30Z" opacity="0.35" />
                <path d="M18 12H6V30H18V12ZM24 36H0V6H24V36Z" />
              </svg>
              {/* Claude Code */}
              <img
                src="/claude-ai-symbol.svg"
                alt="Claude Code"
                className="h-7 w-7"
              />
              {/* Codex (OpenAI mark) */}
              <svg
                className="h-7 w-7 text-foreground"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-label="Codex"
              >
                <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.05 6.05 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365 2.602-1.5 2.607 1.5v3l-2.597 1.5-2.607-1.5z" />
              </svg>
            </div>
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={0.16}>
        <p className="font-heading text-[clamp(28px,4vw,38px)] leading-[1.35] tracking-[-0.8px] mt-2 mb-2">
          It's time to give your agents a real computer.
        </p>
      </FadeIn>

      <FadeIn delay={0.24}>
        <div className="w-12 h-px bg-border my-8" />
      </FadeIn>

      <FadeIn>
        <div className="mb-14 space-y-7">
          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            Every OpenComputer is a real machine — a full filesystem, full OS
            access, and persistent state. It stays always on, ready when you
            need it. No timeouts, no teardowns. Your computer is just there.
          </p>
          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            Resize memory and CPU at runtime to match your workload. When you
            don't need it, hibernate and wake it up at any point — your state
            is exactly where you left it. It scales to thousands in the cloud,
            and you only pay for what you use.
          </p>
        </div>
      </FadeIn>

      <FadeIn>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-14">
          {features.map((f) => (
            <div
              key={f.title}
              className="p-6 rounded-lg border border-border/50 bg-[hsl(0,0%,98%)] hover:border-foreground/20 transition-colors duration-150"
            >
              <h3 className="font-heading text-[18px] tracking-[-0.3px] mb-2">
                {f.title}
              </h3>
              <p className="text-[15px] leading-[1.7] text-muted-foreground">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </FadeIn>

      <FadeIn>
        <div className="my-14">
          <p className="font-heading text-[clamp(28px,4vw,38px)] leading-[1.35] tracking-[-0.8px] mb-6">
            Pricing
          </p>
          <p className="text-[17px] leading-[1.75] tracking-[-0.1px] mb-8">
            Elastic memory and CPU — resize at runtime. 20 GB disk per VM. Pay only while running.
          </p>

          <div className="p-4 sm:p-8 rounded-xl border border-border/50 bg-[hsl(0,0%,98.5%)]">
            {/* Slider */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <p className="font-mono-brand text-[11px] uppercase tracking-[0.15em] text-muted-foreground">Memory</p>
                <p className="font-heading text-[28px] tracking-[-0.5px]">
                  {pricingTiers[tierIndex].mem}
                  <span className="text-muted-foreground text-[18px] ml-3">{pricingTiers[tierIndex].cpu}</span>
                </p>
              </div>
              <input
                type="range"
                min={0}
                max={pricingTiers.length - 1}
                value={tierIndex}
                onChange={(e) => setTierIndex(Number(e.target.value))}
                className="w-full h-2 rounded-full appearance-none cursor-pointer bg-border accent-foreground"
              />
              <div className="flex justify-between mt-2">
                <span className="font-mono-brand text-[11px] text-muted-foreground">1 GB</span>
                <span className="font-mono-brand text-[11px] text-muted-foreground">16 GB</span>
              </div>
            </div>

            {/* Pricing cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="p-5 rounded-lg bg-foreground text-background">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <p className="font-mono-brand text-[11px] uppercase tracking-[0.15em] opacity-70">Pre-booked</p>
                  <span className="font-mono-brand text-[10px] uppercase tracking-[0.12em] px-2 py-0.5 rounded-full bg-background/15 text-background">
                    5× cheaper than Instant
                  </span>
                </div>
                <p className="text-[13px] leading-[1.5] opacity-80 mb-4">
                  30 min notice. No commitment.{" "}
                  <a
                    href="https://docs.opencomputer.dev/reserved-capacity/overview"
                    target="_blank"
                    rel="noreferrer"
                    className="underline hover:opacity-100 opacity-90"
                  >
                    See docs →
                  </a>
                </p>
                <div className="space-y-3">
                  <div className="flex items-baseline justify-between">
                    <span className="font-mono-brand text-[11px] uppercase tracking-[0.15em] opacity-60">per minute</span>
                    <span className="font-heading text-[18px] tracking-[-0.3px] opacity-90">{pricingTiers[tierIndex].reserved.min}</span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="font-mono-brand text-[11px] uppercase tracking-[0.15em] opacity-60">per hour</span>
                    <span className="font-heading text-[18px] tracking-[-0.3px] opacity-90">{pricingTiers[tierIndex].reserved.hr}</span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="font-mono-brand text-[11px] uppercase tracking-[0.15em] opacity-60">per month</span>
                    <span className="font-heading text-[24px] tracking-[-0.5px]">{pricingTiers[tierIndex].reserved.mo}</span>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-lg bg-white border border-border/50">
                <p className="font-mono-brand text-[11px] uppercase tracking-[0.15em] text-muted-foreground mb-4">Instant</p>
                <div className="space-y-3">
                  <div className="flex items-baseline justify-between">
                    <span className="font-mono-brand text-[11px] uppercase tracking-[0.15em] text-muted-foreground">per minute</span>
                    <span className="font-heading text-[18px] tracking-[-0.3px]">{pricingTiers[tierIndex].instant.min}</span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="font-mono-brand text-[11px] uppercase tracking-[0.15em] text-muted-foreground">per hour</span>
                    <span className="font-heading text-[18px] tracking-[-0.3px]">{pricingTiers[tierIndex].instant.hr}</span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="font-mono-brand text-[11px] uppercase tracking-[0.15em] text-muted-foreground">per month</span>
                    <span className="font-heading text-[24px] tracking-[-0.5px]">{pricingTiers[tierIndex].instant.mo}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <p className="mt-4 text-[13px] text-muted-foreground">
            Disk above the 20 GB included is metered at $0.0000001 / GB-second (≈ $0.26 / GB-month), billed for the lifetime of the sandbox — running or hibernated.
          </p>
          <p className="mt-2 text-[13px] text-muted-foreground">
            Need more? <a href="https://cal.com/team/digger/opencomputer-founder-chat" target="_blank" className="underline hover:text-foreground transition-colors">Talk to us</a> about custom sizing and volume discounts.
          </p>
        </div>
      </FadeIn>

      <FadeIn>
        <div className="my-14 space-y-7">
          <p className="font-heading text-[clamp(28px,4vw,38px)] leading-[1.35] tracking-[-0.8px]">
            Built for B2B agent platforms.
          </p>
          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            If you're building the next Lovable, Devin, or Bolt, your users
            don't just need a sandbox that runs a script and dies. They need a
            computer that remembers what it installed yesterday, keeps their
            files between sessions, and picks up exactly where it left off.
            Sandboxes give you isolation. OpenComputer gives you isolation{" "}
            <em className="font-heading text-[19px]">and</em> persistence.
          </p>
          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            Ephemeral sandboxes are stateless - every session starts from
            scratch. OpenComputer VMs are persistent - they stay on until you
            explicitly stop or delete them, so state survives across sessions
            without any extra work.
          </p>
          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            No more re-installing node_modules from scratch because the
            container timed out. Your VM stays alive as long as you need it.
            Need more CPU mid-session? Resize on the fly without restarting.
          </p>
        </div>
      </FadeIn>

      <FadeIn>
        <div className="my-14">
          <p className="font-heading text-[clamp(28px,4vw,38px)] leading-[1.35] tracking-[-0.8px] mb-8">
            Blog
          </p>
          <div className="space-y-4">
            <Link
              to="/blog/what-elastic-compute-means"
              className="block p-6 rounded-lg border border-border/50 bg-[hsl(0,0%,98%)] hover:border-foreground/20 transition-colors duration-150 no-underline"
            >
              <h3 className="font-heading text-[22px] tracking-[-0.3px] mb-2 text-foreground">
                What "elastic compute" means in 2026
              </h3>
              <p className="text-[15px] leading-[1.7] text-muted-foreground mb-3">
                From EC2 to agent sandboxes — how agents broke the compute paradigms we've relied on for 20 years, and what elasticity looks like now.
              </p>
              <p className="font-mono-brand text-[12px] text-muted-foreground">
                Igor Zalutski &middot; April 7, 2026
              </p>
            </Link>
            <Link
              to="/blog/where-should-the-agent-live"
              className="block p-6 rounded-lg border border-border/50 bg-[hsl(0,0%,98%)] hover:border-foreground/20 transition-colors duration-150 no-underline"
            >
              <h3 className="font-heading text-[22px] tracking-[-0.3px] mb-2 text-foreground">
                Where Should the Agent(s) Live?
              </h3>
              <p className="text-[15px] leading-[1.7] text-muted-foreground mb-3">
                Isolation models, agent placement tradeoffs, credential design, and sandbox lifecycle patterns for agentic systems.
              </p>
              <p className="font-mono-brand text-[12px] text-muted-foreground">
                Utpal Nadiger, Mohamed Habib, Igor Zalutski &middot; March 20, 2026
              </p>
            </Link>
            <Link
              to="/blog/agent-execution-new-http-request"
              className="block p-6 rounded-lg border border-border/50 bg-[hsl(0,0%,98%)] hover:border-foreground/20 transition-colors duration-150 no-underline"
            >
              <h3 className="font-heading text-[22px] tracking-[-0.3px] mb-2 text-foreground">
                Agent Execution Is the New HTTP Request
              </h3>
              <p className="text-[15px] leading-[1.7] text-muted-foreground mb-3">
                From CGI scripts to serverless, web infrastructure evolved over 30 years. Now agents are taking us full circle.
              </p>
              <p className="font-mono-brand text-[12px] text-muted-foreground">
                Igor Zalutski &middot; March 17, 2026
              </p>
            </Link>
            <Link
              to="/blog/sandbox-fingerprinting"
              className="block p-6 rounded-lg border border-border/50 bg-[hsl(0,0%,98%)] hover:border-foreground/20 transition-colors duration-150 no-underline"
            >
              <h3 className="font-heading text-[22px] tracking-[-0.3px] mb-2 text-foreground">
                I Asked Opus 4.6 to Fingerprint Sandbox Vendors
              </h3>
              <p className="text-[15px] leading-[1.7] text-muted-foreground mb-3">
                We fingerprinted 6 sandbox providers to understand their isolation models. Here's what we found.
              </p>
              <p className="font-mono-brand text-[12px] text-muted-foreground">
                Mohamed Habib &middot; March 17, 2026
              </p>
            </Link>
            <Link
              to="/blog/the-agentic-workload"
              className="block p-6 rounded-lg border border-border/50 bg-[hsl(0,0%,98%)] hover:border-foreground/20 transition-colors duration-150 no-underline"
            >
              <h3 className="font-heading text-[22px] tracking-[-0.3px] mb-2 text-foreground">
                The Agentic Workload
              </h3>
              <p className="text-[15px] leading-[1.7] text-muted-foreground mb-3">
                Agent code doesn't fit neatly into existing categories. It's not a traditional app, and it's not a CI job. It's something new.
              </p>
              <p className="font-mono-brand text-[12px] text-muted-foreground">
                Igor Zalutski &middot; March 15, 2026
              </p>
            </Link>
            <Link
              to="/blog/building-open-lovable-part-1"
              className="block p-6 rounded-lg border border-border/50 bg-[hsl(0,0%,98%)] hover:border-foreground/20 transition-colors duration-150 no-underline"
            >
              <h3 className="font-heading text-[22px] tracking-[-0.3px] mb-2 text-foreground">
                Building an Open Lovable - part 1
              </h3>
              <p className="text-[15px] leading-[1.7] text-muted-foreground mb-3">
                A series to build a lovable clone to learn how lovable works under the hood using Claude Agent SDK and OpenComputer.
              </p>
              <p className="font-mono-brand text-[12px] text-muted-foreground">
                Mohamed Habib, CTO Digger &middot; March 11, 2026
              </p>
            </Link>
          </div>
        </div>
      </FadeIn>

      <FadeIn>
        <div className="mt-20 pt-14 border-t border-border">
          <div className="flex gap-3 items-center flex-wrap">
            <a
              href="https://app.opencomputer.dev"
              className="inline-block text-[15px] font-medium px-10 py-4 rounded-md bg-primary text-primary-foreground border border-primary hover:bg-foreground/90 transition-all duration-150"
            >
              Try it now &rarr;
            </a>
            <a
              href="https://docs.opencomputer.dev"
              className="inline-block text-sm font-medium px-7 py-3 rounded-md bg-background text-foreground border border-border hover:border-foreground transition-all duration-150"
            >
              Read the docs
            </a>
            <a
              href="https://github.com/diggerhq/opencomputer"
              target="_blank"
              className="inline-flex items-center gap-2 text-sm font-medium px-7 py-3 rounded-md bg-background text-foreground border border-border hover:border-foreground transition-all duration-150"
            >
              <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" /></svg>
              Star on GitHub
            </a>
            <a
              href="https://cal.com/team/digger/opencomputer-founder-chat"
              target="_blank"
              className="inline-block text-sm font-medium px-7 py-3 rounded-md bg-background text-foreground border border-border hover:border-foreground transition-all duration-150"
            >
              Speak to founders
            </a>
          </div>
        </div>
      </FadeIn>
    </SitePageLayout>
  );
};

export default Index;
