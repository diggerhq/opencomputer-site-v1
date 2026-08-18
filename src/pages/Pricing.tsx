import { useMemo, useState } from "react";
import SitePageLayout from "@/components/SitePageLayout";
import SEO from "@/components/SEO";
import FadeIn from "@/components/FadeIn";
import { Slider } from "@/components/ui/slider";

const APP_URL = "https://app.opencomputer.dev";
const DOCS_URL = "https://docs.opencomputer.dev/agents/overview";

/* ------------------------------ pricing model ------------------------------ */

const RATE_SANDBOX = 0.07; // $/GB-hour, bare sandbox
const RATE_AGENT = 0.08; // $/GB-hour, agent compute (bring-your-own-key)
const MANAGED_MARKUP = 0.2; // platform margin on managed tokens

const MODELS: Record<string, { label: string; in: number; out: number }> = {
  haiku: { label: "Claude Haiku 4.5", in: 1, out: 5 },
  sonnet: { label: "Claude Sonnet 4.6", in: 3, out: 15 },
  opus: { label: "Claude Opus 5", in: 5, out: 25 },
};

type Preset = {
  key: string;
  label: string;
  ram: number;
  min: number;
  runs: number;
  model: string;
  tin: number;
  tout: number;
};

const PRESETS: Preset[] = [
  { key: "pr", label: "PR reviewer", ram: 1, min: 2, runs: 200, model: "sonnet", tin: 30000, tout: 3000 },
  { key: "nightly", label: "Nightly data agent", ram: 4, min: 15, runs: 30, model: "sonnet", tin: 60000, tout: 8000 },
  { key: "support", label: "Support bot", ram: 1, min: 0.5, runs: 5000, model: "haiku", tin: 8000, tout: 1000 },
  { key: "coding", label: "Coding agent", ram: 8, min: 60, runs: 50, model: "opus", tin: 120000, tout: 20000 },
];

const AGENT_CODE = `import { useModel, useTool, useMcpServer } from "@opencomputer/agent";
import { openCleanupPullRequest } from "./tools/github.js";

export default function Agent() {
  useModel("anthropic/claude-sonnet-4.6");
  useMcpServer(unleashMcp);           // read flag state
  useTool(openCleanupPullRequest);    // one PR per stale flag
  return "Find stale Unleash flags in code, open a PR to remove each.";
}`;

const CONNECTION_CODE = `// tools/github.ts
export const githubPat = defineConnection({
  origin: "https://api.github.com",     // only ever here
  headers: { Authorization: bearer(useSecret("GITHUB_PAT")) },
});`;

const SCHEDULE_CODE = `// schedules/weekday-hygiene.ts
export default defineSchedule({
  cron: "0 9 * * 1-5",        // weekdays, 9am
  dispatch: { payload: { dryRun: true } },
});`;

const SANDBOX_CODE = `import { Sandbox } from "@opencomputer/sdk";

const box = await Sandbox.create();   // a full Linux microVM
await box.exec("your-harness --run"); // your loop, your rules
await box.checkpoint("ready");         // fork or restore anytime`;

const money = (x: number) =>
  x === 0 ? "$0" : x < 0.01 ? "<$0.01" : "$" + x.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const kfmt = (n: number) => (n >= 1000 ? (n % 1000 === 0 ? n / 1000 + "k" : (n / 1000).toFixed(1) + "k") : String(n));

/* ------------------------------ small building blocks ------------------------------ */

const Container = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`mx-auto max-w-[1080px] px-6 sm:px-10 ${className}`}>{children}</div>
);

const PriceCard = ({ name, price, desc }: { name: string; price: string; desc: string }) => (
  <div className="h-full p-6 rounded-xl border border-border bg-[hsl(0,0%,98.5%)]">
    <div className="flex items-baseline justify-between gap-3 mb-2">
      <h3 className="font-heading text-[20px] tracking-[-0.4px]">{name}</h3>
      <span className="font-mono-brand text-[13px] text-foreground whitespace-nowrap">{price}</span>
    </div>
    <p className="text-[15px] leading-[1.6] text-muted-foreground">{desc}</p>
  </div>
);

const CodeBlock = ({ code }: { code: string }) => (
  <pre className="rounded-xl border border-border bg-[hsl(0,0%,98.5%)] p-5 mt-4 overflow-x-auto font-mono-brand text-[12.5px] leading-[1.7] text-foreground whitespace-pre">
    <code>{code}</code>
  </pre>
);

const StepLabel = ({ children }: { children: React.ReactNode }) => (
  <p className="font-mono-brand text-[12px] uppercase tracking-[0.1em] text-muted-foreground mb-2">{children}</p>
);

const CopyCommand = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1400);
        } catch {
          /* clipboard unavailable */
        }
      }}
      className="inline-flex items-center gap-3 rounded-md border border-border bg-[hsl(0,0%,98.5%)] px-4 py-3 font-mono-brand text-[13px] text-foreground hover:border-foreground transition-colors"
    >
      <span className="text-muted-foreground">$</span>
      <span>{text}</span>
      <span className="text-muted-foreground text-[12px]">{copied ? "copied" : "copy"}</span>
    </button>
  );
};

/* ------------------------------ page ------------------------------ */

const Pricing = () => {
  const [ram, setRam] = useState(1);
  const [min, setMin] = useState(2);
  const [runs, setRuns] = useState(200);
  const [model, setModel] = useState("sonnet");
  const [tin, setTin] = useState(30000);
  const [tout, setTout] = useState(3000);
  const [active, setActive] = useState<string>("pr");

  const applyPreset = (p: Preset) => {
    setRam(p.ram);
    setMin(p.min);
    setRuns(p.runs);
    setModel(p.model);
    setTin(p.tin);
    setTout(p.tout);
    setActive(p.key);
  };

  const { managed, byok, sandbox, byokBreak, sbBreak } = useMemo(() => {
    const m = MODELS[model] ?? MODELS.sonnet;
    const gbHours = ram * (min / 60) * runs; // per month
    const tokens = ((tin * m.in + tout * m.out) / 1e6) * runs; // list $ per month
    const compAgent = gbHours * RATE_AGENT;
    const compSb = gbHours * RATE_SANDBOX;
    return {
      managed: tokens * (1 + MANAGED_MARKUP), // compute included
      byok: compAgent + tokens, // compute + your model bill
      sandbox: compSb, // compute only, tokens are yours
      byokBreak: `${money(compAgent)} compute + ${money(tokens)} model`,
      sbBreak: `${money(compSb)} compute · tokens are yours`,
    };
  }, [ram, min, runs, model, tin, tout]);

  const managedBest = managed <= byok;

  const results = [
    { t: "Managed agent", p: money(managed), b: "tokens only, compute included", best: managedBest },
    { t: "Your own key", p: money(byok), b: byokBreak, best: !managedBest },
    { t: "Bare sandbox", p: money(sandbox), b: sbBreak, best: false },
  ];

  const onManual = (setter: (v: number) => void) => (v: number) => {
    setter(v);
    setActive("");
  };

  return (
    <SitePageLayout>
      <SEO
        title="Serverless agents"
        description="Firebase for agents. Write an agent as a TypeScript function, deploy it live in seconds, and your keys never enter the runtime. Simple usage-based pricing with a live estimator."
        path="/pricing"
      />

      {/* hero */}
      <section className="border-b border-border">
        <Container className="py-16 sm:py-20">
          <FadeIn>
            <h1 className="font-heading text-[clamp(44px,5.6vw,68px)] leading-[1.04] tracking-[-2px] mb-5">
              Firebase for agents.
            </h1>
            <p className="text-[18px] leading-[1.6] text-muted-foreground max-w-[520px] mb-8">
              Write an agent as a TypeScript function, deploy it live in seconds.{" "}
              <span className="text-foreground font-medium">Your keys never enter the runtime.</span>
            </p>
            <div className="flex flex-wrap items-center gap-3 mb-8">
              <CopyCommand text="npm create @opencomputer/start@latest" />
              <a
                href={DOCS_URL}
                target="_blank"
                className="text-[15px] text-foreground border-b border-border hover:border-foreground pb-0.5 no-underline"
              >
                Docs →
              </a>
            </div>
            <p className="text-[15px] leading-[1.6] text-muted-foreground max-w-[560px] pt-6 border-t border-border">
              <span className="text-foreground font-medium">The example below</span> is one real
              agent: it finds stale Unleash feature flags still referenced in code and opens a
              cleanup pull request for each.
            </p>
          </FadeIn>
        </Container>
      </section>

      {/* agents: the example */}
      <section className="border-b border-border">
        <Container className="py-14">
          <FadeIn>
            <StepLabel>The agent is a function</StepLabel>
            <p className="text-[16px] leading-[1.7] text-muted-foreground max-w-[560px]">
              A model, the tools and MCP servers it can call, and its instructions.
            </p>
            <CodeBlock code={AGENT_CODE} />
          </FadeIn>

          <FadeIn>
            <div className="mt-12">
              <StepLabel>Keys it uses but never sees</StepLabel>
              <p className="text-[16px] leading-[1.7] text-muted-foreground max-w-[600px]">
                Each secret is bound to one origin and injected after the request leaves the
                sandbox. The agent can open a PR; it can't read the token, and can't send it
                anywhere else.
              </p>
              <CodeBlock code={CONNECTION_CODE} />
              <div className="rounded-xl bg-[#0b0b0a] p-5 mt-4 overflow-x-auto font-mono-brand text-[12.5px] leading-[1.7] whitespace-pre">
                <span className="text-[#c9c7c0]">POST /repos/acme/app/pulls  </span>
                <span className="text-[#6e6b61]">(open cleanup PR){"\n"}</span>
                <span className="text-[#6e6b61]">Authorization: Bearer </span>
                <span className="text-[#e5c07b]">••••••••</span>
              </div>
            </div>
          </FadeIn>

          <FadeIn>
            <div className="mt-12">
              <StepLabel>Deploy it, then leave it running</StepLabel>
              <p className="text-[16px] leading-[1.7] text-muted-foreground max-w-[560px]">
                Give it a schedule and it runs itself. Sessions, streaming, MCP, and Slack are handled.
              </p>
              <CodeBlock code={SCHEDULE_CODE} />
              <CodeBlock code={"$ opencomputer deploy\n✓ live · runs weekdays, opens PRs, never sees the token"} />
            </div>
          </FadeIn>
        </Container>
      </section>

      {/* sandboxes: drop a layer */}
      <section className="border-b border-border">
        <Container className="py-14">
          <FadeIn>
            <h2 className="font-heading text-[clamp(26px,3.4vw,36px)] leading-[1.2] tracking-[-0.8px] mb-3">
              Or drop a layer.
            </h2>
            <p className="text-[16px] leading-[1.7] text-muted-foreground max-w-[600px]">
              Agents run on OpenComputer sandboxes: full Linux microVMs with checkpoint, fork,
              and live resize. Bringing your own harness or runtime? Use the sandbox directly.
              Same compute, you own the loop.
            </p>

            <div className="grid gap-1.5 my-6 font-mono-brand text-[13px] max-w-[620px]">
              <div className="flex justify-between items-center rounded-lg border border-foreground bg-[hsl(0,0%,98.5%)] px-4 py-3">
                <span>Agents <span className="text-muted-foreground text-[11px]">managed</span></span>
                <span className="text-muted-foreground text-[11px]">egress · sessions · streaming · schedules</span>
              </div>
              <div className="flex justify-between items-center rounded-lg border border-border bg-[hsl(0,0%,98.5%)] px-4 py-3">
                <span>Sandboxes <span className="text-muted-foreground text-[11px]">bare</span></span>
                <span className="text-muted-foreground text-[11px]">microVM · checkpoint · fork · resize</span>
              </div>
              <div className="text-center text-muted-foreground text-[11px] tracking-wide pt-1">one compute, one bill</div>
            </div>

            <CodeBlock code={SANDBOX_CODE} />
            <p className="text-[16px] leading-[1.7] text-foreground max-w-[600px] mt-5">
              Bring your own VM if you want the control. Just don't hand-roll secret injection,
              sessions, and autoscaling in 2026. That's what the managed layer is for.
            </p>
          </FadeIn>
        </Container>
      </section>

      {/* the two blocks */}
      <section className="border-b border-border">
        <Container className="py-14">
          <FadeIn>
            <p className="font-mono-brand text-[12px] uppercase tracking-[0.1em] text-muted-foreground mb-5">
              Agents
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <PriceCard
                name="Managed tokens"
                price="tokens only"
                desc="We run the model. Pay for the tokens it uses, nothing else. No keys to manage."
              />
              <PriceCard
                name="Bring your own key"
                price="$0.08 / GB-hr"
                desc="Use your own model key and pay the provider directly. You pay us for compute, by the second."
              />
            </div>

            <p className="font-mono-brand text-[12px] uppercase tracking-[0.1em] text-muted-foreground mt-10 mb-5">
              Sandboxes
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <PriceCard
                name="microVM"
                price="$0.07 / GB-hr"
                desc="A full Linux microVM, billed by the second while running. 20 GB disk included."
              />
              <div className="h-full p-6 rounded-xl border border-dashed border-border flex items-center">
                <p className="text-[14px] leading-[1.6] text-muted-foreground">
                  Agents run on the same compute as bare sandboxes. Start managed,
                  drop a layer whenever you want your own harness. One meter, one bill.
                </p>
              </div>
            </div>
          </FadeIn>
        </Container>
      </section>

      {/* estimator */}
      <section className="border-b border-border">
        <Container className="py-14">
          <FadeIn>
            <h2 className="font-heading text-[clamp(26px,3.4vw,36px)] leading-[1.2] tracking-[-0.8px] mb-3">
              Estimate your cost
            </h2>
            <p className="text-[16px] leading-[1.7] text-muted-foreground max-w-[560px] mb-7">
              Pick a use case, or set your own. Compare running it as a managed
              agent, with your own key, or on a bare sandbox.
            </p>

            {/* presets */}
            <div className="flex flex-wrap gap-2 mb-8">
              {PRESETS.map((p) => (
                <button
                  key={p.key}
                  type="button"
                  onClick={() => applyPreset(p)}
                  className={[
                    "font-mono-brand text-[13px] rounded-full px-4 py-1.5 border transition-colors",
                    active === p.key
                      ? "bg-foreground text-background border-foreground"
                      : "bg-background text-muted-foreground border-border hover:text-foreground",
                  ].join(" ")}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* controls */}
            <div className="grid gap-x-8 gap-y-6 sm:grid-cols-3">
              <label className="flex flex-col gap-2.5">
                <span className="flex items-baseline justify-between font-mono-brand text-[12px] uppercase tracking-[0.04em] text-muted-foreground">
                  <span>Memory</span>
                  <span className="text-foreground normal-case">{ram} GB</span>
                </span>
                <Slider min={0.5} max={16} step={0.5} value={[ram]} onValueChange={([v]) => onManual(setRam)(v)} />
              </label>
              <label className="flex flex-col gap-2.5">
                <span className="flex items-baseline justify-between font-mono-brand text-[12px] uppercase tracking-[0.04em] text-muted-foreground">
                  <span>Minutes / run</span>
                  <span className="text-foreground normal-case">{min} min</span>
                </span>
                <Slider min={0.5} max={120} step={0.5} value={[min]} onValueChange={([v]) => onManual(setMin)(v)} />
              </label>
              <label className="flex flex-col gap-2.5">
                <span className="flex items-baseline justify-between font-mono-brand text-[12px] uppercase tracking-[0.04em] text-muted-foreground">
                  <span>Runs / month</span>
                  <span className="text-foreground normal-case">{runs.toLocaleString("en-US")}</span>
                </span>
                <Slider min={0} max={10000} step={10} value={[runs]} onValueChange={([v]) => onManual(setRuns)(v)} />
              </label>
              <label className="flex flex-col gap-2.5">
                <span className="font-mono-brand text-[12px] uppercase tracking-[0.04em] text-muted-foreground">Model</span>
                <select
                  value={model}
                  onChange={(e) => {
                    setModel(e.target.value);
                    setActive("");
                  }}
                  className="font-mono-brand text-[14px] rounded-md border border-border bg-background px-3 py-2 text-foreground"
                >
                  {Object.entries(MODELS).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-2.5">
                <span className="flex items-baseline justify-between font-mono-brand text-[12px] uppercase tracking-[0.04em] text-muted-foreground">
                  <span>Input tokens / run</span>
                  <span className="text-foreground normal-case">{kfmt(tin)}</span>
                </span>
                <Slider min={0} max={200000} step={1000} value={[tin]} onValueChange={([v]) => onManual(setTin)(v)} />
              </label>
              <label className="flex flex-col gap-2.5">
                <span className="flex items-baseline justify-between font-mono-brand text-[12px] uppercase tracking-[0.04em] text-muted-foreground">
                  <span>Output tokens / run</span>
                  <span className="text-foreground normal-case">{kfmt(tout)}</span>
                </span>
                <Slider min={0} max={40000} step={500} value={[tout]} onValueChange={([v]) => onManual(setTout)(v)} />
              </label>
            </div>

            {/* results */}
            <div className="grid gap-4 sm:grid-cols-3 mt-9">
              {results.map((r) => (
                <div
                  key={r.t}
                  className={[
                    "p-5 rounded-xl border bg-[hsl(0,0%,98.5%)]",
                    r.best ? "border-foreground" : "border-border",
                  ].join(" ")}
                >
                  <div className="font-mono-brand text-[12px] uppercase tracking-[0.06em] text-muted-foreground mb-1">
                    {r.t}
                  </div>
                  <div className="font-heading text-[30px] tracking-[-1px] tabular-nums leading-none mb-1.5">
                    {r.p}
                  </div>
                  <div className="text-[13px] text-muted-foreground">{r.b}</div>
                </div>
              ))}
            </div>

            <p className="font-mono-brand text-[12px] text-muted-foreground mt-4">
              Per month. Bare sandbox is compute only, tokens are yours. Agent model
              tokens at list rate; managed adds a small margin.
            </p>
          </FadeIn>
        </Container>
      </section>

      {/* cta */}
      <section>
        <Container className="py-16 text-center">
          <FadeIn>
            <h2 className="font-heading text-[clamp(26px,3.4vw,36px)] tracking-[-0.8px] mb-6">
              Only pay while it runs.
            </h2>
            <div className="flex flex-wrap justify-center items-center gap-3">
              <a
                href={APP_URL}
                className="inline-block text-[15px] font-medium px-9 py-4 rounded-md bg-foreground text-background hover:opacity-90 transition-opacity no-underline"
              >
                Try now →
              </a>
              <a
                href={DOCS_URL}
                target="_blank"
                className="inline-block text-[15px] font-medium px-7 py-4 rounded-md border border-border bg-background hover:border-foreground transition-colors no-underline"
              >
                Docs
              </a>
            </div>
          </FadeIn>
        </Container>
      </section>
    </SitePageLayout>
  );
};

export default Pricing;
