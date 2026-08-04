import FadeIn from "@/components/FadeIn";
import SitePageLayout from "@/components/SitePageLayout";
import SEO from "@/components/SEO";

/* ------------------------------ data ------------------------------ */

const GH_URL = "https://github.com/diggerhq/opencomputer";
const APP_URL = "https://app.opencomputer.dev";
const QUICKSTART_URL = "https://docs.opencomputer.dev/agents/quickstart";

const agentFiles = [
  { name: "opencomputer.toml", purpose: <>Committed identity for the agent. Keep its <span className="font-mono-brand text-[13px] px-1.5 py-0.5 rounded-sm border border-border bg-[hsl(0,0%,98%)] text-foreground">id</span> stable across deployments.</> },
  { name: "instructions.md", purpose: "The agent's role, operating rules, and approval boundaries." },
  { name: "agent.ts", purpose: "Model and runtime permissions used by OpenCode." },
  { name: "opencomputer.config.ts", purpose: "OpenComputer runtime configuration." },
  { name: "tools/", purpose: "Code-native tools available to the agent." },
  { name: "connections/", purpose: "Declarations for managed services such as Gmail." },
  { name: "skills/", purpose: "Reusable domain knowledge and workflows." },
  { name: "workspace/", purpose: "Durable working files packaged with the agent." },
  { name: "evals/", purpose: "Repeatable checks for agent behavior." },
];

const lifecycle = [
  {
    step: "01 · invoke",
    title: "Wake",
    desc: "A trigger fires. The agent's machine wakes in milliseconds with memory, workspace, and context intact.",
  },
  {
    step: "02 · run",
    title: "Work",
    desc: "The agent thinks, calls its tools, writes to its workspace. Long tasks are fine; it's a real computer.",
  },
  {
    step: "03 · checkpoint",
    title: "Snapshot",
    desc: "When the turn ends, the whole machine is checkpointed: process, memory, filesystem.",
  },
  {
    step: "04 · sleep",
    title: "Sleep",
    desc: "It hibernates for free and resumes exactly where it left off. Next week's run remembers last week's.",
  },
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

const TreeLine = ({ prefix, children }: { prefix: string; children: React.ReactNode }) => (
  <div className="whitespace-pre">
    <span className="opacity-40">{prefix}</span>
    {children}
  </div>
);

/* ------------------------------ page ------------------------------ */

const Agents = () => {
  return (
    <SitePageLayout contentClassName="pb-0">
      <SEO
        title="Serverless agents"
        description="An agent is a directory. Instructions, tools, connections, and config, versioned in your repo. Deploy it and it runs serverless on OpenComputer: hibernating between invocations, resuming with state intact."
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
          <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-14 lg:gap-12 items-center">
            {/* left: copy */}
            <div>
              <FadeIn>
                <p className="font-mono-brand text-[11px] uppercase tracking-[0.15em] text-muted-foreground mb-4">
                  serverless agents
                </p>
                <h1 className="font-heading text-[clamp(44px,5.6vw,68px)] leading-[1.08] tracking-[-2px] mb-6">
                  Your agent is
                  <br />
                  just code.
                </h1>
                <p className="text-[17px] leading-[1.7] tracking-[-0.1px] text-muted-foreground max-w-[460px] mb-8">
                  An agent is a directory. Instructions, tools, connections,
                  and config, versioned in your repo and reviewed like any
                  other code. Deploy it and it runs serverless on
                  OpenComputer: hibernating between invocations, resuming
                  with its state intact.
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

            {/* right: agent directory */}
            <FadeIn delay={0.12}>
              <WindowChrome dark title="gmail-summarizer/">
                <div className="px-5 py-5 font-mono-brand text-[13px] leading-[2.05] overflow-x-auto">
                  <div className="whitespace-pre">gmail-summarizer/</div>
                  <TreeLine prefix="├── ">opencomputer.toml</TreeLine>
                  <TreeLine prefix="├── ">opencomputer.config.ts</TreeLine>
                  <TreeLine prefix="├── ">agent.ts</TreeLine>
                  <TreeLine prefix="├── ">instructions.md</TreeLine>
                  <TreeLine prefix="├── ">package.json</TreeLine>
                  <TreeLine prefix="├── ">tools/</TreeLine>
                  <TreeLine prefix="│   └── ">gmail.ts</TreeLine>
                  <TreeLine prefix="├── ">connections/</TreeLine>
                  <TreeLine prefix="│   └── ">google.json</TreeLine>
                  <TreeLine prefix="├── ">skills/</TreeLine>
                  <TreeLine prefix="├── ">workspace/</TreeLine>
                  <TreeLine prefix="└── ">evals/</TreeLine>
                </div>
              </WindowChrome>
            </FadeIn>
          </div>
        </Container>
      </section>

      {/* ======================= AGENTS AS CODE ======================= */}
      <section className="border-b border-border">
        <Container className="py-16 md:py-20">
          <FadeIn>
            <p className="font-mono-brand text-[11px] uppercase tracking-[0.15em] text-muted-foreground mb-4">
              agents as code
            </p>
            <h2 className="font-heading text-[clamp(28px,3.6vw,40px)] leading-[1.2] tracking-[-1px] mb-4">
              Every part of the agent has a place.
            </h2>
            <p className="text-[16px] leading-[1.7] text-muted-foreground max-w-[560px]">
              Nothing lives in a dashboard. The identity, the instructions,
              the tools, even the eval suite ship in the same directory.
            </p>
          </FadeIn>

          <FadeIn delay={0.06}>
            <div className="mt-11 border-t border-border">
              {agentFiles.map((f) => (
                <div
                  key={f.name}
                  className="grid grid-cols-1 sm:grid-cols-[240px_1fr] gap-1 sm:gap-8 items-baseline py-4 sm:py-[18px] px-1 border-b border-border"
                >
                  <span className="font-mono-brand text-[13px] font-medium">{f.name}</span>
                  <span className="text-[15px] leading-[1.65] text-muted-foreground">{f.purpose}</span>
                </div>
              ))}
            </div>
          </FadeIn>
        </Container>
      </section>

      {/* ===================== SERVERLESS LIFECYCLE ===================== */}
      <section className="bg-foreground text-background border-b border-border">
        <Container className="py-16 md:py-20">
          <FadeIn>
            <p className="font-mono-brand text-[11px] uppercase tracking-[0.15em] opacity-50 mb-4">the serverless part</p>
            <h2 className="font-heading text-[clamp(28px,3.6vw,40px)] leading-[1.2] tracking-[-1px] mb-5 max-w-[620px]">
              Between invocations, your agent costs nothing.
            </h2>
            <p className="text-[16px] leading-[1.75] opacity-75 max-w-[560px] mb-11">
              Every agent gets a real machine, not a stateless function. We
              just make the machine disappear when it's idle.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {lifecycle.map((c, i) => (
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
              you pay for seconds of compute, not for an agent that exists
            </p>
          </FadeIn>
        </Container>
      </section>

      {/* ========================= QUICKSTART ========================= */}
      <section className="border-b border-border bg-[hsl(0,0%,98.5%)]">
        <Container className="py-16 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <FadeIn>
              <p className="font-mono-brand text-[11px] uppercase tracking-[0.15em] text-muted-foreground mb-4">
                quickstart
              </p>
              <h2 className="font-heading text-[clamp(28px,3.6vw,40px)] leading-[1.2] tracking-[-1px] mb-4">
                Build your first serverless agent.
              </h2>
              <p className="text-[16px] leading-[1.75] text-muted-foreground max-w-[440px] mb-8">
                The quickstart walks you through gmail-summarizer, an agent
                that reads your inbox and writes you a digest. From empty
                directory to a deployed, scheduled agent.
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
                  href={APP_URL}
                  className="inline-flex items-center gap-2.5 text-[15px] font-medium px-6 py-3.5 rounded-md border border-border bg-background hover:border-foreground transition-colors no-underline"
                >
                  Try now
                </a>
              </div>
            </FadeIn>
            <FadeIn delay={0.1}>
              <WindowChrome title="instructions.md">
                <div className="px-6 py-5 font-mono-brand text-[13px] leading-[2.05] overflow-x-auto">
                  <div className="whitespace-nowrap text-muted-foreground"># Gmail summarizer</div>
                  <div className="whitespace-nowrap">&nbsp;</div>
                  <div className="whitespace-nowrap">You summarize the day's unread email</div>
                  <div className="whitespace-nowrap">into one short digest.</div>
                  <div className="whitespace-nowrap">&nbsp;</div>
                  <div className="whitespace-nowrap">Group by sender, lead with anything</div>
                  <div className="whitespace-nowrap">that needs a reply. Never send email</div>
                  <div className="whitespace-nowrap">on my behalf without approval.</div>
                </div>
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
