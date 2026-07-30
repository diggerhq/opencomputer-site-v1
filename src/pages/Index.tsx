import { useState } from "react";
import { Link } from "react-router-dom";
import FadeIn from "@/components/FadeIn";
import SitePageLayout from "@/components/SitePageLayout";
import SEO from "@/components/SEO";

/* ------------------------------ data ------------------------------ */

const pricingTiers = [
  { mem: "1 GB", cpu: "1 vCPU", instant: { min: "$0.001", hr: "$0.06", mo: "$42.18" } },
  { mem: "4 GB", cpu: "1 vCPU", instant: { min: "$0.004", hr: "$0.24", mo: "$168.72" } },
  { mem: "8 GB", cpu: "2 vCPU", instant: { min: "$0.008", hr: "$0.48", mo: "$337.44" } },
  { mem: "16 GB", cpu: "4 vCPU", instant: { min: "$0.016", hr: "$0.96", mo: "$674.88" } },
];

const journalEvents = [
  { seq: 42, label: "turn.start" },
  { seq: 43, label: "tool.call" },
  { seq: 44, label: "tool.result" },
  { seq: 45, label: "msg.delta" },
  { seq: 46, label: "tool.call" },
];

const blogPosts = [
  {
    to: "/blog/what-elastic-compute-means",
    title: 'What "elastic compute" means in 2026',
    byline: "Igor Zalutski · April 7, 2026",
  },
  {
    to: "/blog/where-should-the-agent-live",
    title: "Where Should the Agent(s) Live?",
    byline: "Utpal Nadiger, Mohamed Habib, Igor Zalutski · March 20, 2026",
  },
  {
    to: "/blog/agent-execution-new-http-request",
    title: "Agent Execution Is the New HTTP Request",
    byline: "Igor Zalutski · March 17, 2026",
  },
  {
    to: "/blog/sandbox-fingerprinting",
    title: "I Asked Opus 4.6 to Fingerprint Sandbox Vendors",
    byline: "Mohamed Habib · March 17, 2026",
  },
];

const GH_URL = "https://github.com/diggerhq/opencomputer";
const APP_URL = "https://app.opencomputer.dev";
const DOCS_URL = "https://docs.opencomputer.dev";
const CAL_URL = "https://cal.com/team/digger/opencomputer-founder-chat";

/* --------------------------- tiny pieces --------------------------- */

const Container = ({ className = "", children }: { className?: string; children: React.ReactNode }) => (
  <div className={`mx-auto max-w-[1080px] px-6 sm:px-10 ${className}`}>{children}</div>
);

const WindowChrome = ({ title, children, dark = false }: { title: string; children: React.ReactNode; dark?: boolean }) => (
  <div
    className={`rounded-xl overflow-hidden shadow-[0_24px_60px_-24px_rgba(0,0,0,0.35)] border ${
      dark ? "bg-[hsl(45,8%,8%)] text-[hsl(40,33%,97%)] border-black/40" : "bg-background border-border"
    }`}
  >
    <div className={`flex items-center gap-2 px-4 py-3 border-b ${dark ? "border-white/10" : "border-border"}`}>
      <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
      <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
      <span className="w-3 h-3 rounded-full bg-[#28c840]" />
      <span className={`ml-3 font-mono-brand text-[11px] ${dark ? "opacity-50" : "text-muted-foreground"}`}>{title}</span>
    </div>
    {children}
  </div>
);

/* ------------------------------ page ------------------------------ */

const Index = () => {
  const [tierIndex, setTierIndex] = useState(1);

  return (
    <SitePageLayout contentClassName="pb-0">
      <SEO
        title="A home for your agents"
        description="The open durable agent runtime. Author agents locally, run them as durable sessions, deploy the same protocol to real persistent VMs in the cloud."
      />

      <style>{`
        .oc-dotgrid {
          background-image: radial-gradient(hsl(45 8% 8% / 0.09) 1px, transparent 1px);
          background-size: 22px 22px;
        }
        .oc-fade-mask {
          -webkit-mask-image: linear-gradient(to bottom, black 55%, transparent 100%);
          mask-image: linear-gradient(to bottom, black 55%, transparent 100%);
        }
        @keyframes oc-blink { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0; } }
        .oc-cursor { animation: oc-blink 1.1s step-end infinite; }
        @keyframes oc-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(40,200,64,0.5); }
          60% { box-shadow: 0 0 0 7px rgba(40,200,64,0); }
        }
        .oc-live { animation: oc-pulse 1.8s ease-out infinite; }
        @keyframes oc-crash-flicker { 0%, 100% { opacity: 1; } 50% { opacity: 0.55; } }
        .oc-crash { animation: oc-crash-flicker 2.2s ease-in-out infinite; }
      `}</style>

      {/* ============================ HERO ============================ */}
      <section className="relative border-b border-border">
        <div className="absolute inset-0 oc-dotgrid oc-fade-mask" aria-hidden="true" />
        <Container className="relative pt-16 pb-20 md:pt-20 md:pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-14 lg:gap-12 items-center">
            {/* left: copy */}
            <div>
              <FadeIn>
                <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3.5 py-1.5 mb-7">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#28c840] oc-live" />
                  <span className="font-mono-brand text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                    Open source · early access
                  </span>
                </div>
                <h1 className="font-heading text-[clamp(44px,5.6vw,68px)] leading-[1.08] tracking-[-2px] mb-6">
                  A home for
                  <br />
                  your agents.
                </h1>
                <p className="text-[17px] leading-[1.7] tracking-[-0.1px] text-muted-foreground max-w-[460px] mb-8">
                  Agents shouldn't die with the process. OpenComputer is an
                  open durable runtime — crash, disconnect, redeploy, and the
                  run picks up where it left off.
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <a
                    href={APP_URL}
                    className="inline-flex items-center gap-2.5 text-[15px] font-medium px-6 py-3.5 rounded-md bg-foreground text-background hover:opacity-90 transition-opacity no-underline"
                  >
                    Get a VM →
                  </a>
                  <a
                    href={GH_URL}
                    target="_blank"
                    className="inline-flex items-center gap-2.5 text-[15px] font-medium px-6 py-3.5 rounded-md border border-border bg-background hover:border-foreground transition-colors no-underline"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
                    </svg>
                    Star on GitHub
                  </a>
                </div>
                <p className="mt-5 text-[13.5px] text-muted-foreground">
                  Persistent VMs are live.{" "}
                  <a href={CAL_URL} target="_blank" className="underline underline-offset-2 hover:text-foreground transition-colors">
                    Talk to us about agents →
                  </a>
                </p>
              </FadeIn>
            </div>

            {/* right: terminal */}
            <FadeIn delay={0.12}>
              <WindowChrome dark title="oc agents">
                <div className="px-5 py-5 font-mono-brand text-[13px] leading-[2.05] overflow-x-auto">
                  <div className="whitespace-nowrap">
                    <span className="opacity-45">$ </span>oc init my-agent
                  </div>
                  <div className="opacity-45 whitespace-nowrap">  created agent.md</div>
                  <div className="whitespace-nowrap">
                    <span className="opacity-45">$ </span>oc dev
                  </div>
                  <div className="opacity-45 whitespace-nowrap">  local control plane on :4180 · no cloud attached</div>
                  <div className="whitespace-nowrap">
                    <span className="opacity-45">$ </span>oc session "triage my inbox"
                  </div>
                  <div className="whitespace-nowrap">
                    <span className="text-[#28c840]">●</span>
                    <span className="opacity-70"> session s_9f2c · durable · streaming</span>
                  </div>
                  <div className="whitespace-nowrap">
                    <span className="opacity-45">$ </span>oc deploy
                  </div>
                  <div className="whitespace-nowrap">
                    <span className="opacity-70">  artifact sha256:81aa… → vm oc-4c21 · </span>
                    <span className="text-[#28c840]">live in 0.8s</span>
                  </div>
                  <div>
                    <span className="opacity-45">$ </span>
                    <span className="oc-cursor">█</span>
                  </div>
                </div>
              </WindowChrome>
            </FadeIn>
          </div>
        </Container>
      </section>

      {/* ======================= JOURNAL DIAGRAM ======================= */}
      <section className="border-b border-border bg-[hsl(0,0%,98.5%)]">
        <Container className="py-16 md:py-20">
          <FadeIn>
            <div className="rounded-xl border border-border bg-background p-5 sm:p-7 overflow-x-auto">
              <div className="flex items-center gap-2 min-w-[760px]">
                {journalEvents.map((e) => (
                  <div
                    key={e.seq}
                    className="flex-1 rounded-md border border-border bg-[hsl(0,0%,98%)] px-3 py-3 text-center"
                  >
                    <div className="font-mono-brand text-[10px] text-muted-foreground mb-1">seq {e.seq}</div>
                    <div className="font-mono-brand text-[12px]">{e.label}</div>
                  </div>
                ))}

                {/* crash */}
                <div className="oc-crash shrink-0 rounded-md border border-dashed border-[#d4453a]/60 bg-[#d4453a]/[0.06] px-3 py-3 text-center">
                  <div className="font-mono-brand text-[10px] text-[#d4453a]/70 mb-1">✕</div>
                  <div className="font-mono-brand text-[12px] text-[#d4453a]">runtime crash</div>
                </div>

                <div className="shrink-0 font-mono-brand text-[12px] text-muted-foreground px-1">→</div>

                {/* resume */}
                <div className="flex-1 rounded-md border border-foreground bg-foreground text-background px-3 py-3 text-center">
                  <div className="font-mono-brand text-[10px] opacity-60 mb-1">replay 42–46</div>
                  <div className="font-mono-brand text-[12px]">resume</div>
                </div>
                <div className="flex-1 rounded-md border border-border bg-[hsl(0,0%,98%)] px-3 py-3 text-center">
                  <div className="font-mono-brand text-[10px] text-muted-foreground mb-1">seq 47</div>
                  <div className="font-mono-brand text-[12px] inline-flex items-center gap-1.5">
                    tool.result
                    <span className="w-1.5 h-1.5 rounded-full bg-[#28c840] oc-live" />
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </Container>
      </section>

      {/* ===================== AGENT IS A REPO ===================== */}
      <section className="border-b border-border bg-[hsl(0,0%,98.5%)]">
        <Container className="py-16 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <FadeIn>
              <h2 className="font-heading text-[clamp(28px,3.6vw,40px)] leading-[1.2] tracking-[-1px] mb-5">
                An agent is a file.
              </h2>
              <p className="text-[16px] leading-[1.75] text-muted-foreground mb-5 max-w-[440px]">
                One file declares everything: the instructions, the tools it
                can use, the accounts it connects to, the channels it lives
                in. The runtime compiles it into an immutable artifact —
                reviewable, diffable, revertable.
              </p>
              <p className="text-[16px] leading-[1.75] text-muted-foreground max-w-[440px]">
                No framework, no boilerplate, no glue code. Check it into git
                like anything else. You read it, you own it.
              </p>
            </FadeIn>
            <FadeIn delay={0.1}>
              <WindowChrome title="agent.md">
                <div className="px-6 py-5 font-mono-brand text-[13px] leading-[2.05] overflow-x-auto">
                  <div className="text-muted-foreground">---</div>
                  <div className="whitespace-nowrap">
                    name: <span className="text-muted-foreground">inbox-triage</span>
                  </div>
                  <div className="whitespace-nowrap">
                    tools: <span className="text-muted-foreground">[gmail]</span>
                  </div>
                  <div className="whitespace-nowrap">
                    connections: <span className="text-muted-foreground">[google]</span>
                    <span className="text-muted-foreground pl-4"># scopes, not secrets</span>
                  </div>
                  <div className="whitespace-nowrap">
                    channels: <span className="text-muted-foreground">[slack]</span>
                    <span className="text-muted-foreground pl-4"># where it lives</span>
                  </div>
                  <div className="text-muted-foreground">---</div>
                  <div className="whitespace-nowrap mt-1">You triage inbound email.</div>
                  <div className="whitespace-nowrap">Group it by urgency, draft replies</div>
                  <div className="whitespace-nowrap">for anything that needs one, and</div>
                  <div className="whitespace-nowrap">never send without approval.</div>
                </div>
              </WindowChrome>
            </FadeIn>
          </div>
        </Container>
      </section>

      {/* ======================= DARK VM BAND ======================= */}
      <section className="bg-foreground text-background border-b border-border">
        <Container className="py-16 md:py-20">
          <FadeIn>
            <p className="font-mono-brand text-[11px] uppercase tracking-[0.15em] opacity-50 mb-4">The compute underneath</p>
            <h2 className="font-heading text-[clamp(28px,3.6vw,40px)] leading-[1.2] tracking-[-1px] mb-5 max-w-[560px]">
              Every session runs on a real computer.
            </h2>
            <p className="text-[16px] leading-[1.75] opacity-75 max-w-[560px] mb-12">
              Full filesystem, full OS access, a persistent mounted workspace
              — a real virtual machine, not a container or a throwaway
              sandbox. Sessions hibernate between turns and wake in
              milliseconds with state intact. And it's the same VM you can get
              bare: for your own harness, your own platform, the machines are
              a product on their own.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10 items-start">
            {/* VM features */}
            <FadeIn delay={0.05}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { t: "Persistent", d: "Always-on, hibernate when idle, wake with state exactly where you left it." },
                  { t: "Elastic", d: "Resize memory and CPU while the VM is running. No restart." },
                  { t: "Checkpoints", d: "Instant snapshots. Fork or restore to any point in a second." },
                  { t: "Agent friendly", d: "Purpose built for harnesses like Claude Agent SDK and OpenCode." },
                ].map((f) => (
                  <div key={f.t} className="p-6 rounded-xl border border-white/10 bg-white/[0.04]">
                    <h3 className="font-heading text-[18px] tracking-[-0.3px] mb-2">{f.t}</h3>
                    <p className="text-[14px] leading-[1.7] opacity-70">{f.d}</p>
                  </div>
                ))}
                <a
                  href={APP_URL}
                  className="sm:col-span-2 flex items-center justify-between p-6 rounded-xl bg-background text-foreground hover:opacity-90 transition-opacity no-underline"
                >
                  <span className="text-[15px] font-medium">Just need VMs? Log in and create one</span>
                  <span aria-hidden="true">→</span>
                </a>
              </div>
            </FadeIn>

            {/* pricing */}
            <FadeIn delay={0.1}>
              <div className="rounded-xl border border-white/10 bg-white/[0.04] p-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-mono-brand text-[11px] uppercase tracking-[0.15em] opacity-50">VM pricing</p>
                  <p className="font-heading text-[22px] tracking-[-0.5px]">
                    {pricingTiers[tierIndex].mem}
                    <span className="opacity-50 text-[14px] ml-2">{pricingTiers[tierIndex].cpu}</span>
                  </p>
                </div>
                <input
                  type="range"
                  min={0}
                  max={pricingTiers.length - 1}
                  value={tierIndex}
                  onChange={(e) => setTierIndex(Number(e.target.value))}
                  className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-white/15 accent-[hsl(40,33%,97%)]"
                />
                <div className="flex justify-between mt-1.5 mb-6">
                  <span className="font-mono-brand text-[10px] opacity-40">1 GB</span>
                  <span className="font-mono-brand text-[10px] opacity-40">16 GB</span>
                </div>
                <div className="space-y-3 border-t border-white/10 pt-5">
                  <div className="flex items-baseline justify-between">
                    <span className="font-mono-brand text-[11px] uppercase tracking-[0.15em] opacity-45">per minute</span>
                    <span className="font-heading text-[17px] tracking-[-0.3px] opacity-90">{pricingTiers[tierIndex].instant.min}</span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="font-mono-brand text-[11px] uppercase tracking-[0.15em] opacity-45">per hour</span>
                    <span className="font-heading text-[17px] tracking-[-0.3px] opacity-90">{pricingTiers[tierIndex].instant.hr}</span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="font-mono-brand text-[11px] uppercase tracking-[0.15em] opacity-45">per month</span>
                    <span className="font-heading text-[22px] tracking-[-0.5px]">{pricingTiers[tierIndex].instant.mo}</span>
                  </div>
                </div>
                <p className="mt-5 text-[12px] leading-[1.6] opacity-45">
                  20 GB disk included. Pay only while running.{" "}
                  <a href={CAL_URL} target="_blank" className="underline hover:opacity-100">
                    Talk to us
                  </a>{" "}
                  for volume discounts.
                </p>
              </div>
            </FadeIn>
          </div>
        </Container>
      </section>

      {/* =========================== BLOG =========================== */}
      <section className="border-b border-border">
        <Container className="py-16 md:py-20">
          <FadeIn>
            <div className="flex items-end justify-between mb-8">
              <h2 className="font-heading text-[clamp(28px,3.6vw,40px)] leading-[1.2] tracking-[-1px]">From the blog</h2>
              <Link to="/blog" className="font-mono-brand text-[13px] text-muted-foreground hover:text-foreground transition-colors no-underline">
                all posts →
              </Link>
            </div>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {blogPosts.map((p, i) => (
              <FadeIn key={p.to} delay={i * 0.04}>
                <Link
                  to={p.to}
                  className="block h-full p-6 rounded-xl border border-border bg-[hsl(0,0%,98%)] hover:border-foreground/25 transition-colors no-underline"
                >
                  <h3 className="font-heading text-[21px] leading-[1.3] tracking-[-0.3px] mb-3 text-foreground">{p.title}</h3>
                  <p className="font-mono-brand text-[12px] text-muted-foreground">{p.byline}</p>
                </Link>
              </FadeIn>
            ))}
          </div>
        </Container>
      </section>

      {/* ========================= FINAL CTA ========================= */}
      <section className="relative">
        <div className="absolute inset-0 oc-dotgrid" aria-hidden="true" />
        <Container className="relative py-20 md:py-24 text-center">
          <FadeIn>
            <h2 className="font-heading text-[clamp(32px,4.5vw,52px)] leading-[1.15] tracking-[-1.5px] mb-6">
              Your agent should outlive
              <br />
              the process that started it.
            </h2>
            <div className="flex flex-wrap justify-center items-center gap-3 mt-8">
              <a
                href={APP_URL}
                className="inline-block text-[15px] font-medium px-9 py-4 rounded-md bg-foreground text-background hover:opacity-90 transition-opacity no-underline"
              >
                Get a VM →
              </a>
              <a
                href={CAL_URL}
                target="_blank"
                className="inline-block text-[15px] font-medium px-7 py-4 rounded-md border border-border bg-background hover:border-foreground transition-colors no-underline"
              >
                Talk to us about agents
              </a>
              <a
                href={GH_URL}
                target="_blank"
                className="inline-block text-[15px] font-medium px-7 py-4 rounded-md border border-border bg-background hover:border-foreground transition-colors no-underline"
              >
                Star on GitHub
              </a>
            </div>
          </FadeIn>
        </Container>
      </section>
    </SitePageLayout>
  );
};

export default Index;
