import FadeIn from "@/components/FadeIn";
import SitePageLayout from "@/components/SitePageLayout";
import SEO from "@/components/SEO";

/* ------------------------------ data ------------------------------ */

const GH_URL = "https://github.com/diggerhq/opencomputer";
const APP_URL = "https://app.opencomputer.dev";
const DOCS_URL = "https://docs.opencomputer.dev/agents/overview";
const QUICKSTART_URL = "https://docs.opencomputer.dev/agents/quickstart";

const heroCode = `import {
  connection,
  useConnection,
  useInput,
  useModel,
  useTool,
} from "@opencomputer/agent";
import { latestStories } from "./tools/hacker-news";

const gmail = connection("gmail");

export default function Agent() {
  const input = useInput();
  useModel("anthropic/claude-sonnet-4.6");
  useTool(latestStories);
  if (input.text?.includes("email")) useConnection(gmail);

  return \`Be concise and practical.
Current request: \${input.text ?? "none"}\`;
}`;

const quickstartCode = `$ npm create @opencomputer/start@latest my-agent
$ cd my-agent && npm install
$ npx opencomputer login

$ npm run dev        # syncs agent code to your dev cloud
$ npm run dev:web    # local React app, generated client

$ npm run deploy -- --alias production`;

const reactiveIdeas = [
  {
    title: "Instructions are the return value",
    desc: "An agent is a synchronous TypeScript function. The string it returns is what the managed agent loop runs on. New input, new render, new instructions.",
  },
  {
    title: "Capabilities are hooks",
    desc: "useModel, useTool, useConnection, useMcpServer, useSubagent. Whatever the function attaches on this render is what the agent can use on this turn.",
  },
  {
    title: "Plain control flow",
    desc: "An if statement decides which capabilities attach. No graphs, no YAML, no workflow DSL. Just code you can read, test, and review.",
  },
];

const cloudCards = [
  {
    step: "01 · sync",
    title: "Save",
    desc: "npm run dev watches your opencomputer/ directory and syncs every change to a managed development environment. There is no local agent server.",
  },
  {
    step: "02 · build",
    title: "Iterate",
    desc: "Your React app runs locally and talks to agents through a generated, typed client with streaming built in.",
  },
  {
    step: "03 · inspect",
    title: "Debug",
    desc: "Durable sessions you can replay from the dashboard or CLI playground, plus indexed runtime and egress logs.",
  },
  {
    step: "04 · ship",
    title: "Deploy",
    desc: "npm run deploy creates an immutable version behind an alias like production. Roll forward or back by moving the alias.",
  },
];

const features = [
  { name: "Multiple agents per project", desc: "One repository holds several agents plus the React app that talks to them." },
  { name: "Generated React client", desc: "A typed client for your agents with streaming support, generated for you." },
  { name: "Durable sessions", desc: "Conversations persist. Inspect and resume them from the dashboard or the CLI playground." },
  { name: "User-scoped connections", desc: "Gmail, Calendar, and GitHub, authorized per user and attached with a hook." },
  { name: "Managed MCP servers", desc: "Point at any MCP server, optionally authenticated through a connection." },
  { name: "Subagents", desc: "Compose agents from agents with useSubagent." },
  { name: "Project-level secrets", desc: "Secret-backed connections without exposing credentials to agent code." },
  { name: "Indexed logs", desc: "Runtime and managed-egress logs, followable from the CLI." },
  { name: "Slack integration", desc: "Wire a deployed agent into a Slack channel." },
];

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

const Agents = () => {
  return (
    <SitePageLayout contentClassName="pb-0">
      <SEO
        title="Serverless agents"
        description="Define agents as reactive TypeScript functions. OpenComputer runs the loop: models, tools, connections, durable sessions, streaming, and production deployments. Compute is free when you use models through us, or $0.08 per session hour with your own keys."
        path="/agents"
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
      `}</style>

      {/* ============================ HERO ============================ */}
      <section className="relative border-b border-border">
        <div className="absolute inset-0 oc-dotgrid oc-fade-mask" aria-hidden="true" />
        <Container className="relative pt-16 pb-20 md:pt-20 md:pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.05fr] gap-14 lg:gap-12 items-center">
            {/* left: copy */}
            <div>
              <FadeIn>
                <p className="font-mono-brand text-[11px] uppercase tracking-[0.15em] text-muted-foreground mb-4">
                  serverless agents
                </p>
                <h1 className="font-heading text-[clamp(44px,5.6vw,68px)] leading-[1.08] tracking-[-2px] mb-6">
                  Your agent is
                  <br />
                  a function.
                </h1>
                <p className="text-[17px] leading-[1.7] tracking-[-0.1px] text-muted-foreground max-w-[460px] mb-8">
                  Define agents as reactive TypeScript functions. Attach
                  models, tools, connections, MCP servers, and subagents
                  with hooks. OpenComputer runs the loop: durable sessions,
                  streaming, and immutable production deployments.
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <a
                    href={APP_URL}
                    className="inline-flex items-center gap-2.5 text-[15px] font-medium px-6 py-3.5 rounded-md bg-foreground text-background hover:opacity-90 transition-opacity no-underline"
                  >
                    Try now →
                  </a>
                  <a
                    href={QUICKSTART_URL}
                    target="_blank"
                    className="inline-flex items-center gap-2.5 text-[15px] font-medium px-6 py-3.5 rounded-md border border-border bg-background hover:border-foreground transition-colors no-underline"
                  >
                    Quickstart
                  </a>
                </div>
              </FadeIn>
            </div>

            {/* right: agent.ts */}
            <FadeIn delay={0.12}>
              <WindowChrome dark title="opencomputer/agents/assistant/agent.ts">
                <pre className="px-5 py-5 font-mono-brand text-[12.5px] leading-[1.8] overflow-x-auto">{heroCode}</pre>
              </WindowChrome>
            </FadeIn>
          </div>
        </Container>
      </section>

      {/* ======================= REACTIVE MODEL ======================= */}
      <section className="border-b border-border">
        <Container className="py-16 md:py-20">
          <FadeIn>
            <p className="font-mono-brand text-[11px] uppercase tracking-[0.15em] text-muted-foreground mb-4">
              reactive agents
            </p>
            <h2 className="font-heading text-[clamp(28px,3.6vw,40px)] leading-[1.2] tracking-[-1px] mb-4">
              Rendered like UI. Run like infrastructure.
            </h2>
            <p className="text-[16px] leading-[1.7] text-muted-foreground max-w-[560px]">
              OpenComputer re-renders your agent against the current input,
              and the result configures the managed agent loop. Nothing
              executes inside your function; it just declares what this
              turn should look like.
            </p>
          </FadeIn>

          <div className="mt-11 grid grid-cols-1 md:grid-cols-3 gap-4">
            {reactiveIdeas.map((r, i) => (
              <FadeIn key={r.title} delay={i * 0.05}>
                <div className="h-full p-6 rounded-xl border border-border bg-[hsl(0,0%,98.5%)]">
                  <h3 className="font-heading text-[20px] tracking-[-0.4px] mb-2.5">{r.title}</h3>
                  <p className="text-[14.5px] leading-[1.7] text-muted-foreground">{r.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </Container>
      </section>

      {/* ===================== CLOUD DEVELOPMENT ===================== */}
      <section className="bg-foreground text-background border-b border-border">
        <Container className="py-16 md:py-20">
          <FadeIn>
            <p className="font-mono-brand text-[11px] uppercase tracking-[0.15em] opacity-50 mb-4">cloud development</p>
            <h2 className="font-heading text-[clamp(28px,3.6vw,40px)] leading-[1.2] tracking-[-1px] mb-5 max-w-[620px]">
              There is no local agent server.
            </h2>
            <p className="text-[16px] leading-[1.75] opacity-75 max-w-[560px] mb-11">
              Your React app runs on your machine. Your agent code runs in
              OpenComputer's managed development cloud, synced on every
              save. Dev and production are the same runtime.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {cloudCards.map((c, i) => (
              <FadeIn key={c.title} delay={i * 0.04}>
                <div className="h-full p-6 rounded-xl border border-white/10 bg-white/[0.04]">
                  <p className="font-mono-brand text-[11px] uppercase tracking-[0.15em] opacity-50 mb-3">{c.step}</p>
                  <h3 className="font-heading text-[22px] tracking-[-0.5px] mb-2">{c.title}</h3>
                  <p className="text-[14px] leading-[1.7] opacity-70">{c.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={0.1}>
            <p className="mt-11 text-center font-mono-brand text-[13px] opacity-55">
              write a function, get a production agent
            </p>
          </FadeIn>
        </Container>
      </section>

      {/* ========================= FEATURES ========================= */}
      <section className="border-b border-border">
        <Container className="py-16 md:py-20">
          <FadeIn>
            <p className="font-mono-brand text-[11px] uppercase tracking-[0.15em] text-muted-foreground mb-4">
              batteries included
            </p>
            <h2 className="font-heading text-[clamp(28px,3.6vw,40px)] leading-[1.2] tracking-[-1px] mb-4">
              The runtime handles the rest.
            </h2>
          </FadeIn>

          <FadeIn delay={0.06}>
            <div className="mt-7 border-t border-border">
              {features.map((f) => (
                <div
                  key={f.name}
                  className="grid grid-cols-1 sm:grid-cols-[260px_1fr] gap-1 sm:gap-8 items-baseline py-4 sm:py-[18px] px-1 border-b border-border"
                >
                  <span className="text-[15px] font-medium">{f.name}</span>
                  <span className="text-[15px] leading-[1.65] text-muted-foreground">{f.desc}</span>
                </div>
              ))}
            </div>
          </FadeIn>
        </Container>
      </section>

      {/* ========================= PRICING ========================= */}
      <section className="border-b border-border bg-[hsl(0,0%,98.5%)]">
        <Container className="py-16 md:py-20">
          <FadeIn>
            <p className="font-mono-brand text-[11px] uppercase tracking-[0.15em] text-muted-foreground mb-4">
              pricing
            </p>
            <h2 className="font-heading text-[clamp(28px,3.6vw,40px)] leading-[1.2] tracking-[-1px] mb-4">
              Compute is free when you use our models.
            </h2>
            <p className="text-[16px] leading-[1.7] text-muted-foreground max-w-[560px]">
              Two ways to pay, both without idle cost. Agents hibernate
              between invocations either way.
            </p>
          </FadeIn>

          <div className="mt-11 grid grid-cols-1 md:grid-cols-2 gap-5">
            <FadeIn delay={0.04}>
              <div className="h-full p-8 rounded-xl border border-foreground bg-background flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-heading text-[22px] tracking-[-0.5px]">Managed models</h3>
                  <span className="font-mono-brand text-[10px] uppercase tracking-[0.15em] px-2.5 py-1 rounded-full bg-foreground text-background">
                    default
                  </span>
                </div>
                <p className="font-heading text-[44px] leading-none tracking-[-1.5px] mb-1.5">
                  $0
                  <span className="font-sans text-[15px] tracking-normal text-muted-foreground ml-2">compute</span>
                </p>
                <p className="text-[15px] leading-[1.7] text-muted-foreground mt-4">
                  Consume models through OpenComputer and compute is free.
                  You pay for model usage, and nothing for the machines
                  your agents run on.
                </p>
              </div>
            </FadeIn>
            <FadeIn delay={0.08}>
              <div className="h-full p-8 rounded-xl border border-border bg-background flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-heading text-[22px] tracking-[-0.5px]">Bring your own keys</h3>
                  <span className="font-mono-brand text-[10px] uppercase tracking-[0.15em] px-2.5 py-1 rounded-full border border-border text-muted-foreground">
                    byok
                  </span>
                </div>
                <p className="font-heading text-[44px] leading-none tracking-[-1.5px] mb-1.5">
                  $0.08
                  <span className="font-sans text-[15px] tracking-normal text-muted-foreground ml-2">per session hour</span>
                </p>
                <p className="text-[15px] leading-[1.7] text-muted-foreground mt-4">
                  Use your own model API keys and pay a flat rate for
                  compute, metered only while your agent sessions are
                  actually running.
                </p>
              </div>
            </FadeIn>
          </div>
        </Container>
      </section>

      {/* ========================= QUICKSTART ========================= */}
      <section className="border-b border-border">
        <Container className="py-16 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <FadeIn>
              <p className="font-mono-brand text-[11px] uppercase tracking-[0.15em] text-muted-foreground mb-4">
                quickstart
              </p>
              <h2 className="font-heading text-[clamp(28px,3.6vw,40px)] leading-[1.2] tracking-[-1px] mb-4">
                From npm create to production.
              </h2>
              <p className="text-[16px] leading-[1.75] text-muted-foreground max-w-[440px] mb-8">
                One command scaffolds a project with an agent and a React
                app. Edit agent.ts, watch it sync to your dev cloud, then
                ship an immutable version behind the production alias.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={QUICKSTART_URL}
                  target="_blank"
                  className="inline-flex items-center gap-2.5 text-[15px] font-medium px-6 py-3.5 rounded-md bg-foreground text-background hover:opacity-90 transition-opacity no-underline"
                >
                  Read the quickstart →
                </a>
                <a
                  href={DOCS_URL}
                  target="_blank"
                  className="inline-flex items-center gap-2.5 text-[15px] font-medium px-6 py-3.5 rounded-md border border-border bg-background hover:border-foreground transition-colors no-underline"
                >
                  Docs
                </a>
              </div>
            </FadeIn>
            <FadeIn delay={0.1}>
              <WindowChrome dark title="terminal">
                <pre className="px-6 py-5 font-mono-brand text-[13px] leading-[2.05] overflow-x-auto">{quickstartCode}</pre>
              </WindowChrome>
            </FadeIn>
          </div>
        </Container>
      </section>

      {/* ========================= FINAL CTA ========================= */}
      <section className="relative">
        <div className="absolute inset-0 oc-dotgrid" aria-hidden="true" />
        <Container className="relative py-20 md:py-24 text-center">
          <FadeIn>
            <h2 className="font-heading text-[clamp(32px,4.5vw,52px)] leading-[1.15] tracking-[-1.5px] mb-6">
              A home for
              <br />
              your agents.
            </h2>
            <div className="flex flex-wrap justify-center items-center gap-3 mt-8">
              <a
                href={APP_URL}
                className="inline-block text-[15px] font-medium px-9 py-4 rounded-md bg-foreground text-background hover:opacity-90 transition-opacity no-underline"
              >
                Try now →
              </a>
              <a
                href={QUICKSTART_URL}
                target="_blank"
                className="inline-block text-[15px] font-medium px-7 py-4 rounded-md border border-border bg-background hover:border-foreground transition-colors no-underline"
              >
                Quickstart
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

export default Agents;
