import { useState } from "react";
import FadeIn from "@/components/FadeIn";
import SitePageLayout from "@/components/SitePageLayout";
import SEO from "@/components/SEO";

const APP_URL = "https://app.opencomputer.dev";
const DOCS_URL = "https://docs.opencomputer.dev/agent-sessions/overview";
const GH_URL = "https://github.com/diggerhq/opencomputer";
const CAL_URL = "https://cal.com/team/digger/opencomputer-founder-chat";

/* ---------- Hero code (durable session lifecycle, per the docs) ---------- */

const codeSamples: Record<"ts" | "python", string> = {
  ts: `import { OpenComputer } from '@opencomputer/sdk';

const oc = new OpenComputer();

// 1. Define a durable agent — the brain runs apart
//    from the sandbox; your model key never enters it.
const agent = await oc.agents.create({
  name: 'support-triage',
  model: 'claude-opus-4-8',
  prompt: 'You triage inbound support tickets.',
  runtime: 'claude-agent-sdk',
});

// 2. Start a session — returns a browser-safe token.
const session = await oc.sessions.start({
  agent: agent.id,
  input: 'Investigate ticket #4821, draft a reply.',
});

// 3. Stream every step. Crash? It restarts.
//    Disconnect? Reconnect from any seq, no gaps.
for await (const e of oc.sessions.stream(session.id)) {
  console.log(e.seq, e.type);
}

// Steer mid-run with the client token.
await oc.sessions.send(session.id, 'Escalate to a human.');`,
  python: `from opencomputer import OpenComputer

oc = OpenComputer()

# 1. Define a durable agent - the brain runs apart
#    from the sandbox; your model key never enters it.
agent = oc.agents.create(
    name="support-triage",
    model="claude-opus-4-8",
    prompt="You triage inbound support tickets.",
    runtime="claude-agent-sdk",
)

# 2. Start a session - returns a browser-safe token.
session = oc.sessions.start(
    agent=agent.id,
    input="Investigate ticket #4821, draft a reply.",
)

# 3. Stream every step. Crash? It restarts.
#    Disconnect? Reconnect from any seq, no gaps.
for e in oc.sessions.stream(session.id):
    print(e.seq, e.type)

# Steer mid-run with the client token.
oc.sessions.send(session.id, "Escalate to a human.")`,
};

const stats = [
  { value: "Auto-restart", label: "runtime crashes recover themselves" },
  { value: "Resume any seq", label: "reconnect with no gaps" },
  { value: "Steerable", label: "redirect a run mid-flight" },
  { value: "Keys stay out", label: "model key never enters the sandbox" },
];

/* What the platform handles so you don't write it (from the docs) */
const stopBuilding = [
  {
    title: "Crash recovery",
    body: "Runtime crashes restart automatically. No supervisor loop, no half-finished state to reconcile.",
  },
  {
    title: "Reconnection logic",
    body: "Every session has an append-only event log. Reconnect from any seq and resume the stream without gaps.",
  },
  {
    title: "Stuck-run handling",
    body: "Hung runs stop cleanly instead of staying stuck and burning tokens until someone notices.",
  },
  {
    title: "Idle cost",
    body: "Idle sessions hibernate and wake on the next message. You don't pay to keep an agent parked.",
  },
  {
    title: "Key exposure",
    body: "The brain runs apart from the sandbox. Your model key lives in the secret store and never reaches untrusted code.",
  },
  {
    title: "Audit trail",
    body: "The event log is the durable record of every step — replayable, inspectable, and there when you need to debug.",
  },
];

/* How it works — the documented lifecycle */
const steps = [
  {
    n: "01",
    title: "Define an agent",
    body: "A reusable object: name, model, system prompt, and runtime. Reference a saved credential instead of pasting a key.",
  },
  {
    n: "02",
    title: "Start a session",
    body: "Hand it an input and it runs autonomously. You get back a browser-safe client token — no org key in the front end.",
  },
  {
    n: "03",
    title: "Stream, steer, get webhooks",
    body: "Watch events live over EventSource, send follow-ups to redirect the run, and receive signed webhooks on your backend.",
  },
];

const pricing = [
  {
    name: "Free",
    price: "$0",
    cadence: "no card required",
    highlight: false,
    cta: "Start free",
    href: APP_URL,
    points: [
      "Run real sessions, end to end",
      "Event log + resume",
      "Up to 5 concurrent runs",
      "Full sandbox access",
    ],
  },
  {
    name: "Pay as you go",
    price: "from $0.012",
    cadence: "per session-hour, billed per second",
    highlight: true,
    cta: "Start building",
    href: APP_URL,
    points: [
      "Only pay while a session runs",
      "Idle sessions hibernate free of compute",
      "Signed webhooks + dead-letter",
      "Steering + client tokens",
    ],
  },
  {
    name: "Scale",
    price: "Custom",
    cadence: "volume pricing & SLAs",
    highlight: false,
    cta: "Talk to founders",
    href: CAL_URL,
    points: [
      "Dedicated capacity & large pools",
      "Higher concurrency",
      "Volume discounts",
      "Priority support",
    ],
  },
];

/* ---------- Featured example: a background coding agent ----------
   A real, documented use case (see /blog/background-coding-agent).
   The event log below shows what durability actually buys you:
   a crash that resumes with no lost work, a mid-run steer, a webhook. */

type LogKind = "event" | "crash" | "resume" | "steer" | "webhook";

const exampleLog: { seq: string; kind: LogKind; label: string; detail: string }[] = [
  { seq: "01", kind: "event", label: "session.started", detail: "Fix issue #4821: refresh tokens expire early" },
  { seq: "12", kind: "event", label: "command.run", detail: "git clone && npm install" },
  { seq: "28", kind: "event", label: "file.write", detail: "src/auth/session.ts" },
  { seq: "41", kind: "crash", label: "runtime.crashed", detail: "OOM while running the test suite" },
  { seq: "41", kind: "resume", label: "auto-restarted", detail: "resumed from seq 41 — nothing re-run, nothing lost" },
  { seq: "42", kind: "event", label: "command.run", detail: "npm test — 48 passing" },
  { seq: "57", kind: "steer", label: "you ↦ session", detail: '"also bump the changelog"' },
  { seq: "63", kind: "event", label: "file.write", detail: "CHANGELOG.md" },
  { seq: "71", kind: "webhook", label: "webhook.sent", detail: "pull_request.opened → your backend" },
];

const logStyle: Record<LogKind, { dot: string; label: string; rail: string }> = {
  event: { dot: "bg-white/25", label: "text-white/75", rail: "border-white/10" },
  crash: { dot: "bg-[#febc2e]", label: "text-[#febc2e]", rail: "border-[#febc2e]/40" },
  resume: { dot: "bg-[#28c840]", label: "text-[#28c840]", rail: "border-[#28c840]/40" },
  steer: { dot: "bg-[#5b9cff]", label: "text-[#5b9cff]", rail: "border-[#5b9cff]/40" },
  webhook: { dot: "bg-[#28c840]", label: "text-[#28c840]", rail: "border-white/10" },
};

const Index = () => {
  const [lang, setLang] = useState<"ts" | "python">("ts");

  return (
    <SitePageLayout contentClassName="max-w-[1040px] mx-auto px-6 sm:px-10 pt-8 pb-[60px]">
      <SEO
        title="Durable Agent Sessions"
        description="Build a background agent in three calls. Long-running agent sessions on OpenComputer: crashes resume from the event log, idle runs hibernate, you steer mid-run, and your model key never enters the sandbox. You write the agent, not the plumbing."
        path="/durable-agent-sessions"
      />

      {/* ============ HERO ============ */}
      <FadeIn>
        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-10 lg:gap-12 items-center mt-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 mb-6 rounded-full border border-border/70 bg-[hsl(0,0%,98%)] px-3 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
              <span className="font-mono-brand text-[11px] uppercase tracking-[0.13em] text-muted-foreground">
                Durable agent sessions
              </span>
            </div>

            <h1 className="font-heading text-[clamp(40px,5.5vw,60px)] leading-[1.08] tracking-[-1.5px] mb-5">
              A background agent in three calls.
            </h1>

            <p className="text-[18px] leading-[1.65] tracking-[-0.1px] text-muted-foreground mb-8">
              Define an agent, start a session, and it runs on its own — cloning
              repos, editing files, running commands while you're away. OpenComputer
              keeps it alive: crashes resume from the event log, idle runs
              hibernate, and your model key never touches the sandbox. You write
              the agent, not the plumbing.
            </p>

            <div className="flex flex-wrap items-center gap-3 mb-4">
              <a
                href={APP_URL}
                className="inline-flex items-center gap-2 text-[15px] font-medium px-7 py-3.5 rounded-md bg-foreground text-background hover:opacity-90 transition-opacity duration-150 no-underline"
              >
                Start free <span aria-hidden="true">&rarr;</span>
              </a>
              <a
                href={DOCS_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center text-[15px] font-medium px-6 py-3.5 rounded-md bg-background text-foreground border border-border hover:border-foreground transition-colors duration-150 no-underline"
              >
                Read the docs
              </a>
            </div>

            <p className="font-mono-brand text-[12px] text-muted-foreground">
              Free tier, no credit card. First session in ~30 seconds.
            </p>
          </div>

          {/* code card */}
          <div className="rounded-xl overflow-hidden border border-foreground/10 shadow-[0_18px_50px_-22px_rgba(0,0,0,0.45)] bg-[#0e0e10]">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
              </div>
              <div className="flex items-center gap-1 rounded-md bg-white/5 p-0.5">
                {(["ts", "python"] as const).map((l) => (
                  <button
                    key={l}
                    onClick={() => setLang(l)}
                    className={`font-mono-brand text-[11px] px-2.5 py-1 rounded transition-colors ${
                      lang === l
                        ? "bg-white/15 text-white"
                        : "text-white/45 hover:text-white/80"
                    }`}
                  >
                    {l === "ts" ? "TypeScript" : "Python"}
                  </button>
                ))}
              </div>
            </div>
            <pre className="overflow-x-auto px-5 py-4 text-[12px] leading-[1.6]">
              <code className="font-mono-brand text-[#e6e6e6] whitespace-pre">
                {codeSamples[lang]}
              </code>
            </pre>
            <div className="px-5 py-2.5 border-t border-white/10 font-mono-brand text-[11px] text-white/40">
              {lang === "ts"
                ? "npm install @opencomputer/sdk"
                : "pip install opencomputer-sdk"}
            </div>
          </div>
        </div>
      </FadeIn>

      {/* ============ STATS ============ */}
      <FadeIn delay={0.06}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px rounded-xl overflow-hidden border border-border/60 bg-border/60 my-10">
          {stats.map((s) => (
            <div key={s.label} className="bg-[hsl(0,0%,98.5%)] px-5 py-5">
              <p className="font-heading text-[20px] tracking-[-0.4px] leading-tight mb-1.5">
                {s.value}
              </p>
              <p className="text-[12.5px] leading-[1.4] text-muted-foreground">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </FadeIn>

      {/* ============ FEATURED EXAMPLE ============ */}
      <FadeIn delay={0.04}>
        <div className="my-16 grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-8 lg:gap-12 items-center">
          <div>
            <p className="font-mono-brand text-[11px] uppercase tracking-[0.14em] text-muted-foreground mb-4">
              An example
            </p>
            <h2 className="font-heading text-[clamp(25px,3.3vw,32px)] leading-[1.2] tracking-[-0.7px] mb-4">
              A coding agent that survives a crash and a change of mind.
            </h2>
            <p className="text-[16px] leading-[1.7] text-muted-foreground mb-5">
              Label a GitHub issue and a session starts. It clones the repo and
              edits files in the sandbox. The test run OOMs and the runtime
              dies — but the event log is intact, so it restarts and resumes
              from exactly where it stopped. Nothing is re-run.
            </p>
            <p className="text-[16px] leading-[1.7] text-muted-foreground mb-6">
              Mid-run you send one message — <em className="font-heading not-italic">“also bump the changelog”</em> — and
              it adapts. When the PR opens, a signed webhook hits your backend.
              You were asleep the whole time.
            </p>
          </div>

          {/* event-log timeline */}
          <div className="rounded-xl overflow-hidden border border-foreground/10 shadow-[0_18px_50px_-22px_rgba(0,0,0,0.45)] bg-[#0e0e10]">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
              </div>
              <span className="font-mono-brand text-[11px] text-white/40">
                session event log
              </span>
            </div>
            <div className="px-4 sm:px-5 py-4 font-mono-brand text-[12px] leading-[1.5]">
              {exampleLog.map((row, i) => {
                const s = logStyle[row.kind];
                const indented = row.kind === "resume";
                return (
                  <div
                    key={i}
                    className={`flex items-start gap-3 py-1.5 ${
                      indented ? "pl-6" : ""
                    } ${
                      i !== exampleLog.length - 1 ? `border-l ${s.rail} ml-1.5 -mb-px` : ""
                    }`}
                  >
                    <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${s.dot} -ml-[3.5px]`} />
                    <span className="text-white/30 tabular-nums shrink-0 w-9">
                      {indented ? "↻" : `#${row.seq}`}
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className={`${s.label} font-medium`}>
                        {row.label}
                      </span>
                      <span className="text-white/45">  {row.detail}</span>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </FadeIn>

      {/* ============ STOP BUILDING ============ */}
      <FadeIn>
        <div className="my-16">
          <h2 className="font-heading text-[clamp(26px,3.5vw,34px)] leading-[1.2] tracking-[-0.8px] mb-2">
            The agent loop is easy. Keeping it alive is the work.
          </h2>
          <p className="text-[16px] leading-[1.7] text-muted-foreground mb-9 max-w-[62ch]">
            Running agents yourself means writing crash recovery, reconnection,
            and stuck-run handling before you ship a single feature. A durable
            session hands you all of it.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {stopBuilding.map((f) => (
              <div
                key={f.title}
                className="p-6 rounded-lg border border-border/50 bg-[hsl(0,0%,98%)] hover:border-foreground/25 transition-colors duration-150"
              >
                <h3 className="font-heading text-[18px] tracking-[-0.3px] mb-2">
                  {f.title}
                </h3>
                <p className="text-[14.5px] leading-[1.65] text-muted-foreground">
                  {f.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* ============ HOW IT WORKS ============ */}
      <FadeIn>
        <div className="my-16">
          <h2 className="font-heading text-[clamp(26px,3.5vw,34px)] leading-[1.2] tracking-[-0.8px] mb-9">
            Three calls from idea to a running, steerable agent.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {steps.map((s) => (
              <div
                key={s.n}
                className="p-6 rounded-xl border border-border/50 bg-[hsl(0,0%,98%)]"
              >
                <p className="font-mono-brand text-[12px] tracking-[0.1em] text-muted-foreground mb-4">
                  {s.n}
                </p>
                <h3 className="font-heading text-[19px] tracking-[-0.3px] mb-2">
                  {s.title}
                </h3>
                <p className="text-[14.5px] leading-[1.65] text-muted-foreground">
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* ============ BRAIN / HANDS ============ */}
      <FadeIn>
        <div className="my-16 grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          <div className="p-7 rounded-xl border border-border/50 bg-[hsl(0,0%,98%)]">
            <p className="font-mono-brand text-[11px] uppercase tracking-[0.14em] text-muted-foreground mb-3">
              The brain
            </p>
            <p className="font-heading text-[21px] tracking-[-0.4px] mb-3">
              The agent loop, managed.
            </p>
            <p className="text-[15px] leading-[1.7] text-muted-foreground">
              The reasoning loop runs in a controlled runtime that reads and
              writes the event log. It holds your model key — pulled from the
              secret store — and decides what to do next.
            </p>
          </div>
          <div className="p-7 rounded-xl border border-foreground/15 bg-foreground text-background">
            <p className="font-mono-brand text-[11px] uppercase tracking-[0.14em] opacity-60 mb-3">
              The hands
            </p>
            <p className="font-heading text-[21px] tracking-[-0.4px] mb-3">
              An isolated sandbox for files and commands.
            </p>
            <p className="text-[15px] leading-[1.7] opacity-80">
              Every file write and command runs in a sandbox the agent cannot
              use to reach your secrets. The model key stays in the brain and
              never enters untrusted code — separation by construction, not by
              policy.
            </p>
          </div>
        </div>
      </FadeIn>

      {/* ============ WHEN TO USE ============ */}
      <FadeIn>
        <div className="my-16 rounded-xl border border-border/50 bg-[hsl(0,0%,98.5%)] px-7 py-7">
          <p className="font-mono-brand text-[11px] uppercase tracking-[0.14em] text-muted-foreground mb-3">
            When to reach for a session
          </p>
          <p className="text-[16px] leading-[1.7] text-foreground/85">
            Use a session for long-running or interactive agents — anything that
            needs to survive a restart, take human steering, or run longer than a
            single request. For a one-shot command in a throwaway box, use a
            sandbox directly. Sessions are the layer on top, for when the agent
            has to stick around.
          </p>
        </div>
      </FadeIn>

      {/* ============ PRICING ============ */}
      <FadeIn>
        <div className="my-16">
          <h2 className="font-heading text-[clamp(26px,3.5vw,34px)] leading-[1.2] tracking-[-0.8px] mb-2">
            Start free. Pay per second when you scale.
          </h2>
          <p className="text-[16px] leading-[1.7] text-muted-foreground mb-9 max-w-[60ch]">
            No commitment, no idle charges. Sessions hibernate when they have
            nothing to do, so you only pay for compute that's actually running.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
            {pricing.map((tier) => (
              <div
                key={tier.name}
                className={`flex flex-col p-6 rounded-xl border ${
                  tier.highlight
                    ? "border-foreground/30 bg-[hsl(0,0%,98.5%)] shadow-[0_12px_40px_-24px_rgba(0,0,0,0.4)] md:-translate-y-2"
                    : "border-border/50 bg-[hsl(0,0%,98%)]"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <p className="font-mono-brand text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                    {tier.name}
                  </p>
                  {tier.highlight && (
                    <span className="font-mono-brand text-[10px] uppercase tracking-[0.1em] px-2 py-0.5 rounded-full bg-foreground text-background">
                      Most popular
                    </span>
                  )}
                </div>
                <p className="font-heading text-[30px] tracking-[-0.6px] leading-none mt-2 mb-1">
                  {tier.price}
                </p>
                <p className="text-[12.5px] text-muted-foreground mb-5">
                  {tier.cadence}
                </p>
                <ul className="space-y-2.5 mb-7 flex-1">
                  {tier.points.map((p) => (
                    <li
                      key={p}
                      className="flex gap-2.5 text-[14px] leading-[1.5] text-foreground/80"
                    >
                      <span className="text-foreground/40 mt-px">&#10003;</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href={tier.href}
                  target={tier.href === CAL_URL ? "_blank" : undefined}
                  rel="noreferrer"
                  className={`text-center text-[14px] font-medium px-5 py-3 rounded-md transition-all duration-150 no-underline ${
                    tier.highlight
                      ? "bg-foreground text-background hover:opacity-90"
                      : "bg-background text-foreground border border-border hover:border-foreground"
                  }`}
                >
                  {tier.cta}
                </a>
              </div>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* ============ FINAL CTA ============ */}
      <FadeIn>
        <div className="my-16 rounded-2xl border border-foreground/15 bg-foreground text-background px-8 py-12 text-center">
          <h2 className="font-heading text-[clamp(28px,4vw,40px)] leading-[1.15] tracking-[-1px] mb-4">
            Ship the agent. Skip the plumbing.
          </h2>
          <p className="text-[16px] leading-[1.7] opacity-75 mb-8 max-w-[50ch] mx-auto">
            Start a durable session in under a minute. Free tier, no credit
            card, and the crash-recovery code you were about to write is already
            done.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href={APP_URL}
              className="inline-flex items-center gap-2 text-[15px] font-medium px-8 py-4 rounded-md bg-background text-foreground hover:opacity-90 transition-opacity duration-150 no-underline"
            >
              Start free <span aria-hidden="true">&rarr;</span>
            </a>
            <a
              href={GH_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-[15px] font-medium px-7 py-4 rounded-md bg-transparent text-background border border-background/30 hover:border-background transition-colors duration-150 no-underline"
            >
              <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
              </svg>
              Star on GitHub
            </a>
            <a
              href={CAL_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center text-[15px] font-medium px-7 py-4 rounded-md bg-transparent text-background/80 hover:text-background transition-colors duration-150 no-underline underline underline-offset-4"
            >
              Talk to founders
            </a>
          </div>
        </div>
      </FadeIn>

    </SitePageLayout>
  );
};

export default Index;
