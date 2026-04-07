import { Link } from "react-router-dom";
import { agentHybridSandboxScene } from "@/animations/scenes/agent-hybrid-sandbox";
import { agentInsideSandboxScene } from "@/animations/scenes/agent-inside-sandbox";
import { agentOutsideSandboxScene } from "@/animations/scenes/agent-outside-sandbox";
import { ephemeralSessionsScene } from "@/animations/scenes/ephemeral-sessions";
import { hybridSessionsScene } from "@/animations/scenes/hybrid-sessions";
import { longRunningSessionsScene } from "@/animations/scenes/long-running-sessions";
import { singleContainerScene } from "@/animations/scenes/single-container";
import AgentPlacementComparison from "@/components/architecture/AgentPlacementComparison";
import SceneEmbed from "@/components/architecture/SceneEmbed";
import FadeIn from "@/components/FadeIn";
import ShikiCodeBlock from "@/components/ShikiCodeBlock";
import SitePageLayout from "@/components/SitePageLayout";
import SEO from "@/components/SEO";

const Callout = ({ children }: { children: React.ReactNode }) => (
  <div className="my-8 border-l-[3px] border-foreground/80 py-1 pl-5">
    <p className="font-heading text-[19px] leading-[1.65] tracking-[-0.2px] italic text-foreground/85">
      {children}
    </p>
  </div>
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
      <p className="font-mono-brand text-[11px] uppercase tracking-[0.16em] text-muted-foreground">{eyebrow}</p>
      <p className="mt-1 font-heading text-[20px] tracking-[-0.3px] text-foreground">{title}</p>
    </div>
    <div className="p-5 md:p-6">{children}</div>
  </div>
);

const IsolationLayer = ({
  name,
  detail,
  accent,
}: {
  name: string;
  detail: string;
  accent?: boolean;
}) => (
  <div
    className={`rounded-xl border px-5 py-4 ${accent
      ? "border-foreground bg-foreground text-background"
      : "border-border/80 bg-[hsl(0,0%,98.5%)] text-foreground"
      }`}
  >
    <p className={`font-mono-brand text-[13px] uppercase tracking-[0.12em] ${accent ? "text-background/70" : "text-muted-foreground"}`}>
      Layer
    </p>
    <p className="mt-1 font-heading text-[22px] tracking-[-0.4px]">{name}</p>
    <p className={`mt-2 text-[14px] leading-[1.6] ${accent ? "text-background/78" : "text-muted-foreground"}`}>{detail}</p>
  </div>
);

const CLAUDE_SANDBOX_POLICY = `{
  "sandbox": {
    "enabled": true,
    "filesystem": {
      "allowWrite": ["/tmp/build"],
      "denyRead": ["~/.aws/credentials"]
    },
    "network": {
      "allowedDomains": ["github.com", "*.npmjs.org"]
    }
  }
}`;

const ExecutionComparison = ({
  rows,
}: {
  rows: Array<{ label: string; container: string; vm: string }>;
}) => (
  <>
    <div className="overflow-hidden rounded-lg border border-border/70 bg-white md:hidden">
      {rows.map((row) => (
        <div key={row.label} className="border-b border-border/50 p-3 last:border-b-0">
          <p className="font-mono-brand text-[10px] uppercase tracking-[0.08em] text-muted-foreground">{row.label}</p>
          <div className="mt-2 space-y-2">
            <div className="rounded-md border border-border/60 bg-[hsl(0,0%,98.5%)] px-3 py-2">
              <p className="font-mono-brand text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Container profile</p>
              <p className="mt-1 text-[13px] leading-[1.55] text-foreground/80">{row.container}</p>
            </div>
            <div className="rounded-md border border-border/60 bg-[hsl(0,0%,98.5%)] px-3 py-2">
              <p className="font-mono-brand text-[10px] uppercase tracking-[0.14em] text-muted-foreground">VM profile</p>
              <p className="mt-1 text-[13px] leading-[1.55] text-foreground/80">{row.vm}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
    <div className="hidden overflow-hidden rounded-lg border border-border/70 bg-white md:block">
      <div className="grid grid-cols-[110px_1fr_1fr] border-b border-border/70 bg-[hsl(0,0%,97.5%)]">
        <div className="px-3 py-2" />
        <p className="border-l border-border/70 px-3 py-2 font-mono-brand text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Container profile</p>
        <p className="border-l border-border/70 px-3 py-2 font-mono-brand text-[10px] uppercase tracking-[0.14em] text-muted-foreground">VM profile</p>
      </div>
      {rows.map((row) => (
        <div key={row.label} className="grid grid-cols-[110px_1fr_1fr] border-b border-border/50 last:border-b-0">
          <p className="px-3 py-3 font-mono-brand text-[10px] uppercase tracking-[0.08em] text-muted-foreground">{row.label}</p>
          <p className="border-l border-border/50 px-3 py-3 text-[13px] leading-[1.55] text-foreground/80">{row.container}</p>
          <p className="border-l border-border/50 px-3 py-3 text-[13px] leading-[1.55] text-foreground/80">{row.vm}</p>
        </div>
      ))}
    </div>
  </>
);

const TokenCard = ({
  title,
  lines,
  tone = "neutral",
}: {
  title: string;
  lines: string[];
  tone?: "neutral" | "accent";
}) => (
  <div
    className={`rounded-xl border px-4 py-4 ${tone === "accent"
      ? "border-foreground bg-foreground text-background"
      : "border-border/80 bg-[hsl(0,0%,98.5%)] text-foreground"
      }`}
  >
    <p className={`font-heading text-[18px] tracking-[-0.3px] ${tone === "accent" ? "text-background" : "text-foreground"}`}>{title}</p>
    <div className="mt-3 space-y-2">
      {lines.map((line) => (
        <div key={line} className="flex items-start gap-2">
          <span className={`mt-[6px] h-1.5 w-1.5 rounded-full ${tone === "accent" ? "bg-background/70" : "bg-foreground/70"}`} />
          <p className={`font-mono-brand text-[11px] leading-[1.6] ${tone === "accent" ? "text-background/72" : "text-muted-foreground"}`}>{line}</p>
        </div>
      ))}
    </div>
  </div>
);

const LoopStep = ({
  number,
  title,
  detail,
}: {
  number: string;
  title: string;
  detail: string;
}) => (
  <div className="rounded-xl border border-border/80 bg-[hsl(0,0%,98.5%)] px-4 py-4">
    <div className="flex items-center gap-3">
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-foreground font-mono-brand text-[11px] text-background">
        {number}
      </span>
      <p className="font-heading text-[18px] tracking-[-0.3px] text-foreground">{title}</p>
    </div>
    <p className="mt-3 text-[14px] leading-[1.65] text-muted-foreground">{detail}</p>
  </div>
);

const FlowConnector = () => (
  <div className="flex h-4 justify-center">
    <div className="flex flex-col items-center">
      <span className="h-2 w-px bg-border" />
      <span className="font-mono-brand text-[13px] leading-none text-muted-foreground">↓</span>
    </div>
  </div>
);

const LatencyCard = ({
  title,
  detail,
  badge,
  accent = false,
}: {
  title: string;
  detail: string;
  badge: string;
  accent?: boolean;
}) => (
  <div
    className={`rounded-xl border px-4 py-4 ${accent
      ? "border-foreground/15 bg-foreground text-background"
      : "border-border/80 bg-[hsl(0,0%,98.5%)] text-foreground"
      }`}
  >
    <div className="flex items-center justify-between gap-3">
      <p className={`font-heading text-[18px] tracking-[-0.3px] ${accent ? "text-background" : "text-foreground"}`}>{title}</p>
      <span
        className={`rounded-full px-2 py-1 font-mono-brand text-[10px] uppercase tracking-[0.12em] ${accent ? "bg-background/12 text-background/72" : "bg-white text-muted-foreground"
          }`}
      >
        {badge}
      </span>
    </div>
    <p className={`mt-3 text-[14px] leading-[1.65] ${accent ? "text-background/76" : "text-muted-foreground"}`}>{detail}</p>
  </div>
);

const ComplexityColumn = ({
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
    className={`rounded-xl border px-4 py-4 ${accent
      ? "border-[hsl(140,35%,42%)] bg-[hsl(138,35%,93%)] text-[hsl(140,28%,20%)]"
      : "border-border/80 bg-[hsl(0,0%,98.5%)] text-foreground"
      }`}
  >
    <p className={`font-heading text-[18px] tracking-[-0.3px] ${accent ? "text-[hsl(140,28%,20%)]" : "text-foreground"}`}>{title}</p>
    <p className={`mt-1 font-mono-brand text-[11px] uppercase tracking-[0.14em] ${accent ? "text-[hsl(140,20%,38%)]" : "text-muted-foreground"}`}>{subtitle}</p>
    <div className="mt-3 space-y-2">
      {items.map((item) => (
        <div
          key={item}
          className={`rounded-lg px-3 py-2 font-mono-brand text-[11px] leading-[1.5] ${accent ? "bg-[hsl(0,0%,100%)]/65 text-[hsl(140,20%,30%)]" : "bg-white text-[hsl(0,0%,42%)]"
            }`}
        >
          {item}
        </div>
      ))}
    </div>
  </div>
);

const WhereShouldTheAgentLive = () => {
  return (
    <SitePageLayout activeSection="blog" contentAs="article">
      <SEO
        title="Where Should the Agent(s) Live?"
        description="Isolation models, agent placement tradeoffs, credential design, and sandbox lifecycle patterns for agentic systems."
        author="Utpal Nadiger, Mohamed Habib, Igor Zalutski"
        path="/blog/where-should-the-agent-live"
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
          Where Should the Agent(s) Live?
        </h1>
      </FadeIn>

      <FadeIn delay={0.08}>
        <p className="mb-10 font-mono-brand text-[13px] text-muted-foreground">
          Utpal Nadiger, Mohamed Habib, Igor Zalutski &middot; March 20, 2026
        </p>
      </FadeIn>

      <FadeIn delay={0.12}>
        <div className="space-y-7">
          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            In <Link to="/blog/the-agentic-workload" className="underline transition-colors hover:text-muted-foreground">The Agentic Workload</Link>, we explained why software agent workloads are fundamentally different from traditional applications. Agents introduce a new set of deployment needs and constraints, and this post explores those constraints and what they mean for designing agentic systems.
          </p>
          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            The ideas here apply broadly, but they matter most for platforms that give end users direct access to generative AI capabilities, like <a href="https://lovable.dev" target="_blank" rel="noreferrer" className="underline transition-colors hover:text-muted-foreground">Lovable</a> or <a href="https://bolt.new" target="_blank" rel="noreferrer" className="underline transition-colors hover:text-muted-foreground">Bolt</a>, where untrusted input can reach the agent. Internal background agents often operate under a more trusted user model, but many of the same isolation and placement tradeoffs still come up.
          </p>
          <div className="space-y-4 rounded-lg border border-border/70 bg-[hsl(0,0%,98%)] p-6">
            <p className="font-mono-brand text-[12px] uppercase tracking-[0.15em] text-muted-foreground">
              We will explore a few core questions
            </p>
            <ol className="list-decimal list-inside space-y-2 pl-2 text-[17px] leading-[1.75] tracking-[-0.1px]">
              <li>What should the isolation model look like?</li>
              <li>Should the agent be separated from the tool-call environment?</li>
              <li>What state should persist inside the compute environment?</li>
              <li>How should the platform trade off speed, safety, and cost?</li>
            </ol>
          </div>
        </div>
      </FadeIn>

      <FadeIn>
        <div className="my-10 h-px w-12 bg-border" />
      </FadeIn>

      <FadeIn>
        <section className="space-y-6">
          <h2 className="font-heading text-[clamp(28px,4vw,38px)] leading-[1.35] tracking-[-0.8px]">Security</h2>
          <div className="space-y-7 text-[17px] leading-[1.75] tracking-[-0.1px]">
            <p>
              The broad access that makes agents so powerful also makes them dangerous. For many applications, agents need filesystem access, process control, network access, and the ability to generate and execute arbitrary code.
            </p>
            <p>
              Isolation usually happens in two layers: an OS sandbox around the agent process itself, and a stronger execution boundary around the whole environment it operates in. Anthropic&apos;s <a href="https://code.claude.com/docs/en/sandboxing#how-it-works" target="_blank" rel="noreferrer" className="underline transition-colors hover:text-muted-foreground">sandboxing guidance</a> and <a href="https://developers.openai.com/codex/agent-approvals-security/#os-level-sandbox" target="_blank" rel="noreferrer" className="underline transition-colors hover:text-muted-foreground">OpenAI&apos;s Codex docs</a> are useful references for the first layer; <a href="https://www.luiscardoso.dev/blog/sandboxes-for-ai" target="_blank" rel="noreferrer" className="underline transition-colors hover:text-muted-foreground">Luis Cardoso</a>, <a href="https://pierce.dev/notes/a-deep-dive-on-agent-sandboxes" target="_blank" rel="noreferrer" className="underline transition-colors hover:text-muted-foreground">Pierce Freeman</a>, and our <a href="http://localhost:8080/blog/sandbox-fingerprinting#isolation-categories" className="underline transition-colors hover:text-muted-foreground">Sandbox Fingerprinting</a> writeup are good references for the second.
            </p>
            <DiagramPanel eyebrow="Security model" title="Isolation works in layers">
              <div className="space-y-3">
                <div className="rounded-xl border border-border/80 bg-[hsl(0,0%,98.5%)] px-5 py-4 text-foreground">
                  <p className="font-mono-brand text-[13px] uppercase tracking-[0.12em] text-muted-foreground">
                    Layer
                  </p>
                  <p className="mt-1 font-heading text-[22px] tracking-[-0.4px]">OS sandbox</p>
                  <p className="mt-2 text-[14px] leading-[1.6] text-muted-foreground">
                    Constrains the agent process itself with filesystem, process, and network boundaries.
                  </p>
                  <div className="mt-4 rounded-lg border border-border/70 bg-white p-3">
                    <p className="font-mono-brand text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Example: Claude Code policy</p>
                    <ShikiCodeBlock code={CLAUDE_SANDBOX_POLICY} language="json" className="mt-2" />
                    <p className="mt-2 text-[13px] leading-[1.6] text-muted-foreground">
                      This example uses Claude Code&apos;s sandbox settings, but other agent tools expose similar OS-level controls. Here, the policy allows writes to `/tmp/build`, blocks reads from local AWS credentials, and limits outbound access to a small domain allowlist.
                    </p>
                  </div>
                </div>
                <div className="rounded-xl border border-border/80 bg-[hsl(0,0%,98.5%)] px-5 py-4 text-foreground">
                  <p className="font-mono-brand text-[13px] uppercase tracking-[0.12em] text-muted-foreground">
                    Layer
                  </p>
                  <p className="mt-1 font-heading text-[22px] tracking-[-0.4px]">Execution environment</p>
                  <p className="mt-2 text-[14px] leading-[1.6] text-muted-foreground">
                    Container or VM isolation defines the boundary around the whole computer the agent operates in.
                  </p>
                  <div className="mt-4">
                    <ExecutionComparison
                      rows={[
                        {
                          label: "Kernel",
                          container: "Shared with the host.",
                          vm: "Separate guest kernel and a stronger isolation boundary.",
                        },
                        {
                          label: "Filesystem",
                          container: "Mounted workspace plus a small writable scratch area.",
                          vm: "Full guest filesystem that behaves more like a real machine.",
                        },
                        {
                          label: "Network",
                          container: "Optional and policy-controlled, often narrowed or disabled entirely.",
                          vm: "Optional and policy-controlled at the machine boundary.",
                        },
                        {
                          label: "Tooling",
                          container: "Good for packaged environments, but some developer setups need extra work.",
                          vm: "Usually closer to \"just works\" for broad developer tooling.",
                        },
                        {
                          label: "Nested containers",
                          container: "Possible, but often awkward without extra privileges or indirection.",
                          vm: "Typically more natural for Docker-style inner workflows.",
                        },
                      ]}
                    />
                  </div>
                </div>
              </div>
            </DiagramPanel>
            <Callout>
              Use both layers together: OS sandboxing limits what the agent process can do, while the execution boundary provides another layer of defense and contains the full machine-level blast radius.
            </Callout>
          </div>
        </section>
      </FadeIn>

      <FadeIn>
        <section className="mt-12 space-y-6">
          <h3 className="font-heading text-[22px] tracking-[-0.4px]">Aside: Credentials</h3>
          <div className="space-y-7 text-[17px] leading-[1.75] tracking-[-0.1px]">
            <p>
              Even with strong isolation, agents still need a safe way to access external services.

              At a minimum, the agent needs to authenticate to the model provider, so it is important to design the system to minimize blast radius if that environment is compromised. Prompt injection, policy bypass attempts, and the simple fact that the agent can execute arbitrary code all push in the same direction: assume the environment may eventually be coerced into trying to exfiltrate whatever credentials it can reach.
            </p>
            <p>
              A common answer is to give the sandbox only a short-lived session token and route privileged operations through a proxy or control plane. <a href="https://browser-use.com/posts/two-ways-to-sandbox-agents" target="_blank" rel="noreferrer" className="underline transition-colors hover:text-muted-foreground">Browser Use</a> pushes this idea further with what they call a &quot;zero-secret sandbox&quot; approach: the agent inside the sandbox holds no credentials at all, and every privileged operation, including model inference, is routed through an external control plane that owns the secrets on the agent&apos;s behalf.
            </p>
            <DiagramPanel eyebrow="Credentials" title="Token design goals">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { number: "1", label: "Short-lived", text: "If leaked, the token expires quickly." },
                  { number: "2", label: "Session-bound", text: "A stolen token only works for one environment." },
                  { number: "3", label: "Scoped", text: "Usage stays attributable to the right user or org." },
                  { number: "4", label: "Revocable", text: "The control plane can kill a token immediately if a session looks compromised." },
                ].map((item) => (
                  <div key={item.label} className="rounded-lg bg-[hsl(0,0%,98.5%)] px-3 py-3">
                    <div className="flex items-center gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-foreground font-mono-brand text-[10px] text-background">
                        {item.number}
                      </span>
                      <p className="font-mono-brand text-[11px] uppercase tracking-[0.15em] text-muted-foreground">{item.label}</p>
                    </div>
                    <p className="mt-2 text-[14px] leading-[1.65] text-muted-foreground">{item.text}</p>
                  </div>
                ))}
              </div>
              <div className="mt-5 rounded-xl border border-dashed border-border/80 bg-[hsl(0,0%,99.2%)] px-4 py-4">
                <p className="font-mono-brand text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
                  Proxy flow
                </p>
                <div className="mt-3 grid gap-4 lg:grid-cols-[0.95fr_auto_1.05fr_auto_1fr] lg:items-stretch">
                  <TokenCard
                    title="Sandbox agent"
                    lines={[
                      "gets per-session token",
                      "cannot see provider secret",
                      "token bound to user or org",
                    ]}
                  />
                  <div className="flex items-center justify-center py-1 lg:py-0">
                    <span className="font-mono-brand text-[18px] text-muted-foreground lg:inline hidden">→</span>
                    <span className="font-mono-brand text-[18px] text-muted-foreground lg:hidden">↓</span>
                  </div>
                  <TokenCard
                    title="Auth proxy"
                    lines={[
                      "validates short TTL",
                      "checks session scope",
                      "applies attribution + limits",
                    ]}
                  />
                  <div className="flex items-center justify-center py-1 lg:py-0">
                    <span className="font-mono-brand text-[18px] text-muted-foreground lg:inline hidden">→</span>
                    <span className="font-mono-brand text-[18px] text-muted-foreground lg:hidden">↓</span>
                  </div>
                  <TokenCard
                    title="Model provider"
                    lines={[
                      "receives proxied request",
                      "uses platform-owned credential",
                      "never exposes root key to agent",
                    ]}
                  />
                </div>
              </div>
            </DiagramPanel>
          </div>
        </section>
      </FadeIn>

      <FadeIn>
        <section className="mt-14 space-y-6">
          <h2 className="font-heading text-[clamp(28px,4vw,38px)] leading-[1.35] tracking-[-0.8px]">Agent Placement</h2>
          <div className="space-y-7 text-[17px] leading-[1.75] tracking-[-0.1px]">
            <p>
              Once isolation is a given, the next design choice is where the agent should live relative to the environment where code actually executes. Should the agent run inside the same isolated computer where it reads files, installs dependencies, and executes commands? Or should it remain outside that environment and send tool calls across the boundary into a separate execution target?
            </p>
            <p>
              That distinction turns out to matter a lot. It affects latency, security boundaries, state management, and how naturally the environment behaves like a real computer. The biggest performance question is whether repeated tool calls have to cross the sandbox boundary over and over again, or whether they can execute locally alongside the agent.
            </p>
            <h3 className="font-heading text-[22px] tracking-[-0.4px]">The Basic Agent Loop</h3>
            <p>
              Before getting into the specific placement models, it helps to define the basic loop most coding agents follow:
            </p>
            <DiagramPanel eyebrow="Core loop" title="The agent alternates between reasoning and execution">
              <div className="space-y-2">
                <LoopStep
                  number="1"
                  title="Agent to model"
                  detail="The agent sends task state, context, and prior tool results to decide what should happen next."
                />
                <FlowConnector />
                <LoopStep
                  number="2"
                  title="Model back to agent"
                  detail="The model returns a plan, a tool call, or a partial response for the agent to interpret."
                />
                <FlowConnector />
                <LoopStep
                  number="3"
                  title="Agent to tool"
                  detail="The agent invokes a tool like filesystem access, shell execution, package install, tests, or an external API."
                />
                <FlowConnector />
                <LoopStep
                  number="4"
                  title="Tool back to agent"
                  detail="The tool returns output, side effects, or errors, and that result becomes new working context."
                />
              </div>
              <div className="py-1">
                <FlowConnector />
              </div>
              <LoopStep
                number="5"
                title="Back to the model"
                detail="The updated state goes back into the next model call, and the loop repeats until the task is complete."
              />
              <div className="flex items-center justify-center gap-2 pt-3">
                <span className="font-mono-brand text-[18px] text-muted-foreground">↺</span>
                <p className="font-mono-brand text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
                  back to step 1
                </p>
              </div>
            </DiagramPanel>
            <p>
              There are four main sources of time in that loop:
            </p>
            <DiagramPanel eyebrow="Latency + runtime" title="Four sources of time accumulate in every loop">
              <div className="grid gap-3 md:grid-cols-2">
                <LatencyCard
                  title="Model network latency"
                  badge="network"
                  detail="Network latency to the model provider on each request and response."
                />
                <LatencyCard
                  title="Agent-sandbox hop latency"
                  badge="network"
                  detail="Network latency between the agent and sandbox when the tool-call environment is separated."
                />
                <LatencyCard
                  title="Model runtime"
                  badge="compute"
                  detail="Time the model spends producing the next action, plan, or response."
                />
                <LatencyCard
                  title="Tool runtime"
                  badge="compute"
                  detail="Time spent actually running commands, editing files, installing dependencies, or running tests."
                />
              </div>
            </DiagramPanel>
            <p>
              Agent placement mostly changes what happens around tool calls. Local tools add little overhead beyond the work itself; remote tools add another network hop each time. On real tasks, that compounds quickly across dozens of loops, which is why agent placement is a performance decision as much as a security one.
            </p>
            <p>
              The agent can live outside the sandbox, inside it, or in a hybrid setup.
            </p>
          </div>
        </section>
      </FadeIn>

      <FadeIn>
        <div className="mt-8 space-y-10">
          <section className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-heading text-[22px] tracking-[-0.4px]">1/ Agent outside the sandbox</h3>
              <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
                In this model, the agent lives in its own environment and reaches across the sandbox boundary whenever it needs to execute tools or touch the filesystem. This keeps orchestration separate, but every tool call pays the cost of crossing that boundary.
              </p>
              <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
                The security upside is that durable credentials, orchestration logic, and conversation state can stay outside the sandbox. That reduces blast radius, but it does not make the system immune to prompt injection: a manipulated agent can still abuse whatever bridges and permissions the control plane exposes.
              </p>
            </div>
            <SceneEmbed scene={agentOutsideSandboxScene} />
          </section>

          <section className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-heading text-[22px] tracking-[-0.4px]">2/ Agent inside the sandbox</h3>
              <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
                Here, the agent is co-located with the tool and filesystem environment. Tool calls stay local, which removes the repeated sandbox round-trip penalty, but it also means the agent itself lives inside the stronger isolation boundary.
              </p>
              <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
                This shrinks the gap between reasoning and execution, but it also means a compromised agent sits next to the same files and tools it is using. This pattern works best with a zero-trust posture toward the sandbox itself: even inside the isolation boundary, the agent should not be assumed trustworthy enough to hold durable secrets.
              </p>
            </div>
            <SceneEmbed scene={agentInsideSandboxScene} />
          </section>

          <section className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-heading text-[22px] tracking-[-0.4px]">3/ Hybrid placement</h3>
              <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
                A hybrid model keeps safe, common tool calls close to the agent while routing risky actions into a sandboxed execution target. This preserves much of the latency benefit of co-location without giving every capability the same trust boundary.
              </p>
              <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
                Here, &quot;safe&quot; means low-blast-radius operations such as workspace file access or routine local commands. &quot;Risky&quot; means actions that cross trust boundaries, such as networked installs, privileged system access, or anything that could expose secrets or affect external systems. For example, reading and writing project files might execute locally alongside the agent, while dependency installs and arbitrary code execution get routed into the sandboxed environment where network access and process execution are more tightly controlled.
              </p>
            </div>
            <SceneEmbed scene={agentHybridSandboxScene} />
          </section>
        </div>
      </FadeIn>

      <FadeIn>
        <div className="my-10 h-px w-12 bg-border" />
      </FadeIn>

      <FadeIn>
        <section id="head-to-head-comparison" className="space-y-6">
          <h2 className="font-heading text-[clamp(28px,4vw,38px)] leading-[1.35] tracking-[-0.8px]">Head-to-Head Comparison</h2>
          <div className="space-y-7 text-[17px] leading-[1.75] tracking-[-0.1px]">
            <h3 className="font-heading text-[22px] tracking-[-0.4px]">Speed and Latency</h3>
            <p>
              The effect of these placement decisions becomes clearer when the task is held constant and only the system design varies. The interactive comparison below runs the same workload across all three placement models. The latency assumptions are adjustable, so it is possible to see how placement alone changes execution behavior and total task completion time.
            </p>
          </div>
          <AgentPlacementComparison />
          <div className="space-y-7 text-[17px] leading-[1.75] tracking-[-0.1px]">
            <h3 className="font-heading text-[22px] tracking-[-0.4px]">Security Boundaries</h3>
            <p>
              The broader security model does not change, but the risk concentrates in different places depending on where the agent runs. On the surface, placing the agent outside the sandbox is the safest default, hybrid sits in the middle, and placing the agent inside is the riskiest if the question is simply what a compromised agent can touch directly. This is because an agent that can execute arbitrary code from within the environment is also closer to the files, tools, networked systems, and credentials that exist there.
            </p>
            <p>
              In practice, though, that ordering does not materially change the security posture you need to design for. The attack surfaces differ across the three patterns, but all of them still need strong environment isolation and strong secret isolation, especially because prompt injection has the potential to be routed through whatever tools and permissions the system exposes.
            </p>
            <h3 className="font-heading text-[22px] tracking-[-0.4px]">System Complexity</h3>
            <p>
              Latency is only part of the tradeoff. Every additional execution boundary also increases operational complexity.
            </p>
            <p>
              Once the agent, the safe tool environment, and the sandboxed tool environment are no longer the same place, logs, traces, credentials, filesystem state, and failures are spread across multiple systems. That makes reproduction and debugging much harder, even if the latency cost is acceptable.
            </p>
            <DiagramPanel eyebrow="Operational cost" title="Each boundary adds another thing to track">
              <div className="grid gap-3 md:grid-cols-3">
                <ComplexityColumn
                  title="Agent outside"
                  subtitle="more bridges"
                  items={[
                    "credentials + conversation stay in control plane",
                    "tool calls cross into sandbox",
                    "debugging spans multiple environments",
                  ]}
                />
                <ComplexityColumn
                  title="Agent inside"
                  subtitle="fewest boundaries"
                  accent
                  items={[
                    "agent and tools share one environment",
                    "less file movement and proxy glue",
                    "fewer places for state to drift",
                  ]}
                />
                <ComplexityColumn
                  title="Hybrid"
                  subtitle="most moving parts"
                  items={[
                    "router decides safe vs risky tools",
                    "state must stay coherent across environments",
                    "misclassification becomes a failure mode",
                  ]}
                />
              </div>
            </DiagramPanel>

          </div>
          <div className="mt-4 border-t border-border/70 pt-4">
            <p className="font-mono-brand text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
              Across all three comparisons
            </p>
            <Callout>
              Taking speed, security boundaries, and system complexity together, we favor placing the agent inside the isolated compute environment where it will actually execute code. It is usually the fastest and simplest approach, and it does not materially change the security posture as long as the sandbox is strongly isolated, treated as untrusted, and durable credentials stay outside it.
            </Callout>
          </div>
        </section>
      </FadeIn>

      <FadeIn>
        <div className="my-10 h-px w-12 bg-border" />
      </FadeIn>

      <FadeIn>
        <section className="space-y-6">
          <h2 className="font-heading text-[clamp(28px,4vw,38px)] leading-[1.35] tracking-[-0.8px]">Sandbox Lifecycle Patterns</h2>
          <div className="space-y-7 text-[17px] leading-[1.75] tracking-[-0.1px]">
            <p>
              Beyond securing the isolated environment and deciding where to place the agent, there is still the question of how that environment should live over time. Anthropic&apos;s <a href="https://platform.claude.com/docs/en/agent-sdk/hosting" target="_blank" rel="noreferrer" className="underline transition-colors hover:text-muted-foreground">Agent SDK hosting guidance</a> and related docs on <a href="https://platform.claude.com/docs/en/agent-sdk/secure-deployment" target="_blank" rel="noreferrer" className="underline transition-colors hover:text-muted-foreground">secure deployment</a> lay out a useful set of patterns here: ephemeral sessions, long-running sessions, hybrid sessions, and shared containers. These patterns describe how compute is created, how long it persists, and how state carries across work.
            </p>
            <p>
              The right choice depends on the shape of the workload. Some agents do one-shot work and can safely disappear when they are done. Others need to stay warm, preserve state, or serve a continuous stream of user and system events. The diagrams below make those differences concrete.
            </p>
          </div>

          <div className="mt-8 space-y-10">
            <section className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-heading text-[22px] tracking-[-0.4px]">1/ Ephemeral sessions</h3>
                <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
                  A new sandbox is created for a task, the agent does its work, and the environment is destroyed when the task completes. This is operationally simple, but it starts to break down when complexity extends beyond what is possible to accomplish with a single prompt.
                </p>
              </div>
              <SceneEmbed scene={ephemeralSessionsScene} />
            </section>

            <section className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-heading text-[22px] tracking-[-0.4px]">2/ Long-running sessions</h3>
                <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
                  The sandbox stays alive across tasks and interactions. This reduces repeated startup cost, keeps state close to the work, and is often the best fit for high-frequency or proactive agents.
                </p>
              </div>
              <SceneEmbed scene={longRunningSessionsScene} />
            </section>

            <section className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-heading text-[22px] tracking-[-0.4px]">3/ Hybrid sessions</h3>
                <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
                  The sandbox can shut down between bursts of work, but state is preserved and reloaded when the user or system returns. This pattern trades some startup overhead for much better economics than keeping everything hot all the time.
                </p>
              </div>
              <SceneEmbed scene={hybridSessionsScene} />
            </section>

            <section className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-heading text-[22px] tracking-[-0.4px]">4/ Shared container</h3>
                <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
                  Multiple agents or processes share one long-lived environment. This can work when close collaboration is essential, but it increases the risk of conflicts and makes isolation between agents much weaker.
                </p>
                <Callout>
                  Unlike the patterns above, shared containers are less about lifecycle and more about tenancy. A shared environment can itself be ephemeral, long-running, or hybrid; the key difference is that multiple agents or users share the same boundary, which weakens isolation in exchange for tighter collaboration.
                </Callout>
              </div>
              <SceneEmbed scene={singleContainerScene} />
            </section>
          </div>

          <div className="space-y-7 text-[17px] leading-[1.75] tracking-[-0.1px]">
            <p>
              Long-lived and hybrid patterns tend to make the most sense from both a performance and economic perspective. Long-lived sessions minimize repeated startup and hydration costs for agents that are active continuously, while hybrid sessions preserve most of the same statefulness benefits without paying to keep every environment hot during idle periods.
            </p>
            <p>
              Ephemeral sessions are still useful for narrow one-shot tasks, and shared containers can make sense for tightly coordinated multi-agent systems, but for most user-facing agent products a long-lived or hybrid approach is best.
            </p>
            <Callout>
              OpenComputer takes a middle path between long-lived and hybrid designs. Where possible, environments are paused and resumed on the same host so they can preserve local state and avoid unnecessary cold starts. At the same time, state can also be persisted and restored externally when a workload is more intermittent or when the environment needs to move between hosts.
            </Callout>
          </div>
        </section>
      </FadeIn>

      <FadeIn>
        <div className="my-10 h-px w-12 bg-border" />
      </FadeIn>

      <FadeIn>
        <section className="space-y-6">
          <h2 className="font-heading text-[clamp(28px,4vw,38px)] leading-[1.35] tracking-[-0.8px]">Conclusion</h2>
          <div className="space-y-7 text-[17px] leading-[1.75] tracking-[-0.1px]">
            <p>
              Agentic systems have operational needs that do not line up neatly with traditional application architectures. They need isolated execution, broad tool access, persistent working state, and a setup where reasoning and execution stay close enough that repeated tool calls do not pile on avoidable latency.
            </p>
            <p>
              For most user-facing agent products, this means combining OS-level sandboxing, strong environment isolation, and trust-minimized credentials. Colocating the agent with its execution environment inside that boundary keeps latency low and operational complexity to a minimum.
            </p>
            <p>
              On the lifecycle side, the most practical production choices are usually always-on, long-lived environments. They preserve continuity where agents need it while allowing elastic resizing at runtime to match the workload.
            </p>
            <p>
              The broader takeaway is simple: agents do not just need sandboxes. They need computers with the right isolation, the right placement, and the right lifecycle model for the workload they are serving. That is what we are building with OpenComputer.
            </p>
          </div>
        </section>
      </FadeIn>

      <FadeIn>
        <div className="my-10 h-px w-12 bg-border" />
      </FadeIn>

      <FadeIn>
        <section className="space-y-6">
          <h2 className="font-heading text-[28px] tracking-[-0.5px]">References</h2>
          <ul className="space-y-4 text-[17px] leading-[1.75] tracking-[-0.1px] list-none pl-0 text-muted-foreground">
            <li className="flex items-start gap-3">
              <span className="font-mono-brand text-[13px] text-muted-foreground mt-1 flex-shrink-0">&rarr;</span>
              <a href="https://www.luiscardoso.dev/blog/sandboxes-for-ai" target="_blank" rel="noreferrer" className="underline transition-colors hover:text-foreground">
                Luis Cardoso - Sandboxes for AI
              </a>
            </li>
            <li className="flex items-start gap-3">
              <span className="font-mono-brand text-[13px] text-muted-foreground mt-1 flex-shrink-0">&rarr;</span>
              <a href="https://pierce.dev/notes/a-deep-dive-on-agent-sandboxes" target="_blank" rel="noreferrer" className="underline transition-colors hover:text-foreground">
                Pierce Freeman - A Deep Dive on Agent Sandboxes
              </a>
            </li>
            <li className="flex items-start gap-3">
              <span className="font-mono-brand text-[13px] text-muted-foreground mt-1 flex-shrink-0">&rarr;</span>
              <a href="https://platform.claude.com/docs/en/agent-sdk/secure-deployment" target="_blank" rel="noreferrer" className="underline transition-colors hover:text-foreground">
                Anthropic - Agent SDK Secure Deployment
              </a>
            </li>
            <li className="flex items-start gap-3">
              <span className="font-mono-brand text-[13px] text-muted-foreground mt-1 flex-shrink-0">&rarr;</span>
              <a href="https://code.claude.com/docs/en/sandboxing" target="_blank" rel="noreferrer" className="underline transition-colors hover:text-foreground">
                Anthropic - Claude Code Sandboxing
              </a>
            </li>
            <li className="flex items-start gap-3">
              <span className="font-mono-brand text-[13px] text-muted-foreground mt-1 flex-shrink-0">&rarr;</span>
              <a href="https://developers.openai.com/codex/agent-approvals-security/#os-level-sandbox" target="_blank" rel="noreferrer" className="underline transition-colors hover:text-foreground">
                OpenAI - Codex Agent Approvals and Security
              </a>
            </li>
            <li className="flex items-start gap-3">
              <span className="font-mono-brand text-[13px] text-muted-foreground mt-1 flex-shrink-0">&rarr;</span>
              <a href="https://www.sysdig.com/blog/runc-container-escape-vulnerabilities" target="_blank" rel="noreferrer" className="underline transition-colors hover:text-foreground">
                Sysdig - A Brief History of runC Container Escape Vulnerabilities
              </a>
            </li>
            <li className="flex items-start gap-3">
              <span className="font-mono-brand text-[13px] text-muted-foreground mt-1 flex-shrink-0">&rarr;</span>
              <a href="https://browser-use.com/posts/two-ways-to-sandbox-agents" target="_blank" rel="noreferrer" className="underline transition-colors hover:text-foreground">
                Browser Use - How We Built Secure, Scalable Agent Sandbox Infrastructure
              </a>
            </li>
          </ul>
        </section>
      </FadeIn>
    </SitePageLayout>
  );
};

export default WhereShouldTheAgentLive;
