import { useMemo, useState, type ReactNode } from "react";
import SEO from "@/components/SEO";
import { Slider } from "@/components/ui/slider";

const DOCS_URL = "https://docs.opencomputer.dev/agents/overview";
const EXAMPLE_URL = "https://github.com/diggerhq/opencomputer-example-unleash";
const SECRET = "#B4791F";

/* ------------------------------ code samples ------------------------------ */

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

/* ------------------------------ pricing model ------------------------------ */

const RATE_SANDBOX = 0.07;
const RATE_AGENT = 0.08;
const MANAGED_MARKUP = 0.2;

const MODELS: Record<string, { label: string; in: number; out: number }> = {
  haiku: { label: "Claude Haiku 4.5", in: 1, out: 5 },
  sonnet: { label: "Claude Sonnet 4.6", in: 3, out: 15 },
  opus: { label: "Claude Opus 5", in: 5, out: 25 },
};

type Preset = { key: string; label: string; ram: number; min: number; runs: number; model: string; tin: number; tout: number };
const PRESETS: Preset[] = [
  { key: "pr", label: "PR reviewer", ram: 1, min: 2, runs: 200, model: "sonnet", tin: 30000, tout: 3000 },
  { key: "nightly", label: "Nightly data agent", ram: 4, min: 15, runs: 30, model: "sonnet", tin: 60000, tout: 8000 },
  { key: "support", label: "Support bot", ram: 1, min: 0.5, runs: 5000, model: "haiku", tin: 8000, tout: 1000 },
  { key: "coding", label: "Coding agent", ram: 8, min: 60, runs: 50, model: "opus", tin: 120000, tout: 20000 },
];

const money = (x: number) =>
  x === 0 ? "$0" : x < 0.01 ? "<$0.01" : "$" + x.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const kfmt = (n: number) => (n >= 1000 ? (n % 1000 === 0 ? n / 1000 + "k" : (n / 1000).toFixed(1) + "k") : String(n));

/* ------------------------------ syntax highlight ------------------------------ */

const KW = new Set(["import", "from", "export", "default", "function", "const", "return", "await", "new"]);
const FN = new Set(["useModel", "useTool", "useMcpServer", "useSecret", "defineConnection", "defineSchedule", "bearer", "Agent", "Sandbox", "create", "exec", "checkpoint", "openCleanupPullRequest"]);

function hlLine(line: string, key: number): ReactNode {
  const ci = line.indexOf("//");
  let code = line;
  let tail: ReactNode = null;
  if (ci >= 0) {
    code = line.slice(0, ci);
    tail = <span className="italic text-muted-foreground">{line.slice(ci)}</span>;
  }
  const re = /("(?:[^"\\]|\\.)*")|([A-Za-z_$][\w$]*)|([^A-Za-z_$"]+)/g;
  const out: ReactNode[] = [];
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(code))) {
    if (m[1]) out.push(<span key={i++} className="text-[#7C3AED]">{m[1]}</span>);
    else if (m[2]) {
      const w = m[2];
      if (KW.has(w)) out.push(<span key={i++} className="text-[#2563EB]">{w}</span>);
      else if (FN.has(w)) out.push(<span key={i++} className="text-[#B45309]">{w}</span>);
      else out.push(<span key={i++}>{w}</span>);
    } else out.push(<span key={i++}>{m[3]}</span>);
  }
  return (
    <span key={key}>
      {out}
      {tail}
    </span>
  );
}

const Code = ({ code, dim = false }: { code: string; dim?: boolean }) => {
  const lines = code.split("\n");
  return (
    <pre className="mt-4 rounded-[10px] border border-border bg-white p-5 font-mono-brand text-[12.5px] leading-[1.7] text-foreground whitespace-pre-wrap [overflow-wrap:anywhere]">
      <code className={dim ? "text-muted-foreground" : undefined}>
        {dim
          ? code
          : lines.map((l, idx) => (
              <span key={idx}>
                {hlLine(l, idx)}
                {idx < lines.length - 1 ? "\n" : null}
              </span>
            ))}
      </code>
    </pre>
  );
};

/* ------------------------------ small blocks ------------------------------ */

const Label = ({ children }: { children: ReactNode }) => (
  <p className="font-mono-brand text-[12px] uppercase tracking-[0.1em] text-muted-foreground mb-2">{children}</p>
);

const PriceCard = ({ name, price, desc }: { name: string; price: string; desc: string }) => (
  <div className="h-full rounded-[10px] border border-border bg-white p-5">
    <div className="mb-2 flex items-baseline justify-between gap-3">
      <span className="text-[17px] font-semibold tracking-[-0.01em]">{name}</span>
      <span className="font-mono-brand text-[13px]" style={{ color: SECRET }}>{price}</span>
    </div>
    <p className="text-[14px] leading-[1.55] text-muted-foreground">{desc}</p>
  </div>
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
      className="inline-flex items-center gap-3 rounded-md border border-border bg-white px-4 py-3 font-mono-brand text-[13px] text-foreground transition-colors hover:border-foreground"
    >
      <span className="text-muted-foreground">$</span>
      <span>{text}</span>
      <span className="text-[12px] text-muted-foreground">{copied ? "copied" : "copy"}</span>
    </button>
  );
};

const Rung = ({ title, tag, meta, top }: { title: string; tag: string; meta: string; top?: boolean }) => (
  <div
    className="flex items-center justify-between rounded-lg border bg-white px-4 py-3"
    style={{ borderColor: top ? SECRET : "hsl(var(--border))" }}
  >
    <span>
      {title} <span className="text-[11px] text-muted-foreground">{tag}</span>
    </span>
    <span className="text-[11px] text-muted-foreground">{meta}</span>
  </div>
);

const navLink = "text-[15px] text-muted-foreground transition-colors hover:text-foreground no-underline";

/* ------------------------------ page ------------------------------ */

const Index = () => {
  const [ram, setRam] = useState(1);
  const [min, setMin] = useState(2);
  const [runs, setRuns] = useState(200);
  const [model, setModel] = useState("sonnet");
  const [tin, setTin] = useState(30000);
  const [tout, setTout] = useState(3000);
  const [active, setActive] = useState("pr");

  const applyPreset = (p: Preset) => {
    setRam(p.ram); setMin(p.min); setRuns(p.runs); setModel(p.model); setTin(p.tin); setTout(p.tout); setActive(p.key);
  };
  const manual = (setter: (v: number) => void) => (v: number) => { setter(v); setActive(""); };

  const { managed, byok, sandbox, byokBreak, sbBreak } = useMemo(() => {
    const mo = MODELS[model] ?? MODELS.sonnet;
    const gbHours = ram * (min / 60) * runs;
    const tokens = ((tin * mo.in + tout * mo.out) / 1e6) * runs;
    const compAgent = gbHours * RATE_AGENT;
    const compSb = gbHours * RATE_SANDBOX;
    return {
      managed: tokens * (1 + MANAGED_MARKUP),
      byok: compAgent + tokens,
      sandbox: compSb,
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

  const sliderField = (label: string, value: string, node: ReactNode) => (
    <label className="flex flex-col gap-2.5">
      <span className="flex items-baseline justify-between font-mono-brand text-[12px] uppercase tracking-[0.04em] text-muted-foreground">
        <span>{label}</span>
        <span className="normal-case text-foreground">{value}</span>
      </span>
      {node}
    </label>
  );

  return (
    <div className="min-h-screen bg-background text-foreground antialiased [scroll-behavior:smooth]">
      <SEO
        title="Firebase for agents"
        description="Write an agent as a TypeScript function, deploy it live in seconds, and your keys never enter the runtime. Serverless agents and sandboxes with simple usage-based pricing."
        path="/"
      />

      <div className="mx-auto w-full max-w-[1440px] px-6 sm:px-10">
        {/* header */}
        <header className="flex flex-wrap items-center justify-between gap-3 py-6">
          <a href="/" className="inline-flex items-center no-underline" aria-label="OpenComputer">
            <img src="/logos/opencomputer.svg" alt="OpenComputer" className="h-5 w-auto" />
          </a>
          <nav className="flex gap-5">
            <a href="#agents" className={navLink}>Agents</a>
            <a href="#sandboxes" className={navLink}>Sandboxes</a>
            <a href="#pricing" className={navLink}>Pricing</a>
            <a href={DOCS_URL} className={navLink}>Docs</a>
          </nav>
        </header>

        {/* hero */}
        <main className="pb-10 pt-14">
          <h1 className="mb-4 text-[clamp(2.4rem,8vw,3.6rem)] font-semibold leading-none tracking-[-0.04em] [text-wrap:balance]">
            Firebase for agents.
          </h1>
          <p className="mb-8 text-[1.15rem] leading-[1.5] text-muted-foreground">
            Write an agent as a TypeScript function, deploy it live in seconds.{" "}
            <span className="font-medium text-foreground">Your keys never enter the runtime.</span>
          </p>
          <div className="mb-8 flex flex-wrap items-center gap-3">
            <CopyCommand text="npm create @opencomputer/start@latest" />
            <a href={DOCS_URL} className="border-b border-border pb-0.5 text-[15px] text-foreground no-underline hover:border-foreground">
              Docs →
            </a>
          </div>
          <p className="border-t border-border pt-6 text-[15px] leading-[1.6] text-muted-foreground">
            <span className="font-medium text-foreground">The example below</span> is one real agent: it finds stale
            Unleash feature flags still referenced in code and opens a cleanup pull request for each.
          </p>
        </main>

        {/* agents example */}
        <section id="agents" className="scroll-mt-6 border-t border-border py-10">
          <Label>The agent is a function</Label>
          <p className="text-[16px] leading-[1.7] text-muted-foreground">
            A model, the tools and MCP servers it can call, and its instructions.
          </p>
          <Code code={AGENT_CODE} />

          <div className="mt-10">
            <Label>Keys it uses but never sees</Label>
            <p className="text-[16px] leading-[1.7] text-muted-foreground">
              Each secret is bound to one origin and injected after the request leaves the sandbox. The agent can open
              a PR; it can't read the token, and can't send it anywhere else.
            </p>
            <Code code={CONNECTION_CODE} />
            <div className="mt-4 overflow-x-auto whitespace-pre-wrap rounded-[10px] bg-[#0b0b0a] p-5 font-mono-brand text-[12.5px] leading-[1.7]">
              <span className="text-[#c9c7c0]">POST /repos/acme/app/pulls  </span>
              <span className="text-[#6e6b61]">(open cleanup PR){"\n"}</span>
              <span className="text-[#6e6b61]">Authorization: Bearer </span>
              <span className="text-[#e5c07b]">••••••••</span>
            </div>
          </div>

          <div className="mt-10">
            <Label>Deploy it, then leave it running</Label>
            <p className="text-[16px] leading-[1.7] text-muted-foreground">
              Give it a schedule and it runs itself. Sessions, streaming, MCP, and Slack are handled.
            </p>
            <Code code={SCHEDULE_CODE} />
            <Code dim code={"$ opencomputer deploy\n✓ live · runs weekdays, opens PRs, never sees the token"} />
          </div>
        </section>

        {/* sandboxes */}
        <section id="sandboxes" className="scroll-mt-6 border-t border-border py-10">
          <h2 className="mb-2 text-[1.5rem] font-semibold tracking-[-0.02em]">Or drop a layer.</h2>
          <p className="text-[16px] leading-[1.7] text-muted-foreground">
            Agents run on OpenComputer sandboxes: full Linux microVMs with checkpoint, fork, and live resize. Bringing
            your own harness or runtime? Use the sandbox directly. Same compute, you own the loop.
          </p>
          <div className="my-6 grid gap-1.5 font-mono-brand text-[13px]">
            <Rung top title="Agents" tag="managed" meta="egress · sessions · streaming · schedules" />
            <Rung title="Sandboxes" tag="bare" meta="microVM · checkpoint · fork · resize" />
            <div className="pt-1 text-center text-[11px] tracking-wide text-muted-foreground">one compute, one bill</div>
          </div>
          <Code code={SANDBOX_CODE} />
          <p className="mt-5 text-[16px] leading-[1.7] text-foreground">
            Bring your own VM if you want the control. Just don't hand-roll secret injection, sessions, and autoscaling
            in 2026. That's what the managed layer is for.
          </p>
        </section>

        {/* pricing */}
        <section id="pricing" className="scroll-mt-6 border-t border-border py-10">
          <h2 className="mb-2 text-[1.5rem] font-semibold tracking-[-0.02em]">Pricing</h2>
          <p className="text-[16px] leading-[1.7] text-muted-foreground">You pay for what runs. No seats, no tiers.</p>

          <p className="mb-3 mt-7 font-mono-brand text-[12px] uppercase tracking-[0.1em] text-muted-foreground">Agents</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <PriceCard name="Managed tokens" price="tokens only" desc="We run the model. Pay for the tokens it uses, nothing else. No keys to manage." />
            <PriceCard name="Bring your own key" price="$0.08 / GB-hr" desc="Use your own model key and pay the provider directly. You pay us for compute, by the second." />
          </div>

          <p className="mb-3 mt-8 font-mono-brand text-[12px] uppercase tracking-[0.1em] text-muted-foreground">Sandboxes</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <PriceCard name="microVM" price="$0.07 / GB-hr" desc="A full Linux microVM, billed by the second while running. 20 GB disk included." />
            <div className="flex h-full items-center rounded-[10px] border border-dashed border-border p-5">
              <p className="text-[14px] leading-[1.55] text-muted-foreground">
                Compute is billed per GB-hour of memory, by the second; CPU scales with it. Agents run on the same
                compute, so either way you only pay while it runs.
              </p>
            </div>
          </div>

          {/* estimator */}
          <p className="mb-3 mt-8 font-mono-brand text-[12px] uppercase tracking-[0.1em] text-muted-foreground">Estimate your cost</p>
          <p className="mb-6 text-[16px] leading-[1.7] text-muted-foreground">
            Pick a use case, or set your own. Compare running it as a managed agent, with your own key, or on a bare sandbox.
          </p>

          <div className="mb-7 flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.key}
                type="button"
                onClick={() => applyPreset(p)}
                className="rounded-full border px-4 py-1.5 font-mono-brand text-[13px] transition-colors"
                style={
                  active === p.key
                    ? { background: "hsl(var(--foreground))", color: "hsl(var(--background))", borderColor: "hsl(var(--foreground))" }
                    : { background: "transparent", borderColor: "hsl(var(--border))" }
                }
              >
                <span className={active === p.key ? "" : "text-muted-foreground"}>{p.label}</span>
              </button>
            ))}
          </div>

          <div className="grid gap-x-8 gap-y-6 sm:grid-cols-3">
            {sliderField("Memory", `${ram} GB`, <Slider min={0.5} max={16} step={0.5} value={[ram]} onValueChange={([v]) => manual(setRam)(v)} />)}
            {sliderField("Minutes / run", `${min} min`, <Slider min={0.5} max={120} step={0.5} value={[min]} onValueChange={([v]) => manual(setMin)(v)} />)}
            {sliderField("Runs / month", runs.toLocaleString("en-US"), <Slider min={0} max={10000} step={10} value={[runs]} onValueChange={([v]) => manual(setRuns)(v)} />)}
            <label className="flex flex-col gap-2.5">
              <span className="font-mono-brand text-[12px] uppercase tracking-[0.04em] text-muted-foreground">Model</span>
              <select
                value={model}
                onChange={(e) => { setModel(e.target.value); setActive(""); }}
                className="rounded-md border border-border bg-white px-3 py-2 font-mono-brand text-[14px] text-foreground"
              >
                {Object.entries(MODELS).map(([k, v]) => (
                  <option key={k} value={k}>{v.label}</option>
                ))}
              </select>
            </label>
            {sliderField("Input tokens / run", kfmt(tin), <Slider min={0} max={200000} step={1000} value={[tin]} onValueChange={([v]) => manual(setTin)(v)} />)}
            {sliderField("Output tokens / run", kfmt(tout), <Slider min={0} max={40000} step={500} value={[tout]} onValueChange={([v]) => manual(setTout)(v)} />)}
          </div>

          <div className="mt-9 grid gap-3 sm:grid-cols-3">
            {results.map((r) => (
              <div
                key={r.t}
                className="rounded-[10px] border bg-white p-5"
                style={{ borderColor: r.best ? SECRET : "hsl(var(--border))" }}
              >
                <div className="mb-1 font-mono-brand text-[12px] uppercase tracking-[0.06em] text-muted-foreground">{r.t}</div>
                <div className="mb-1.5 text-[30px] font-semibold leading-none tracking-[-0.03em] tabular-nums">{r.p}</div>
                <div className="text-[13px] text-muted-foreground">{r.b}</div>
              </div>
            ))}
          </div>
          <p className="mt-4 font-mono-brand text-[12px] text-muted-foreground">
            Per month. Bare sandbox is compute only, tokens are yours. Agent model tokens at list rate; managed adds a small margin.
          </p>
        </section>

        {/* footer */}
        <footer className="flex flex-wrap justify-between gap-4 border-t border-border py-7 text-[14px] text-muted-foreground">
          <span>OpenComputer</span>
          <span className="flex flex-wrap gap-5">
            <a href="#agents" className="text-muted-foreground no-underline hover:text-foreground">Agents</a>
            <a href="#sandboxes" className="text-muted-foreground no-underline hover:text-foreground">Sandboxes</a>
            <a href="#pricing" className="text-muted-foreground no-underline hover:text-foreground">Pricing</a>
            <a href={DOCS_URL} className="text-muted-foreground no-underline hover:text-foreground">Docs</a>
            <a href={EXAMPLE_URL} className="text-muted-foreground no-underline hover:text-foreground">Example</a>
          </span>
        </footer>
      </div>
    </div>
  );
};

export default Index;
