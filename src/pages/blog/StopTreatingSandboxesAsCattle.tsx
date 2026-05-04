import { Link } from "react-router-dom";
import FadeIn from "@/components/FadeIn";
import SitePageLayout from "@/components/SitePageLayout";
import SEO from "@/components/SEO";

const Callout = ({ children }: { children: React.ReactNode }) => (
  <div className="my-8 border-l-[3px] border-foreground/80 py-1 pl-5">
    <p className="font-heading text-[19px] leading-[1.65] tracking-[-0.2px] italic text-foreground/85">
      {children}
    </p>
  </div>
);

const Quote = ({
  children,
  source,
}: {
  children: React.ReactNode;
  source: string;
}) => (
  <figure className="my-8 rounded-xl border border-border/80 bg-[hsl(0,0%,98.5%)] px-6 py-5">
    <p className="font-mono-brand text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
      Andrea Luzzardi, Mendral
    </p>
    <blockquote className="mt-3 text-[16px] leading-[1.7] tracking-[-0.1px] text-foreground/85">
      &ldquo;{children}&rdquo;
    </blockquote>
    <figcaption className="mt-3 font-mono-brand text-[11px] text-muted-foreground">
      <a
        href={source}
        target="_blank"
        rel="noopener noreferrer"
        className="underline decoration-foreground/30 hover:decoration-foreground transition-colors"
      >
        The agent harness belongs outside the sandbox &rarr;
      </a>
    </figcaption>
  </figure>
);

const DiagramPanel = ({
  title,
  eyebrow,
  children,
}: {
  title: string;
  eyebrow: string;
  children: React.ReactNode;
}) => (
  <div className="overflow-hidden rounded-xl border border-border/80 bg-white shadow-[0_12px_32px_rgba(0,0,0,0.06)]">
    <div className="border-b border-border/70 bg-[linear-gradient(180deg,hsl(0,0%,99%),hsl(0,0%,96%))] px-5 py-3">
      <p className="font-mono-brand text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
        {eyebrow}
      </p>
      <p className="mt-1 font-heading text-[20px] tracking-[-0.3px] text-foreground">
        {title}
      </p>
    </div>
    <div className="p-5 md:p-6">{children}</div>
  </div>
);

const ProxyNode = ({
  title,
  lines,
  tone = "neutral",
}: {
  title: string;
  lines: string[];
  tone?: "neutral" | "accent";
}) => (
  <div
    className={`rounded-xl border px-4 py-4 ${
      tone === "accent"
        ? "border-foreground bg-foreground text-background"
        : "border-border/80 bg-[hsl(0,0%,98.5%)] text-foreground"
    }`}
  >
    <p
      className={`font-heading text-[18px] tracking-[-0.3px] ${
        tone === "accent" ? "text-background" : "text-foreground"
      }`}
    >
      {title}
    </p>
    <div className="mt-3 space-y-2">
      {lines.map((line) => (
        <div key={line} className="flex items-start gap-2">
          <span
            className={`mt-[6px] h-1.5 w-1.5 rounded-full ${
              tone === "accent" ? "bg-background/70" : "bg-foreground/70"
            }`}
          />
          <p
            className={`font-mono-brand text-[11px] leading-[1.6] ${
              tone === "accent" ? "text-background/72" : "text-muted-foreground"
            }`}
          >
            {line}
          </p>
        </div>
      ))}
    </div>
  </div>
);

const Arrow = () => (
  <div className="flex items-center justify-center py-1 lg:py-0">
    <span className="hidden font-mono-brand text-[18px] text-muted-foreground lg:inline">
      &rarr;
    </span>
    <span className="font-mono-brand text-[18px] text-muted-foreground lg:hidden">
      &darr;
    </span>
  </div>
);

const HibernationStep = ({
  number,
  title,
  detail,
  badge,
}: {
  number: string;
  title: string;
  detail: string;
  badge?: string;
}) => (
  <div className="rounded-xl border border-border/80 bg-[hsl(0,0%,98.5%)] px-4 py-4">
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-foreground font-mono-brand text-[11px] text-background">
          {number}
        </span>
        <p className="font-heading text-[18px] tracking-[-0.3px] text-foreground">
          {title}
        </p>
      </div>
      {badge && (
        <span className="rounded-full bg-white px-2 py-1 font-mono-brand text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
          {badge}
        </span>
      )}
    </div>
    <p className="mt-3 text-[14px] leading-[1.65] text-muted-foreground">
      {detail}</p>
  </div>
);

const FlowConnector = () => (
  <div className="flex h-4 justify-center">
    <div className="flex flex-col items-center">
      <span className="h-2 w-px bg-border" />
      <span className="font-mono-brand text-[13px] leading-none text-muted-foreground">
        &darr;
      </span>
    </div>
  </div>
);

const OptionColumn = ({
  title,
  subtitle,
  items,
  accent = false,
}: {
  title: string;
  subtitle: string;
  items: string[];
  accent?: boolean;
}) => (
  <div
    className={`rounded-xl border px-4 py-4 ${
      accent
        ? "border-[hsl(140,35%,42%)] bg-[hsl(138,35%,93%)] text-[hsl(140,28%,20%)]"
        : "border-border/80 bg-[hsl(0,0%,98.5%)] text-foreground"
    }`}
  >
    <p
      className={`font-heading text-[18px] tracking-[-0.3px] ${
        accent ? "text-[hsl(140,28%,20%)]" : "text-foreground"
      }`}
    >
      {title}
    </p>
    <p
      className={`mt-1 font-mono-brand text-[11px] uppercase tracking-[0.14em] ${
        accent ? "text-[hsl(140,20%,38%)]" : "text-muted-foreground"
      }`}
    >
      {subtitle}
    </p>
    <div className="mt-3 space-y-2">
      {items.map((item) => (
        <div
          key={item}
          className={`rounded-lg px-3 py-2 font-mono-brand text-[11px] leading-[1.5] ${
            accent
              ? "bg-[hsl(0,0%,100%)]/65 text-[hsl(140,20%,30%)]"
              : "bg-white text-[hsl(0,0%,42%)]"
          }`}
        >
          {item}
        </div>
      ))}
    </div>
  </div>
);

const StopTreatingSandboxesAsCattle = () => {
  return (
    <SitePageLayout activeSection="blog" contentAs="article">
      <SEO
        title="Stop Treating Agent Sandboxes as Cattle"
        description="A direct response to 'The agent harness belongs outside the sandbox.' Why credentials, hibernation, elasticity, and checkpoints make a persistent in-sandbox harness the better default."
        author="Utpal Nadiger"
        path="/blog/stop-treating-sandboxes-as-cattle"
        type="article"
      />

      <FadeIn>
        <Link
          to="/blog"
          className="font-mono-brand text-[13px] text-muted-foreground transition-colors hover:text-foreground no-underline"
        >
          &larr; Back to blog
        </Link>
      </FadeIn>

      <FadeIn delay={0.04}>
        <h1 className="mt-8 mb-4 font-heading text-[clamp(36px,5vw,52px)] leading-[1.15] tracking-[-1.5px]">
          Stop Treating Agent Sandboxes as Cattle
        </h1>
      </FadeIn>

      <FadeIn delay={0.08}>
        <p className="mb-10 font-mono-brand text-[13px] text-muted-foreground">
          Utpal Nadiger &middot; May 4, 2026
        </p>
      </FadeIn>

      <FadeIn delay={0.12}>
        <div className="space-y-7 text-[17px] leading-[1.75] tracking-[-0.1px]">
          <p>
            This article is in direct response to{" "}
            <a
              href="https://www.mendral.com/blog/agent-harness-belongs-outside-sandbox"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-foreground/30 hover:decoration-foreground transition-colors"
            >
              &ldquo;The agent Harness belongs outside the sandbox&rdquo;
            </a>{" "}
            by Andrea Luzzardi. The premise of this article is that, well,
            you can (and in most cases should) run the agent harness{" "}
            <em>inside</em> the sandbox.
          </p>
          <p>
            I&apos;ll follow it up with 3 specific rebuttals from what is in
            the blog and what I think is fundamentally flawed in the arguments
            mentioned there. Lastly, to the author: Mendral looks incredible,
            more power to you!
          </p>
          <p>Now for the rebuttals!</p>
        </div>
      </FadeIn>

      <FadeIn>
        <div className="my-10 h-px w-12 bg-border" />
      </FadeIn>

      {/* ==================== REBUTTAL 1 ==================== */}
      <FadeIn>
        <section className="space-y-6">
          <p className="font-mono-brand text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
            Rebuttal 1 of 3
          </p>

          <Quote source="https://www.mendral.com/blog/agent-harness-belongs-outside-sandbox">
            Running the harness outside the sandbox gets you things the inside
            model can&apos;t. Your credentials stay out of the sandbox. The loop
            holds the LLM API keys, the user tokens, the database access. The
            sandbox holds only the environment the agent needs to do its work.
            There&apos;s nothing in there for the agent to escape to, so
            there&apos;s no permission model to enforce and no credential leak
            to contain.
          </Quote>

          <div className="space-y-7 text-[17px] leading-[1.75] tracking-[-0.1px]">
            <p>
              We think that this is a solved problem &amp; has been for years.
            </p>
            <p>
              What you essentially want is credentials never at rest in the
              sandbox. A network egress proxy gives you that (there are ones
              that are open source like fly&apos;s{" "}
              <a
                href="https://github.com/superfly/tokenizer"
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-foreground/30 hover:decoration-foreground transition-colors"
              >
                tokenizer
              </a>{" "}
              or{" "}
              <a
                href="https://www.mitmproxy.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-foreground/30 hover:decoration-foreground transition-colors"
              >
                mitmproxy
              </a>
              ):
            </p>
            <ul className="list-disc space-y-2 pl-6">
              <li>
                The sandbox holds a handle (an opaque token, a placeholder, a
                short lived metadata service response). No real credential
                material.
              </li>
              <li>
                Outbound traffic routes through the proxy. The proxy substitutes
                the real token at the boundary.
              </li>
              <li>
                The upstream service sees a properly authenticated request. The
                sandbox NEVER sees the real secret.
              </li>
            </ul>

            <DiagramPanel
              eyebrow="Credentials"
              title="The sandbox never sees the real secret"
            >
              <div className="grid gap-4 lg:grid-cols-[1fr_auto_1fr_auto_1fr] lg:items-stretch">
                <ProxyNode
                  title="Sandbox"
                  lines={[
                    "holds an opaque handle",
                    "placeholder or short lived token",
                    "no real credential material",
                  ]}
                />
                <Arrow />
                <ProxyNode
                  title="Egress proxy"
                  tone="accent"
                  lines={[
                    "intercepts outbound traffic",
                    "substitutes the real secret",
                    "applies scope and rate limits",
                  ]}
                />
                <Arrow />
                <ProxyNode
                  title="Upstream service"
                  lines={[
                    "receives a properly authenticated request",
                    "never knows about the sandbox",
                    "platform owns the root credential",
                  ]}
                />
              </div>
            </DiagramPanel>

            <p>
              This is what Fly&apos;s Tokenizer does. It&apos;s what AWS IMDS
              does for EC2 and Lambda with short lived role credentials.
              It&apos;s also the pattern Hashicorp Vault popularized fifteen
              years ago. It&apos;s the default for human developers and CI
              systems already, and it transfers cleanly to agent sandboxes.
            </p>
          </div>
        </section>
      </FadeIn>

      <FadeIn>
        <div className="my-10 h-px w-12 bg-border" />
      </FadeIn>

      {/* ==================== REBUTTAL 2 ==================== */}
      <FadeIn>
        <section className="space-y-6">
          <p className="font-mono-brand text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
            Rebuttal 2 of 3
          </p>

          <Quote source="https://www.mendral.com/blog/agent-harness-belongs-outside-sandbox">
            A lot of what an agent does doesn&apos;t need a sandbox at all:
            thinking, calling APIs, summarizing, waiting for CI. Some sessions
            never touch a sandbox. With the harness outside, you provision one
            only when the agent needs to run a command, and suspend it whenever
            it&apos;s idle. When the harness lives inside the sandbox you
            can&apos;t do any of this, because you can&apos;t suspend the thing
            the loop is running on.
          </Quote>

          <div className="space-y-7 text-[17px] leading-[1.75] tracking-[-0.1px]">
            <p>
              Precisely right on the cost concern, idle compute shouldn&apos;t
              bill. But this isn&apos;t an argument for running the harness
              outside the sandbox, but about{" "}
              <em>hibernation and elasticity</em>, both of which are properties
              of the sandbox primitive &amp; doesn&apos;t concern the location
              of the harness.
            </p>
            <p>
              &ldquo;You can&apos;t suspend the thing the loop is running
              on&rdquo; is only true if your sandbox can&apos;t hibernate the
              whole VM.{" "}
              <a
                href="https://opencomputer.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-foreground/30 hover:decoration-foreground transition-colors"
              >
                Opencomputer
              </a>{" "}
              can:
            </p>
            <ul className="list-disc space-y-2 pl-6">
              <li>
                Hibernation drops idle sandboxes to disk. The entire VM ie.
                process tree, in-memory state, file handles, the loop itself is
                frozen and resumable in ~25ms. While hibernated, you&apos;re
                billing for snapshot storage and not compute. So stuff like CI
                waits, LLM round-trips, multi-minute &ldquo;thinking&rdquo;
                stretches all happen while the sandbox is essentially
                &ldquo;off&rdquo;.
              </li>
              <li>
                <a
                  href="https://docs.opencomputer.dev/sandboxes/elasticity"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline decoration-foreground/30 hover:decoration-foreground transition-colors"
                >
                  Elasticity
                </a>{" "}
                scales the live VM between 1GB/1vCPU and 16GB/4vCPU based on
                observed memory pressure, with a 1 min cooldown on scale up and
                15 min of low utilization data required to scale down. Idle
                agent reasoning runs at the bottom tier. A{" "}
                <code className="font-mono-brand text-[14px]">cargo build</code>{" "}
                or{" "}
                <code className="font-mono-brand text-[14px]">npm install</code>{" "}
                triggers a scale-up; it drops back when the work is done. The
                harness lives inside throughout, and it just rides the resize!
              </li>
              <li>
                For workloads that know their own shape better than the
                autoscaler can infer, there&apos;s an in-VM scaling API at{" "}
                <code className="font-mono-brand text-[14px]">
                  169.254.169.254
                </code>{" "}
                so the agent can scale itself up <em>before</em> a known heavy
                step and back down after. We think this is especially valuable
                in an era where agents are becoming more ambitious and have more
                autonomy.
              </li>
            </ul>

            <DiagramPanel
              eyebrow="Lifecycle"
              title="A live sandbox can be paused, resized, and resumed in place"
            >
              <div className="space-y-2">
                <HibernationStep
                  number="1"
                  title="Hibernate idle sandboxes to disk"
                  badge="~25ms resume"
                  detail="The entire VM, process tree, in-memory state, file handles, the loop itself, is frozen and resumable in roughly 25 milliseconds. While hibernated you bill for snapshot storage, not compute. CI waits, LLM round trips, and multi-minute thinking stretches all happen while the sandbox is essentially off."
                />
                <FlowConnector />
                <HibernationStep
                  number="2"
                  title="Elastic resize between 1 GB and 16 GB"
                  badge="autoscale"
                  detail="The live VM scales between 1 GB / 1 vCPU and 16 GB / 4 vCPU based on observed memory pressure, with a 1 minute cooldown on scale up and 15 minutes of low utilization data required to scale down. Idle agent reasoning runs at the bottom tier. A cargo build or npm install triggers a scale up, then drops back when the work is done. The harness rides the resize."
                />
                <FlowConnector />
                <HibernationStep
                  number="3"
                  title="In-VM scaling API for agents that know their shape"
                  badge="169.254.169.254"
                  detail="For workloads that know their own shape better than the autoscaler can infer, an in-VM scaling API at 169.254.169.254 lets the agent scale itself up before a known heavy step and back down after. This matters more as agents become more ambitious and operate with more autonomy."
                />
              </div>
            </DiagramPanel>

            <DiagramPanel
              eyebrow="Resource profile"
              title="An agent session, hour by hour"
            >
              <p className="font-mono-brand text-[10px] text-muted-foreground">
                Long idle stretches at 1 GB. Brief bursts to 16 GB for builds
                and installs.
              </p>
              <div className="mt-5 mb-3 flex h-[120px] items-end gap-[3px]">
                {[
                  { h: "12%", active: false },
                  { h: "12%", active: false },
                  { h: "0%", active: false, hibernated: true },
                  { h: "0%", active: false, hibernated: true },
                  { h: "0%", active: false, hibernated: true },
                  { h: "12%", active: false },
                  { h: "15%", active: false },
                  { h: "12%", active: false },
                  { h: "85%", active: true },
                  { h: "98%", active: true },
                  { h: "100%", active: true },
                  { h: "75%", active: true },
                  { h: "15%", active: false },
                  { h: "12%", active: false },
                  { h: "0%", active: false, hibernated: true },
                  { h: "0%", active: false, hibernated: true },
                  { h: "12%", active: false },
                  { h: "15%", active: false },
                  { h: "85%", active: true },
                  { h: "12%", active: false },
                ].map((bar, i) => (
                  <div
                    key={i}
                    className={`flex-1 rounded-t-sm transition-all ${
                      bar.active
                        ? "bg-foreground"
                        : bar.hibernated
                        ? "border-b-[2px] border-dashed border-[hsl(0,0%,70%)] bg-transparent"
                        : "bg-[hsl(0,0%,80%)]"
                    }`}
                    style={{ height: bar.h === "0%" ? "4px" : bar.h }}
                  />
                ))}
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <div className="h-3 w-3 rounded-sm bg-[hsl(0,0%,80%)]" />
                    <span className="font-mono-brand text-[10px] text-muted-foreground">
                      1 GB idle
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="h-3 w-3 rounded-sm bg-foreground" />
                    <span className="font-mono-brand text-[10px] text-muted-foreground">
                      16 GB burst
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="h-3 w-3 rounded-sm border-b-[2px] border-dashed border-[hsl(0,0%,55%)]" />
                    <span className="font-mono-brand text-[10px] text-muted-foreground">
                      hibernated, snapshot storage only
                    </span>
                  </div>
                </div>
              </div>
            </DiagramPanel>
          </div>
        </section>
      </FadeIn>

      <FadeIn>
        <div className="my-10 h-px w-12 bg-border" />
      </FadeIn>

      {/* ==================== REBUTTAL 3 ==================== */}
      <FadeIn>
        <section className="space-y-6">
          <p className="font-mono-brand text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
            Rebuttal 3 of 3
          </p>

          <Quote source="https://www.mendral.com/blog/agent-harness-belongs-outside-sandbox">
            Sandboxes become cattle. If one dies mid-session, the loop
            provisions a new one and keeps going. When the harness runs inside,
            the sandbox is the session, and losing it loses the session.
          </Quote>

          <div className="space-y-7 text-[17px] leading-[1.75] tracking-[-0.1px]">
            <p>
              This is also a real concern, no one wants to lose a multi hour
              session because a host went down ofc.
            </p>
            <p>
              But this ALSO isn&apos;t an argument about where the harness runs.
              It&apos;s an argument about whether your sandbox primitive has
              &ldquo;durability&rdquo; built into it.
            </p>
            <p>
              &ldquo;Cattle vs pets&rdquo; offers two options and asks you to
              pick one. There&apos;s a third, and we think of it as git
              branches for VMs. With{" "}
              <a
                href="https://opencomputer.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-foreground/30 hover:decoration-foreground transition-colors"
              >
                Opencomputer.dev
              </a>
              :
            </p>

            <DiagramPanel
              eyebrow="Three options"
              title="Pets, cattle, and git branches for VMs"
            >
              <div className="grid gap-3 md:grid-cols-3">
                <OptionColumn
                  title="Pets"
                  subtitle="hand fed, irreplaceable"
                  items={[
                    "single host failure loses the session",
                    "no story for planned restarts",
                    "ops cost grows linearly with sessions",
                  ]}
                />
                <OptionColumn
                  title="Cattle"
                  subtitle="ephemeral, restart anywhere"
                  items={[
                    "harness must live outside to survive",
                    "session state lives in the orchestrator",
                    "every recovery is a cold start",
                  ]}
                />
                <OptionColumn
                  title="Git branches for VMs"
                  subtitle="the third option"
                  accent
                  items={[
                    "hibernate to survive planned restarts",
                    "checkpoint to recover from hard failures",
                    "fork to explore alternatives in parallel",
                  ]}
                />
              </div>
            </DiagramPanel>

            <ul className="list-disc space-y-2 pl-6">
              <li>
                Hibernation freezes the entire VM (process tree, in-memory
                state, file handles, the loop itself) and resumes it in ~25ms.
                Rolling deploys, scale events, restarts that are planned etc.
                all survivable. The loop kinda doesn&apos;t notice anything
                happened.
              </li>
              <li>
                For unexpected stuff,{" "}
                <a
                  href="https://docs.opencomputer.dev/sandboxes/checkpoints"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline decoration-foreground/30 hover:decoration-foreground transition-colors"
                >
                  Checkpoints
                </a>{" "}
                snapshot filesystem and installed state at any point in the
                session, and you can have up to 10 of them per sandbox. If a
                sandbox dies hard (host failure, kernel panic) you fork a fresh
                sandbox from the most recent checkpoint and resume. The harness
                re-reads on disk state ie. conversation history, planning state,
                todo list, the same way Claude Code does after you close your
                laptop and open it back up.
              </li>
              <li>
                Also forks aren&apos;t just for recovery. You can branch from
                any checkpoint to explore alternative paths in parallel: three
                migration strategies, two debugging hypotheses, two different
                refactors, without paying to bootstrap each one from scratch.
                The original keeps running.
              </li>
            </ul>

            <p>
              All this to say that losing a sandbox isn&apos;t losing the
              session.
            </p>

            <Callout>
              It&apos;s restoring from a snapshot, the same coordination
              primitive every production database has used for the last forty
              years!
            </Callout>

            <p>
              The original article spends a whole section on durable execution:
              agent loops are long running, have to survive deploys, and Mendral
              solved it with{" "}
              <a
                href="https://www.inngest.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-foreground/30 hover:decoration-foreground transition-colors"
              >
                Inngest
              </a>{" "}
              checkpointing each turn as a step. That&apos;s durable execution
              infrastructure they had to build because the loop lives on the
              backend. With the agent running inside a computer + checkpoints,
              the sandbox is the unit of durability ie. the entire compute
              environment, which means it isn&apos;t a function call. Inngest
              is a great tool, but the problem it&apos;s solving here
              doesn&apos;t exist if the sandbox is the host.
            </p>
          </div>
        </section>
      </FadeIn>

      <FadeIn>
        <div className="my-10 h-px w-12 bg-border" />
      </FadeIn>

      {/* ==================== CONCLUSION ==================== */}
      <FadeIn>
        <section className="space-y-6">
          <div className="space-y-7 text-[17px] leading-[1.75] tracking-[-0.1px]">
            <p>
              Andrea&apos;s article isn&apos;t really &lsquo;the harness
              belongs outside the sandbox.&rsquo; It&apos;s &lsquo;the harness
              belongs outside an <em>ephemeral</em> sandbox.&rsquo; The thesis
              is sort of tautological once you state the assumption. Persistent
              sandboxes (ala computers) don&apos;t have these problems.
            </p>

            <DiagramPanel
              eyebrow="Reframe"
              title="What changes when the sandbox is the host"
            >
              <div className="grid gap-3 md:grid-cols-2">
                <OptionColumn
                  title="Ephemeral sandbox"
                  subtitle="harness must live outside"
                  items={[
                    "credentials live in the orchestrator",
                    "idle billing handled by not provisioning",
                    "durability handled by the backend loop",
                  ]}
                />
                <OptionColumn
                  title="Persistent sandbox"
                  subtitle="harness lives inside"
                  accent
                  items={[
                    "credentials live in the egress proxy",
                    "idle billing handled by hibernation",
                    "durability handled by checkpoints and forks",
                  ]}
                />
              </div>
            </DiagramPanel>

            <p>
              Between right and easy, users will always default to easy. And
              we are on a mission to make building agents as easy and
              delightful as possible!
            </p>
          </div>
        </section>
      </FadeIn>

      <FadeIn>
        <div className="my-10 h-px w-12 bg-border" />
      </FadeIn>

      <FadeIn>
        <section className="space-y-6">
          <h2 className="font-heading text-[28px] tracking-[-0.5px]">
            References
          </h2>
          <ul className="space-y-4 list-none pl-0 text-[17px] leading-[1.75] tracking-[-0.1px] text-muted-foreground">
            <li className="flex items-start gap-3">
              <span className="mt-1 flex-shrink-0 font-mono-brand text-[13px] text-muted-foreground">
                &rarr;
              </span>
              <a
                href="https://www.mendral.com/blog/agent-harness-belongs-outside-sandbox"
                target="_blank"
                rel="noopener noreferrer"
                className="underline transition-colors hover:text-foreground"
              >
                Andrea Luzzardi, Mendral &middot; The agent harness belongs
                outside the sandbox
              </a>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 flex-shrink-0 font-mono-brand text-[13px] text-muted-foreground">
                &rarr;
              </span>
              <a
                href="https://github.com/superfly/tokenizer"
                target="_blank"
                rel="noopener noreferrer"
                className="underline transition-colors hover:text-foreground"
              >
                Fly &middot; Tokenizer
              </a>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 flex-shrink-0 font-mono-brand text-[13px] text-muted-foreground">
                &rarr;
              </span>
              <a
                href="https://www.mitmproxy.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline transition-colors hover:text-foreground"
              >
                mitmproxy
              </a>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 flex-shrink-0 font-mono-brand text-[13px] text-muted-foreground">
                &rarr;
              </span>
              <a
                href="https://docs.opencomputer.dev/sandboxes/elasticity"
                target="_blank"
                rel="noopener noreferrer"
                className="underline transition-colors hover:text-foreground"
              >
                OpenComputer docs &middot; Elasticity
              </a>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 flex-shrink-0 font-mono-brand text-[13px] text-muted-foreground">
                &rarr;
              </span>
              <a
                href="https://docs.opencomputer.dev/sandboxes/checkpoints"
                target="_blank"
                rel="noopener noreferrer"
                className="underline transition-colors hover:text-foreground"
              >
                OpenComputer docs &middot; Checkpoints
              </a>
            </li>
          </ul>
        </section>
      </FadeIn>
    </SitePageLayout>
  );
};

export default StopTreatingSandboxesAsCattle;
