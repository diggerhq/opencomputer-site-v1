import FadeIn from "@/components/FadeIn";
import ShikiCodeBlock from "@/components/ShikiCodeBlock";
import SitePageLayout from "@/components/SitePageLayout";
import SEO from "@/components/SEO";

const InlineCode = ({ children }: { children: React.ReactNode }) => (
  <code className="font-mono-brand text-[15px] bg-[hsl(0,0%,93%)] px-1.5 py-0.5 rounded">
    {children}
  </code>
);

const DiagramBox = ({
  label,
  sub,
  accent = false,
}: {
  label: string;
  sub?: string;
  accent?: boolean;
}) => (
  <div
    className={`px-5 py-4 rounded-lg border text-center min-w-[140px] ${
      accent
        ? "bg-foreground text-background border-foreground"
        : "bg-[hsl(0,0%,98%)] text-foreground border-border"
    }`}
  >
    <p className={`font-mono-brand text-[13px] font-medium ${accent ? "text-background" : ""}`}>
      {label}
    </p>
    {sub && (
      <p
        className={`font-mono-brand text-[11px] mt-1 ${
          accent ? "text-background/60" : "text-muted-foreground"
        }`}
      >
        {sub}
      </p>
    )}
  </div>
);

const Arrow = ({ direction = "right" }: { direction?: "right" | "down" }) => (
  <div className="flex items-center justify-center">
    <span className="font-mono-brand text-[18px] text-muted-foreground select-none">
      {direction === "right" ? "\u2192" : "\u2193"}
    </span>
  </div>
);

const features = [
  {
    title: "OpenClaw",
    description:
      "An AI gateway with a rich plugin SDK, native MCP support, and hot-reload config. Runs Claude via OpenRouter out of the box.",
  },
  {
    title: "gbrain",
    description:
      "Persistent memory backed by Postgres with vector search. 34 tools for storing, searching, and organizing knowledge.",
  },
  {
    title: "Telegram",
    description:
      "Reach your agent from your phone or desktop. One bot token connects the channel — OpenClaw hot-reloads, no restart.",
  },
  {
    title: "OpenComputer",
    description:
      "An always-on sandbox with persistent state. The agent stays where you left it, ready when you are.",
  },
];

const STEP_CREATE = `oc agent create my-claw --core openclaw`;
const STEP_GBRAIN = `oc agent install my-claw gbrain`;
const STEP_TELEGRAM = `oc agent connect my-claw telegram \\
  --bot-token YOUR_BOT_TOKEN`;

const Clawputer = () => {
  return (
    <SitePageLayout>
      {/* ── Hero ── */}
      <FadeIn>
        <p className="font-mono-brand text-[12px] uppercase tracking-[0.2em] text-muted-foreground mb-5">
          openclaw &middot; gbrain &middot; telegram
        </p>
      </FadeIn>

      <FadeIn delay={0.04}>
        <h1 className="font-heading text-[clamp(48px,7vw,80px)] leading-[1.05] tracking-[-1.8px] mb-8">
          Clawputer.
        </h1>
      </FadeIn>

      <FadeIn delay={0.1}>
        <div className="mb-10 space-y-6 max-w-[680px]">
          <p className="text-[19px] leading-[1.65] tracking-[-0.15px]">
            Your personal AI agent. On Telegram. With memory that sticks around.
          </p>
          <p className="text-[17px] leading-[1.75] tracking-[-0.1px] text-muted-foreground">
            A managed OpenClaw agent inside an always-on OpenComputer sandbox, wired to a
            Postgres-backed knowledge base and reachable from your phone. Three commands to
            stand up, no servers to babysit.
          </p>
        </div>
      </FadeIn>

      <FadeIn delay={0.16}>
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <a
            href="https://docs.opencomputer.dev/guides/create-openclaw-agent"
            target="_blank"
            className="inline-block text-[15px] font-medium px-10 py-4 rounded-md bg-primary text-primary-foreground border border-primary hover:bg-foreground/90 transition-all duration-150"
          >
            Read the guide &rarr;
          </a>
        </div>
      </FadeIn>

      <FadeIn delay={0.22}>
        <div className="w-12 h-px bg-border my-12" />
      </FadeIn>

      {/* ── Pitch ── */}
      <FadeIn>
        <p className="font-heading text-[clamp(28px,4vw,42px)] leading-[1.3] tracking-[-0.8px] mb-2 max-w-[820px]">
          An agent that remembers what you told it last week. Lives in your pocket. Doesn't time out.
        </p>
      </FadeIn>

      {/* ── What's inside ── */}
      <FadeIn>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-14">
          {features.map((f) => (
            <div
              key={f.title}
              className="p-6 rounded-lg border border-border/50 bg-[hsl(0,0%,98%)] hover:border-foreground/20 transition-colors duration-150"
            >
              <h3 className="font-heading text-[20px] tracking-[-0.3px] mb-2">{f.title}</h3>
              <p className="text-[15px] leading-[1.7] text-muted-foreground">{f.description}</p>
            </div>
          ))}
        </div>
      </FadeIn>

      {/* ── Architecture diagram ── */}
      <FadeIn>
        <div className="my-14 p-8 rounded-xl border border-border/50 bg-[hsl(0,0%,98.5%)]">
          <p className="font-mono-brand text-[11px] uppercase tracking-[0.15em] text-muted-foreground mb-6">
            How it fits together
          </p>
          <div className="flex flex-col md:flex-row items-center gap-3 md:gap-4 justify-center">
            <DiagramBox label="You" sub="Telegram" />
            <Arrow direction="right" />
            <DiagramBox label="OpenClaw" sub="gateway + MCP" accent />
            <Arrow direction="right" />
            <div className="flex flex-col gap-3">
              <DiagramBox label="Claude" sub="via OpenRouter" />
              <DiagramBox label="gbrain" sub="Postgres + vector" />
            </div>
          </div>
          <p className="font-mono-brand text-[11px] uppercase tracking-[0.15em] text-muted-foreground mt-6 text-center">
            all running inside one always-on OpenComputer sandbox
          </p>
        </div>
      </FadeIn>

      {/* ── Build it ── */}
      <FadeIn>
        <p className="font-heading text-[clamp(28px,4vw,38px)] leading-[1.35] tracking-[-0.8px] mt-16 mb-3">
          Three commands.
        </p>
        <p className="text-[17px] leading-[1.75] tracking-[-0.1px] text-muted-foreground mb-10 max-w-[680px]">
          Grab an API key from{" "}
          <a
            href="https://app.opencomputer.dev"
            target="_blank"
            className="underline hover:text-foreground transition-colors"
          >
            app.opencomputer.dev
          </a>
          , install the <InlineCode>oc</InlineCode> CLI, and run these.
        </p>

        <div className="space-y-8">
          {/* Step 1 */}
          <div className="grid grid-cols-1 md:grid-cols-[120px_1fr] gap-4 md:gap-8 items-start">
            <div>
              <p className="font-mono-brand text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
                Step 01
              </p>
              <p className="font-heading text-[22px] tracking-[-0.3px] mt-1">Create</p>
            </div>
            <div className="space-y-2">
              <ShikiCodeBlock code={STEP_CREATE} language="bash" copyable />
              <p className="text-[14px] text-muted-foreground leading-[1.6]">
                Provisions a sandbox with Node 22, OpenRouter pre-configured, and the OpenClaw
                gateway running. Ready in 20&ndash;30 seconds.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="grid grid-cols-1 md:grid-cols-[120px_1fr] gap-4 md:gap-8 items-start">
            <div>
              <p className="font-mono-brand text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
                Step 02
              </p>
              <p className="font-heading text-[22px] tracking-[-0.3px] mt-1">Add memory</p>
            </div>
            <div className="space-y-2">
              <ShikiCodeBlock code={STEP_GBRAIN} language="bash" copyable />
              <p className="text-[14px] text-muted-foreground leading-[1.6]">
                Allocates a managed Postgres database, clones gbrain, and wires it as an MCP
                server. Idempotent &mdash; the database survives uninstall and reinstall.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="grid grid-cols-1 md:grid-cols-[120px_1fr] gap-4 md:gap-8 items-start">
            <div>
              <p className="font-mono-brand text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
                Step 03
              </p>
              <p className="font-heading text-[22px] tracking-[-0.3px] mt-1">Connect Telegram</p>
            </div>
            <div className="space-y-2">
              <ShikiCodeBlock code={STEP_TELEGRAM} language="bash" copyable />
              <p className="text-[14px] text-muted-foreground leading-[1.6]">
                Get the bot token from{" "}
                <a
                  href="https://t.me/BotFather"
                  target="_blank"
                  className="underline hover:text-foreground transition-colors"
                >
                  BotFather
                </a>
                . The webhook is registered for you and OpenClaw hot-reloads &mdash; no restart.
              </p>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* ── Sample chat ── */}
      <FadeIn>
        <div className="my-20">
          <p className="font-heading text-[clamp(28px,4vw,38px)] leading-[1.35] tracking-[-0.8px] mb-8">
            Then talk to it.
          </p>
          <div className="rounded-xl overflow-hidden border border-border/70 shadow-sm">
            <div className="bg-[hsl(0,0%,95%)] border-b border-[hsl(0,0%,88%)] px-4 py-2.5 flex items-center gap-3">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[hsl(0,0%,75%)]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[hsl(0,0%,75%)]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[hsl(0,0%,75%)]" />
              </div>
              <span className="font-mono-brand text-[11px] text-[hsl(0,0%,55%)]">
                @my_clawputer_bot
              </span>
            </div>
            <div className="bg-white px-6 py-6 space-y-4 font-mono-brand text-[14px] leading-[1.6]">
              <div className="flex gap-3">
                <span className="text-muted-foreground w-12 shrink-0">you</span>
                <span>What new tools do you have?</span>
              </div>
              <div className="flex gap-3">
                <span className="text-muted-foreground w-12 shrink-0">claw</span>
                <span>I now have gbrain tools &mdash; search, put_page, timeline...</span>
              </div>
              <div className="border-t border-border/40 pt-4 flex gap-3">
                <span className="text-muted-foreground w-12 shrink-0">you</span>
                <span>
                  Use gbrain to remember that our deployment target is Kubernetes on GCP
                </span>
              </div>
              <div className="flex gap-3">
                <span className="text-muted-foreground w-12 shrink-0">claw</span>
                <span>Saved to knowledge base.</span>
              </div>
              <div className="border-t border-border/40 pt-4 flex gap-3">
                <span className="text-muted-foreground w-12 shrink-0">you</span>
                <span>Use gbrain to search for deployment</span>
              </div>
              <div className="flex gap-3">
                <span className="text-muted-foreground w-12 shrink-0">claw</span>
                <span>You deploy to Kubernetes on GCP.</span>
              </div>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* ── Why it sticks ── */}
      <FadeIn>
        <div className="my-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="font-heading text-[28px] tracking-[-0.4px] mb-2">Always on.</p>
            <p className="text-[15px] leading-[1.7] text-muted-foreground">
              The sandbox doesn't time out between messages. Your agent's environment, packages,
              and state are exactly where you left them.
            </p>
          </div>
          <div>
            <p className="font-heading text-[28px] tracking-[-0.4px] mb-2">Memory that lasts.</p>
            <p className="text-[15px] leading-[1.7] text-muted-foreground">
              gbrain's Postgres lives outside the sandbox. Survives instance restarts and even
              full sandbox recreation.
            </p>
          </div>
          <div>
            <p className="font-heading text-[28px] tracking-[-0.4px] mb-2">Yours to shell into.</p>
            <p className="text-[15px] leading-[1.7] text-muted-foreground">
              <InlineCode>oc shell my-claw</InlineCode> drops you into the box. Inspect the gateway,
              tweak the config, watch the logs.
            </p>
          </div>
        </div>
      </FadeIn>

      {/* ── Final CTA ── */}
      <FadeIn>
        <div className="mt-20 pt-14 border-t border-border">
          <p className="font-heading text-[clamp(28px,4vw,42px)] leading-[1.25] tracking-[-0.8px] mb-8 max-w-[640px]">
            Give yourself a Clawputer.
          </p>
          <div className="flex gap-3 items-center flex-wrap">
            <a
              href="https://app.opencomputer.dev"
              className="inline-block text-[15px] font-medium px-10 py-4 rounded-md bg-primary text-primary-foreground border border-primary hover:bg-foreground/90 transition-all duration-150"
            >
              Get an API key &rarr;
            </a>
            <a
              href="https://docs.opencomputer.dev/guides/create-openclaw-agent"
              target="_blank"
              className="inline-block text-sm font-medium px-7 py-3 rounded-md bg-background text-foreground border border-border hover:border-foreground transition-all duration-150"
            >
              Full guide
            </a>
          </div>
        </div>
      </FadeIn>

      <SEO
        title="Clawputer"
        description="Your personal AI agent on Telegram, with persistent memory. OpenClaw + gbrain on OpenComputer in three commands."
        path="/clawputer"
        type="website"
      />
    </SitePageLayout>
  );
};

export default Clawputer;
