import { Link } from "react-router-dom";
import FadeIn from "@/components/FadeIn";
import SitePageLayout from "@/components/SitePageLayout";

/* ---------- Callout ---------- */
const Callout = ({ children }: { children: React.ReactNode }) => (
  <div className="my-8 pl-5 border-l-[3px] border-foreground/80 py-1">
    <p className="font-heading text-[19px] leading-[1.65] tracking-[-0.2px] italic text-foreground/85">
      {children}
    </p>
  </div>
);

const WhatElasticComputeMeans = () => {
  return (
    <SitePageLayout activeSection="blog" contentAs="article">
      <FadeIn>
        <Link
          to="/blog"
          className="font-mono-brand text-[13px] text-muted-foreground hover:text-foreground transition-colors no-underline"
        >
          &larr; Back to blog
        </Link>
      </FadeIn>

      <FadeIn delay={0.04}>
        <h1 className="font-heading text-[clamp(36px,5vw,52px)] leading-[1.15] tracking-[-1.5px] mt-8 mb-4">
          What "elastic compute" means in 2026
        </h1>
      </FadeIn>

      <FadeIn delay={0.08}>
        <p className="font-mono-brand text-[13px] text-muted-foreground mb-10">
          Igor Zalutski &middot; April 7, 2026
        </p>
      </FadeIn>

      <FadeIn delay={0.12}>
        <div className="space-y-7">
          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            EC2 is the backbone of the modern internet, there's little doubt about that. Amazon started
            the cloud revolution back in 2006 by introducing scalable object storage decoupled from
            compute, followed shortly by compute with reliable provisioning that you could scale as you
            need - it grew out of the internal platform that Amazon had to build for itself to support
            the scale of e-commerce at its own web store.
          </p>

          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            20 years later, cloud VMs like EC2 are running the majority of SaaS applications. Often via
            more specialised higher-level services like container orchestrators or lambda functions, but
            the core remains more or less the same - VMs decoupled from the underlying hardware via
            hypervisors, highly optimised operating system images, and all the insane complexity of
            making a highly reliable host operating system with enough nines of reliability guarantees to
            support whatever you want to build, even if it's another Netflix with comparable popularity
            and load profile.
          </p>

          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            But now we have agents. A growing number of workloads are not even applications - they are
            ephemeral one-off artifacts that agents produce, or the agents themselves, often replicated
            across isolated sessions to ensure user's data is immune from the uncertainties introduced
            by LLMs. Are the tried and proven compute paradigms stay the same? Or do they change?
          </p>
        </div>
      </FadeIn>

      {/* ── Visual: Evolution of compute elasticity ── */}
      <FadeIn>
        <div className="my-12 p-6 rounded-xl border border-border/50 bg-[hsl(0,0%,98.5%)]">
          <p className="font-mono-brand text-[11px] uppercase tracking-[0.15em] text-muted-foreground mb-6">
            The elasticity timeline
          </p>
          <div className="space-y-3">
            {[
              { year: "2006", label: "EC2", sub: "Provision a VM in minutes", width: "30%", bg: "bg-[hsl(0,0%,88%)]", text: "text-[hsl(0,0%,40%)]" },
              { year: "2013", label: "Containers", sub: "Spin up in seconds, share the kernel", width: "48%", bg: "bg-[hsl(0,0%,75%)]", text: "text-[hsl(0,0%,20%)]" },
              { year: "2014", label: "Lambda", sub: "Per-invocation, millisecond billing", width: "62%", bg: "bg-[hsl(0,0%,55%)]", text: "text-[hsl(0,0%,95%)]" },
              { year: "2024", label: "Type-1 Sandboxes", sub: "Ephemeral VMs for untrusted code, ~100ms boot", width: "78%", bg: "bg-[hsl(0,0%,30%)]", text: "text-[hsl(0,0%,90%)]" },
              { year: "2025", label: "Type-2 Sandboxes", sub: "Isolate the agent itself, persistent sessions", width: "90%", bg: "bg-[hsl(0,0%,18%)]", text: "text-[hsl(0,0%,85%)]" },
              { year: "2026", label: "Elastic from inside", sub: "Agent controls its own CPU/RAM on demand", width: "100%", bg: "bg-foreground", text: "text-background" },
            ].map((era) => (
              <div
                key={era.label}
                className={`${era.bg} rounded-lg px-5 py-3.5 transition-all`}
                style={{ width: era.width }}
              >
                <div className="flex items-baseline gap-2">
                  <span className={`font-mono-brand text-[11px] ${era.text} opacity-60`}>{era.year}</span>
                  <p className={`font-mono-brand text-[13px] font-medium ${era.text}`}>{era.label}</p>
                </div>
                <p className={`font-mono-brand text-[11px] mt-0.5 ${era.text} opacity-60`}>{era.sub}</p>
              </div>
            ))}
          </div>
          <p className="font-mono-brand text-[11px] text-muted-foreground mt-4 italic">
            Each generation made "elastic" mean something faster and more granular.
          </p>
        </div>
      </FadeIn>

      <FadeIn>
        <div className="w-12 h-px bg-border my-10" />
      </FadeIn>

      {/* ====== Section: What's similar ====== */}
      <FadeIn>
        <h2 className="font-heading text-[clamp(28px,4vw,38px)] leading-[1.35] tracking-[-0.8px] mb-6">
          What's similar
        </h2>
      </FadeIn>

      <FadeIn>
        <div className="space-y-7">
          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            Many things didn't change at all. For example, agents still need all the usual stuff that a
            web server would. Agents need the same exact environment a web server would thrive in - an
            agent is a process like any other. Windows vs Linux aside, there's really nothing special
            that the host needs to provide for the agent to run on it.
          </p>

          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            The best coding agents, at least as of April 2026, are CLIs - they read and write files,
            use bash, start processes. They can go much further than a web server in what they can do
            on the host system - more on that later - but fundamentally they are just like any other
            *nix process. You do not need anything special to run a coding agent. A fresh EC2 for
            example would be a reasonably good environment for one agent.
          </p>

          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            But this "one agent" scenario is pretty much where similarities end.
          </p>
        </div>
      </FadeIn>

      <FadeIn>
        <div className="w-12 h-px bg-border my-10" />
      </FadeIn>

      {/* ====== Section: More elastic than EC2 ====== */}
      <FadeIn>
        <h2 className="font-heading text-[clamp(28px,4vw,38px)] leading-[1.35] tracking-[-0.8px] mb-6">
          More elastic than EC2
        </h2>
      </FadeIn>

      <FadeIn>
        <div className="space-y-7">
          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            The first bottleneck to be exposed by agents was the need to run untrusted code generated
            by an LLM on the fly. Say you've built your agent with Langchain or ai-sdk or another
            similar framework. Fundamentally it's a web application like any other - meaning it's
            likely deployed in some sort of a compute environment, perhaps containers or functions,
            with some degree of sharing the underlying compute across multiple requests.
          </p>

          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            Where do you run code generated by the LLM? Even if there is no resource sharing across
            requests (eg lambda), running ai-generated code on the same host that handles the request
            risks at a minimum secret exfiltration, or worse it could get access to all user's data if
            you get prompt-injected. You'd want bullet-proof isolation, ideally at kernel level - like
            a VM provides.
          </p>

          <Callout>
            What counted as "elastic" in 2003 - provision a new VM in a minute or so - is not nearly
            elastic enough in 2026.
          </Callout>

          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            So... start a new VM for every piece of code generated by an LLM? That'd take time to
            boot. Maintain a pool of warmed up VMs and share them to some extent across multiple LLM
            sessions? Possible but rather complex plus a tradeoff on security. This is how we realised
            that not all compute problems are solved yet. Agents introduced the need for compute that
            is more elastic than EC2.
          </p>

          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            Enter sandboxes! Or "type-1 sandboxes" as I call them, or "as-tool" scenario (see{" "}
            <a
              href="https://x.com/hwchase17/status/2021261552222158955"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-foreground/30 hover:decoration-foreground transition-colors"
            >
              two patterns
            </a>
            ) - ephemeral environments that spin-up on demand for untrusted code execution. An agent
            loop with something like ai-sdk would create a new sandbox every time the LLM generates a
            new piece of code. The faster such a sandbox starts, the faster is your agent - hence the
            competition on cold start latency amongst vendors.
          </p>
        </div>
      </FadeIn>

      {/* ── Visual: Type-1 sandbox flow ── */}
      <FadeIn>
        <div className="my-10 p-6 rounded-xl border border-border/50 bg-[hsl(0,0%,98.5%)]">
          <p className="font-mono-brand text-[11px] uppercase tracking-[0.15em] text-muted-foreground mb-5">
            Type-1 Sandbox: code execution as a tool
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-0 justify-between">
            {[
              { label: "LLM generates code", sub: "\"run this Python script\"" },
              { label: "Spin up sandbox", sub: "~100ms cold start" },
              { label: "Execute & return", sub: "stdout → agent context" },
              { label: "Destroy sandbox", sub: "ephemeral, no state" },
            ].map((step, i) => (
              <div key={step.label} className="flex items-center gap-3 sm:gap-0">
                <div className="text-center px-3 py-3 rounded-md border border-border/60 bg-white min-w-[140px]">
                  <p className="font-mono-brand text-[12px] font-medium">
                    {step.label}
                  </p>
                  <p className="font-mono-brand text-[10px] text-muted-foreground mt-1">
                    {step.sub}
                  </p>
                </div>
                {i < 3 && (
                  <span className="hidden sm:block text-muted-foreground/40 text-lg mx-2">
                    &rarr;
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </FadeIn>

      <FadeIn>
        <div className="w-12 h-px bg-border my-10" />
      </FadeIn>

      {/* ====== Section: Sandboxing the agent itself ====== */}
      <FadeIn>
        <h2 className="font-heading text-[clamp(28px,4vw,38px)] leading-[1.35] tracking-[-0.8px] mb-6">
          Sandboxing the agent itself
        </h2>
      </FadeIn>

      <FadeIn>
        <div className="space-y-7">
          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            As-tool sandboxes were the first of the new kinds of compute needed by agents; but not the
            last. Claude Code started the coding agent revolution; most agree that November 2025 was a
            bit of a watershed moment, before and after feel distinctly different. Many engineers
            switched from IDEs to CLI-first agents like Claude Code and Codex and never looked back.
            And these agents turned out to be surprisingly good! Autonomy is an ongoing debate but few
            would challenge their utility with a human still at the driving wheel.
          </p>

          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            CLI agents turned out to be far more than coding assistants though. As engineers started
            using Claude Code as primary daily drivers, they also started throwing other problems at
            it - it was already open so why not. And oftentimes Claude Code performed better than
            specialised domain-specific agents these engineers were building from the ground up! This
            is because surprisingly many non-coding problems generalise well into coding ones - for
            example spreadsheets, all sorts of data analyses, reports and so on. The model doesn't
            have to know the answer - it can generate code to arrive at the answer.
          </p>

          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            That emergent property led to development of some counter-intuitive patterns. Bill Chen
            from OpenAI{" "}
            <a
              href="https://youtu.be/wVl6ZjELpBk?t=737"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-foreground/30 hover:decoration-foreground transition-colors"
            >
              encouraged
            </a>{" "}
            to use Codex as a reusable building block at AIE - and it makes a lot of sense! Turns out
            you don't really need to build a custom harness for many if not most use cases. You can
            just customise Claude Code or Codex or OpenCode with skills and it'll do the job just fine.
          </p>

          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            Naturally seeing how people used their harnesses big labs introduced SDKs to make this
            pattern easier to implement - enter Claude Agent SDK / Codex SDK (and Codex App Server).
            These SDKs are a bit counterintuitive in that they require the underlying CLI to be present
            in the environment. In some sense they are "coding agent wrappers" that expose convenience
            methods to build apps around them. OpenAI takes this pattern one step further by
            formalising the low-level API of the harness with Codex App Server.
          </p>

          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            But how do you run agents built with these SDKs? Since the SDKs rely on the CLIs, they
            could read and write any files on the host machine. So some sort of isolation is needed.
            Anthropic proposes 3{" "}
            <a
              href="https://platform.claude.com/docs/en/agent-sdk/hosting"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-foreground/30 hover:decoration-foreground transition-colors"
            >
              deployment patterns
            </a>
            , none of which look like a typical web app - so you cannot really run an agent built with
            Claude SDK on Google Cloud Run or Lambda or any other popular runtime for web applications
            (because of the security reasons mentioned above). Instead, you need to securely isolate
            them - enter "type 2 sandboxes".
          </p>

          <Callout>
            With CLI-based SDKs for building agents, it is no longer enough to isolate the code that
            the agent generates. You also need to isolate the agent itself.
          </Callout>
        </div>
      </FadeIn>

      {/* ── Visual: Type-1 vs Type-2 comparison ── */}
      <FadeIn>
        <div className="my-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-xl border border-border/50 bg-[hsl(0,0%,98.5%)]">
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-[hsl(210,60%,55%)]" />
              <span className="font-mono-brand text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
                Type-1 &middot; as-tool
              </span>
            </div>
            <div className="space-y-3">
              {[
                { label: "Lifetime", value: "seconds" },
                { label: "Purpose", value: "run untrusted code" },
                { label: "Created by", value: "your app" },
                { label: "Key metric", value: "cold start latency" },
              ].map((row) => (
                <div key={row.label} className="flex justify-between items-baseline border-b border-border/30 pb-2">
                  <span className="font-mono-brand text-[12px] text-muted-foreground">{row.label}</span>
                  <span className="font-mono-brand text-[12px] font-medium">{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-xl border border-foreground/20 bg-foreground">
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-[hsl(120,50%,55%)]" />
              <span className="font-mono-brand text-[11px] uppercase tracking-[0.15em] text-background/60">
                Type-2 &middot; agent isolation
              </span>
            </div>
            <div className="space-y-3">
              {[
                { label: "Lifetime", value: "hours to days" },
                { label: "Purpose", value: "isolate the agent itself" },
                { label: "Created by", value: "your app, per user/session" },
                { label: "Key metric", value: "persistent state + security" },
              ].map((row) => (
                <div key={row.label} className="flex justify-between items-baseline border-b border-background/10 pb-2">
                  <span className="font-mono-brand text-[12px] text-background/50">{row.label}</span>
                  <span className="font-mono-brand text-[12px] font-medium text-background">{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </FadeIn>

      <FadeIn>
        <div className="space-y-7">
          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            Semantics here is somewhat different from "type-1" - a typical LLM-generated piece of code
            runs for a few seconds, whereas an agent session could run for hours or even days. It is
            much more like a persistent VM; but created on-demand in the application, often one for
            each user or even for each agent session for added security.
          </p>
        </div>
      </FadeIn>

      <FadeIn>
        <div className="w-12 h-px bg-border my-10" />
      </FadeIn>

      {/* ====== Section: Elasticity from inside the box ====== */}
      <FadeIn>
        <h2 className="font-heading text-[clamp(28px,4vw,38px)] leading-[1.35] tracking-[-0.8px] mb-6">
          Elasticity from inside the box
        </h2>
      </FadeIn>

      <FadeIn>
        <div className="space-y-7">
          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            So now we have CLI agents running inside "type-2" sandboxes, are we done with compute? Is
            it finally solved? No, not really.
          </p>

          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            Say you are building a coding agent that resolves issues reacting to events from Slack or
            Linear. And say you have a large Rust codebase, which is notoriously heavy on CPU and RAM.
            Which box do you put your agents in? 16gb for the whole duration of your agent session?
            This seems wasteful (and expensive) because most of the time it'll be idle waiting for LLM
            responses. But any less and you risk your Rust build failing; you could run builds in a
            separate ad-hoc box, but then you need to move all the files around, which will be rather
            slow.
          </p>

          <Callout>
            What if the agent could control the resources it has from inside the box it already runs in?
          </Callout>
        </div>
      </FadeIn>

      {/* ── Visual: Resource usage over time ── */}
      <FadeIn>
        <div className="my-12 p-6 rounded-xl border border-border/50 bg-[hsl(0,0%,98.5%)]">
          <p className="font-mono-brand text-[11px] uppercase tracking-[0.15em] text-muted-foreground mb-2">
            Agent session resource usage over time
          </p>
          <p className="font-mono-brand text-[10px] text-muted-foreground mb-6">
            Rust codebase scenario &mdash; most time idle, brief burst for builds
          </p>

          {/* Simplified bar chart */}
          <div className="flex items-end gap-[3px] h-[120px] mb-4">
            {[
              { h: "15%", label: "", active: false },
              { h: "15%", label: "", active: false },
              { h: "15%", label: "", active: false },
              { h: "12%", label: "", active: false },
              { h: "15%", label: "", active: false },
              { h: "15%", label: "", active: false },
              { h: "12%", label: "", active: false },
              { h: "15%", label: "", active: false },
              { h: "85%", label: "", active: true },
              { h: "95%", label: "", active: true },
              { h: "100%", label: "", active: true },
              { h: "90%", label: "", active: true },
              { h: "15%", label: "", active: false },
              { h: "12%", label: "", active: false },
              { h: "15%", label: "", active: false },
              { h: "15%", label: "", active: false },
              { h: "12%", label: "", active: false },
              { h: "15%", label: "", active: false },
              { h: "15%", label: "", active: false },
              { h: "15%", label: "", active: false },
            ].map((bar, i) => (
              <div
                key={i}
                className={`flex-1 rounded-t-sm transition-all ${
                  bar.active ? "bg-foreground" : "bg-[hsl(0,0%,80%)]"
                }`}
                style={{ height: bar.h }}
              />
            ))}
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm bg-[hsl(0,0%,80%)]" />
                <span className="font-mono-brand text-[10px] text-muted-foreground">1 GB idle</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm bg-foreground" />
                <span className="font-mono-brand text-[10px] text-muted-foreground">16 GB burst (cargo build)</span>
              </div>
            </div>
            <span className="font-mono-brand text-[11px] font-medium text-[hsl(120,45%,40%)]">
              &gt;10x savings
            </span>
          </div>
        </div>
      </FadeIn>

      <FadeIn>
        <div className="space-y-7">
          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            This seems very natural, but understandably none of the traditional compute providers were
            built for that scenario. Compute was always meant to be controlled externally -
            unsurprisingly, because until very recently we only had human intelligence!
          </p>

          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            At{" "}
            <a
              href="https://opencomputer.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-foreground/30 hover:decoration-foreground transition-colors"
            >
              opencomputer
            </a>{" "}
            we are solving this by exposing elasticity endpoints to the agent inside the box. It can
            request more CPU/RAM as it sees fit, and very granularly (billing is per-second). This way
            in a heavy Rust codebase scenario you can stay at 1gb most of the time and only burst to
            16gb for the duration of the build - saving more than 10x on compute.{" "}
            <a
              href="https://docs.opencomputer.dev/sandboxes/elasticity"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-foreground/30 hover:decoration-foreground transition-colors"
            >
              Give it a try
            </a>
            !
          </p>
        </div>
      </FadeIn>

      <FadeIn>
        <div className="w-12 h-px bg-border my-10" />
      </FadeIn>

      <FadeIn>
        <p className="text-[15px] leading-[1.75] text-muted-foreground italic">
          <a
            href="https://www.loom.com/share/53f966f1837d417ca83cd4f10c96f397"
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-foreground/30 hover:decoration-foreground transition-colors"
          >
            Written by a human
          </a>
        </p>
      </FadeIn>
    </SitePageLayout>
  );
};

export default WhatElasticComputeMeans;
