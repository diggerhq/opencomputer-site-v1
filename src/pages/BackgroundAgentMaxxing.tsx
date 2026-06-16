import FadeIn from "@/components/FadeIn";
import SEO from "@/components/SEO";
import SitePageLayout from "@/components/SitePageLayout";

type Player = {
  name: string;
  sub: string;
  url: string;
  logo?: string;
  wide?: boolean;
};

const offShelf: Player[] = [
  { name: "Devin", sub: "Cognition", url: "https://devin.ai", logo: "/logos/devin.jpg" },
  { name: "Cursor", sub: "Background Agent", url: "https://cursor.com/features/background-agent", logo: "/logos/cursor.svg" },
  { name: "Replit Agent", sub: "Replit", url: "https://replit.com", logo: "/logos/replit.png" },
  { name: "Ona", sub: "formerly Gitpod", url: "https://ona.com", logo: "/logos/ona.svg" },
  { name: "Replicas", sub: "tryreplicas.com", url: "https://tryreplicas.com", logo: "/logos/replicas_R.svg" },
  { name: "Omnara", sub: "omnara.com", url: "https://omnara.com", logo: "/logos/omnara.png" },
  { name: "Amika", sub: "amika.dev", url: "https://amika.dev", logo: "/logos/amika.svg" },
  { name: "Ara", sub: "ara.so", url: "https://ara.so", logo: "/logos/ara.png" },
  { name: "Runtime", sub: "runtm.com", url: "https://runtm.com", logo: "/logos/runtm.svg" },
  { name: "Sparkles", sub: "YC W26", url: "https://sparkles.dev", logo: "/logos/sparkles.png" },
  { name: "Niteshift", sub: "niteshift.dev", url: "https://niteshift.dev", logo: "/logos/niteshift.png" },
  { name: "TabTabTab", sub: "tabtabtab.ai", url: "https://tabtabtab.ai", logo: "/logos/tabtabtab.png" },
];

const openSource: Player[] = [
  { name: "OpenAgents", sub: "by Vercel", url: "https://open-agents.dev", logo: "/logos/openagents.png" },
  { name: "Mistle", sub: "mistle.dev", url: "https://mistle.dev", logo: "/logos/mistle.png" },
  { name: "Deputies", sub: "deputies.dev", url: "https://deputies.dev", logo: "/logos/deputies.svg" },
  { name: "OpenInspect", sub: "open source", url: "https://github.com/search?q=openinspect&type=repositories" },
];

const internal: Player[] = [
  { name: "Inspect", sub: "Ramp", url: "https://builders.ramp.com/post/why-we-built-our-background-agent", logo: "/logos/ramp.svg", wide: true },
  { name: "Minions", sub: "Stripe", url: "https://stripe.dev/blog/minions-stripes-one-shot-end-to-end-coding-agents", logo: "/logos/stripe.svg", wide: true },
  { name: "Horizon", sub: "WorkOS", url: "https://workos.com/blog/project-horizon", logo: "/logos/workos.svg", wide: true },
  { name: "Mux", sub: "Coinbase", url: "https://www.coinbase.com/blog/coding-had-a-concurrency-problem-how-mux-helped-solve-it", logo: "/logos/coinbase.png" },
  { name: "Spectre", sub: "Harvey", url: "https://www.harvey.ai/blog/building-spectre-internal-collaborative-cloud-agent-platform", logo: "/logos/harvey.png" },
];

const Card = ({ p }: { p: Player }) => (
  <a
    href={p.url}
    target="_blank"
    rel="noreferrer"
    className="group flex flex-col items-center text-center gap-2 p-3 rounded-lg border border-border/60 bg-background hover:bg-[hsl(0,0%,98%)] hover:border-foreground/30 hover:-translate-y-0.5 transition-all duration-150 no-underline"
  >
    <span className="h-8 flex items-center justify-center">
      {p.logo ? (
        <img
          src={p.logo}
          alt={p.name}
          className={`${p.wide ? "max-w-[92px]" : "max-w-[40px]"} max-h-7 w-auto object-contain`}
        />
      ) : (
        <span className="h-7 w-7 rounded-md bg-foreground/[0.06] border border-border/70 flex items-center justify-center font-heading text-[14px] text-muted-foreground">
          {p.name[0]}
        </span>
      )}
    </span>
    <span className="leading-tight">
      <span className="block font-heading text-[14px] tracking-[-0.2px] text-foreground">
        {p.name}
      </span>
      <span className="block font-mono-brand text-[9.5px] uppercase tracking-[0.08em] text-muted-foreground mt-0.5">
        {p.sub}
      </span>
    </span>
  </a>
);

const Panel = ({
  label,
  count,
  players,
  cols,
  className = "",
}: {
  label: string;
  count: number;
  players: Player[];
  cols: string;
  className?: string;
}) => (
  <div className={`rounded-xl border border-border bg-[hsl(0,0%,98.5%)] p-4 ${className}`}>
    <div className="flex items-baseline justify-between mb-3 px-1">
      <span className="font-mono-brand text-[11px] uppercase tracking-[0.16em] text-foreground font-semibold">
        {label}
      </span>
      <span className="font-mono-brand text-[10px] tracking-[0.1em] text-muted-foreground">
        {count}
      </span>
    </div>
    <div className={`grid ${cols} gap-2.5`}>
      {players.map((p) => (
        <Card key={p.name} p={p} />
      ))}
    </div>
  </div>
);

const BackgroundAgentMaxxing = () => {
  return (
    <SitePageLayout contentClassName="max-w-[1040px] mx-auto px-6 sm:px-10 pt-10 pb-[60px]">
      <SEO
        title="Background Agent Maxxing"
        description="The 2026 market map of background coding agents. Devin, Cursor, Replit, Ona, Ramp's Inspect, Stripe's Minions, Coinbase's Mux, Harvey's Spectre and more. Every one of them runs on the same thing: one isolated computer per agent. That layer is OpenComputer."
        path="/background-agents"
      />

      <FadeIn>
        <p className="font-mono-brand text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-5">
          The background agent market map &middot; 2026
        </p>
        <h1 className="font-heading text-[clamp(40px,7vw,72px)] leading-[0.98] tracking-[-2px] mb-5">
          Background Agent <span className="italic">Maxxing.</span>
        </h1>
        <p className="text-[18px] leading-[1.55] tracking-[-0.2px] max-w-[620px] text-muted-foreground mb-10">
          Every serious eng org now ships agents that write code while you
          sleep. Here is the entire field on one map. They all quietly run on
          the same thing.
        </p>
      </FadeIn>

      <FadeIn delay={0.08}>
        <div className="space-y-3.5">
          <Panel
            label="Off the shelf"
            count={offShelf.length}
            players={offShelf}
            cols="grid-cols-3 sm:grid-cols-4 lg:grid-cols-6"
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
            <Panel
              label="Open source"
              count={openSource.length}
              players={openSource}
              cols="grid-cols-2 sm:grid-cols-3"
            />
            <Panel
              label="Built in house"
              count={internal.length}
              players={internal}
              cols="grid-cols-2 sm:grid-cols-3"
            />
          </div>
        </div>
      </FadeIn>

      {/* The sly reveal: the foundation layer under the whole map. */}
      <FadeIn delay={0.12}>
        <div className="mt-3.5 rounded-xl bg-foreground text-background p-6 sm:p-8">
          <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-8">
            <div className="flex-1">
              <p className="font-mono-brand text-[10px] uppercase tracking-[0.18em] text-background/60 mb-2">
                The computer underneath every box above
              </p>
              <p className="font-heading text-[clamp(22px,3.2vw,30px)] leading-[1.2] tracking-[-0.6px]">
                One isolated machine per agent. That is the whole game, and that
                is OpenComputer.
              </p>
              <p className="text-[14px] leading-[1.65] text-background/70 mt-3 max-w-[520px]">
                A full Linux VM in one SDK call. Snapshot your repo, fork a fresh
                box per task in seconds, scale 1 to 16 GB so the agent never OOMs
                mid build. Ramp, Stripe and WorkOS each built this by hand. You
                do not have to.
              </p>
            </div>
            <div className="flex flex-col gap-2.5 shrink-0 md:w-[230px]">
              <a
                href="https://app.opencomputer.dev"
                className="flex items-center justify-between gap-3 text-[14px] font-medium px-5 py-3.5 rounded-md bg-background text-foreground hover:opacity-90 transition-opacity duration-150"
              >
                <span>Spin up your first VM</span>
                <span aria-hidden="true">&rarr;</span>
              </a>
              <a
                href="https://cal.com/team/digger/opencomputer-founder-chat"
                target="_blank"
                rel="noreferrer"
                className="text-center text-[14px] font-medium px-5 py-3.5 rounded-md border border-background/30 text-background hover:border-background/70 transition-colors duration-150"
              >
                Book the founders
              </a>
            </div>
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={0.16}>
        <p className="mt-6 text-center text-[12.5px] text-muted-foreground">
          Building one and not on here?{" "}
          <a
            href="https://cal.com/team/digger/opencomputer-founder-chat"
            target="_blank"
            rel="noreferrer"
            className="underline hover:text-foreground transition-colors"
          >
            Tell us
          </a>{" "}
          &middot; opencomputer.dev/background-agents
        </p>
      </FadeIn>
    </SitePageLayout>
  );
};

export default BackgroundAgentMaxxing;
