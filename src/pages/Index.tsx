import { useState, type ReactNode } from "react";
import { Check } from "lucide-react";
import SEO from "@/components/SEO";

const DOCS_URL = "https://docs.opencomputer.dev/agents/overview";
const APP_URL = "https://app.opencomputer.dev";
const EXAMPLE_URL = "https://github.com/diggerhq/opencomputer-example-unleash";
const CAL_URL = "https://cal.com/team/digger/opencomputer-founder-chat";
const AMBER = "#B4791F";

/* ------------------------------ code samples ------------------------------ */

const AGENT_CODE = `import { useModel, useTool, useMcpServer } from "@opencomputer/agent";
import { openCleanupPullRequest } from "./tools/github.js";

export default function Agent() {
  useModel("anthropic/claude-sonnet-4.6");
  useMcpServer(unleashMcp);           // read flag state
  useTool(openCleanupPullRequest);    // one PR per stale flag
  return "Find stale flags in code, open a PR to remove each.";
}`;

const CONNECTION_CODE = `export const githubPat = defineConnection({
  origin: "https://api.github.com",     // only ever here
  headers: { Authorization: bearer(useSecret("GITHUB_PAT")) },
});`;

const SCHEDULE_CODE = `export default defineSchedule({
  cron: "0 9 * * 1-5",        // weekdays, 9am
  dispatch: { payload: { dryRun: true } },
});`;

const SANDBOX_CODE = `const box = await Sandbox.create();   // a full Linux microVM
await box.exec("your-harness --run"); // your loop, your rules
await box.checkpoint("ready");         // fork or restore anytime`;

/* ------------------------------ syntax highlight ------------------------------ */

const KW = new Set(["import", "from", "export", "default", "function", "const", "return", "await", "new"]);
const FN = new Set(["useModel", "useTool", "useMcpServer", "useSecret", "defineConnection", "defineSchedule", "bearer", "Agent", "Sandbox", "create", "exec", "checkpoint", "openCleanupPullRequest"]);
const C_KW = "#3B5BDB";
const C_STR = "#2E7D6B";
const C_FN = "#A2662B";

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
    if (m[1]) out.push(<span key={i++} style={{ color: C_STR }}>{m[1]}</span>);
    else if (m[2]) {
      const w = m[2];
      if (KW.has(w)) out.push(<span key={i++} style={{ color: C_KW }}>{w}</span>);
      else if (FN.has(w)) out.push(<span key={i++} style={{ color: C_FN }}>{w}</span>);
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

/* ------------------------------ building blocks ------------------------------ */

const Eyebrow = ({ children }: { children: ReactNode }) => (
  <p className="font-mono-brand text-[11px] uppercase tracking-[0.16em] text-muted-foreground">{children}</p>
);

const WindowChrome = ({ file, tone = "light", children }: { file?: string; tone?: "light" | "dark"; children: ReactNode }) => {
  const dark = tone === "dark";
  return (
    <div className={"overflow-hidden rounded-xl border " + (dark ? "border-[#242424] bg-[#0c0c0b]" : "border-border bg-white shadow-[0_12px_28px_-22px_rgba(0,0,0,0.28)]")}>
      <div className={"flex items-center gap-2 border-b px-4 py-2.5 " + (dark ? "border-[#242424]" : "border-border")}>
        <span className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <span key={i} className="h-2.5 w-2.5 rounded-full" style={{ background: dark ? "#2a2a28" : "#e2ded2" }} />
          ))}
        </span>
        {file ? <span className={"ml-1 font-mono-brand text-[11px] " + (dark ? "text-[#7d7d78]" : "text-muted-foreground")}>{file}</span> : null}
      </div>
      {children}
    </div>
  );
};

const Code = ({ code, file, tone = "light", dim = false }: { code: string; file?: string; tone?: "light" | "dark"; dim?: boolean }) => {
  const lines = code.split("\n");
  return (
    <WindowChrome file={file} tone={tone}>
      <pre className={"overflow-x-auto whitespace-pre-wrap [overflow-wrap:anywhere] px-5 py-4 font-mono-brand text-[12.5px] leading-[1.75] " + (tone === "dark" ? "text-[#c9c7c0]" : "text-foreground")}>
        <code className={dim ? "text-muted-foreground" : undefined}>
          {dim || tone === "dark"
            ? code
            : lines.map((l, idx) => (
                <span key={idx}>
                  {hlLine(l, idx)}
                  {idx < lines.length - 1 ? "\n" : null}
                </span>
              ))}
        </code>
      </pre>
    </WindowChrome>
  );
};

const Section = ({ id, eyebrow, title, children }: { id?: string; eyebrow?: string; title: string; children: ReactNode }) => (
  <section id={id} className="scroll-mt-8 border-t border-border py-16 lg:py-24">
    <div className="grid gap-8 lg:grid-cols-[minmax(0,236px)_minmax(0,1fr)] lg:gap-20">
      <div className="self-start lg:sticky lg:top-10">
        {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
        <h2 className={(eyebrow ? "mt-3 " : "") + "whitespace-pre-line font-mono-brand text-[1.7rem] font-medium leading-[1.1] tracking-[-0.02em] text-foreground"}>{title}</h2>
      </div>
      <div className="max-w-[660px]">{children}</div>
    </div>
  </section>
);

const StepLabel = ({ children }: { children: ReactNode }) => (
  <p className="font-mono-brand text-[11px] uppercase tracking-[0.14em] text-foreground">{children}</p>
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
      className="group inline-flex items-center gap-3 rounded-lg border border-border bg-white px-4 py-3 font-mono-brand text-[13px] text-foreground transition-colors hover:border-foreground"
    >
      <span className="text-muted-foreground">$</span>
      <span>{text}</span>
      <span className="text-[11px] uppercase tracking-wide text-muted-foreground transition-colors group-hover:text-foreground">{copied ? "copied" : "copy"}</span>
    </button>
  );
};

/* two-layer isometric cube — Agents layer stacked on the Sandboxes layer */
type P = [number, number];
const isoSlab = (cx: number, topY: number, X: number, Y: number, H: number) => {
  const T: P = [cx, topY], R: P = [cx + X, topY + Y], B: P = [cx, topY + 2 * Y], L: P = [cx - X, topY + Y];
  const d = ([x, y]: P): P => [x, y + H];
  const lerp = (a: P, b: P, t: number): P => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
  const lines: [P, P][] = [];
  for (const t of [1 / 3, 2 / 3]) {
    lines.push([lerp(T, L, t), lerp(R, B, t)]);
    lines.push([lerp(T, R, t), lerp(L, B, t)]);
  }
  return { top: [T, R, B, L] as P[], left: [L, B, d(B), d(L)] as P[], right: [R, B, d(B), d(R)] as P[], lines };
};
const pts = (arr: P[]) => arr.map((p) => p.join(",")).join(" ");

type Faces = { top: string; left: string; right: string; stroke: string; grid: string };
const NEUTRAL: Faces = { top: "#efeadd", left: "#d6d0c0", right: "#e4dfd0", stroke: "#c9c3b2", grid: "#dbd5c5" };
const AMBERF: Faces = { top: "#f5e6ca", left: "#cd983c", right: "#e6bd77", stroke: "#c59640", grid: "#e3cb92" };

const Slab = ({ s, c }: { s: ReturnType<typeof isoSlab>; c: Faces }) => (
  <g>
    <polygon points={pts(s.left)} fill={c.left} stroke={c.stroke} strokeWidth={1} strokeLinejoin="round" />
    <polygon points={pts(s.right)} fill={c.right} stroke={c.stroke} strokeWidth={1} strokeLinejoin="round" />
    <polygon points={pts(s.top)} fill={c.top} stroke={c.stroke} strokeWidth={1} strokeLinejoin="round" />
    {s.lines.map((ln, i) => (
      <line key={i} x1={ln[0][0]} y1={ln[0][1]} x2={ln[1][0]} y2={ln[1][1]} stroke={c.grid} strokeWidth={1} />
    ))}
  </g>
);

const LayerCube = () => {
  const X = 62, Y = 31, H = 27, cx = 78;
  const bottom = isoSlab(cx, 96, X, Y, H);
  const top = isoSlab(cx, 50, X, Y, H);
  return (
    <svg width="156" height="192" viewBox="0 0 156 192" className="shrink-0" role="img" aria-label="Agents layer stacked on the Sandboxes layer">
      <Slab s={bottom} c={NEUTRAL} />
      <Slab s={top} c={AMBERF} />
    </svg>
  );
};

const Swatch = ({ c }: { c: Faces }) => (
  <span className="inline-block h-3 w-3 rounded-[3px]" style={{ background: c.right, border: `1px solid ${c.stroke}` }} />
);

type Tier = {
  name: string;
  price: string;
  period?: string;
  note: string;
  points: string[];
  cta: string;
  href: string;
  highlight?: boolean;
  badge?: string;
};

const TIERS: Tier[] = [
  {
    name: "PAYG",
    price: "Usage",
    note: "Pay as you go",
    points: ["No monthly commitment", "Tokens and compute at usage rates", "Scale to zero when idle"],
    cta: "Start",
    href: APP_URL,
  },
  {
    name: "10×",
    price: "$20",
    period: "/mo",
    note: "Tokens and compute included",
    points: ["Monthly tokens included", "Compute included", "Bring your own key, Codex, or Claude subscription", "Overage billed as PAYG"],
    cta: "Get 10×",
    href: APP_URL,
    highlight: true,
    badge: "Popular",
  },
  {
    name: "20×",
    price: "$200",
    period: "/mo",
    note: "For heavier workloads",
    points: ["A larger monthly allowance", "Compute included", "Overage billed as PAYG"],
    cta: "Get 20×",
    href: APP_URL,
  },
  {
    name: "Enterprise",
    price: "Custom",
    note: "On your terms",
    points: ["Your own cloud or VPC, self-hosted connections", "Volume pricing and higher limits", "SSO, audit log, priority support"],
    cta: "Talk to us",
    href: CAL_URL,
  },
];

const TierCard = ({ tier }: { tier: Tier }) => (
  <div className={"flex flex-col rounded-xl border bg-white p-6 " + (tier.highlight ? "border-foreground" : "border-border")}>
    <div className="mb-4 flex items-center justify-between">
      <span className="font-mono-brand text-[12px] uppercase tracking-[0.12em] text-muted-foreground">{tier.name}</span>
      {tier.badge ? (
        <span className="rounded-full px-2.5 py-0.5 font-mono-brand text-[10px] uppercase tracking-[0.1em] text-white" style={{ background: AMBER }}>
          {tier.badge}
        </span>
      ) : null}
    </div>
    <div className="flex items-baseline gap-1">
      <span className="text-[38px] font-semibold leading-none tracking-[-0.03em]">{tier.price}</span>
      {tier.period ? <span className="font-mono-brand text-[14px] text-muted-foreground">{tier.period}</span> : null}
    </div>
    <p className="mt-2 text-[13.5px] text-muted-foreground">{tier.note}</p>
    <ul className="mt-5 flex flex-1 flex-col gap-3 text-[14px] leading-[1.45] text-foreground/85">
      {tier.points.map((pt, i) => (
        <li key={i} className="flex gap-2.5">
          <Check size={15} strokeWidth={2.25} className="mt-0.5 shrink-0 text-muted-foreground" />
          <span>{pt}</span>
        </li>
      ))}
    </ul>
    <a
      href={tier.href}
      className={
        "mt-7 rounded-lg px-4 py-2.5 text-center text-[14px] font-medium no-underline transition-colors " +
        (tier.highlight
          ? "bg-foreground text-background hover:opacity-90"
          : "border border-border bg-background text-foreground hover:border-foreground")
      }
    >
      {tier.cta}
    </a>
  </div>
);

const navLink = "text-[14px] text-muted-foreground transition-colors hover:text-foreground no-underline";

/* ------------------------------ page ------------------------------ */

const Index = () => (
  <div className="min-h-screen bg-background text-foreground antialiased [scroll-behavior:smooth]">
    <SEO
      title="Firebase for agents"
      description="Write an agent as a TypeScript function, deploy it live in seconds, and your keys never enter the runtime. Serverless agents and sandboxes with simple usage-based pricing."
      path="/"
    />

    <div className="mx-auto w-full max-w-[1200px] px-6 sm:px-10">
      {/* header */}
      <header className="flex flex-wrap items-center justify-between gap-3 py-6">
        <a href="/" className="inline-flex items-center no-underline" aria-label="OpenComputer">
          <img src="/logos/opencomputer.svg" alt="OpenComputer" className="h-5 w-auto" />
        </a>
        <nav className="flex items-center gap-6">
          <a href="#agents" className={navLink}>Agents</a>
          <a href="#sandboxes" className={navLink}>Sandboxes</a>
          <a href="#pricing" className={navLink}>Pricing</a>
          <a href={DOCS_URL} className={navLink}>Docs</a>
          <a
            href={APP_URL}
            className="rounded-lg bg-foreground px-4 py-1.5 text-[14px] font-medium text-background no-underline transition-opacity hover:opacity-90"
          >
            Log in
          </a>
        </nav>
      </header>

      {/* hero — headline left, the agent (the thesis) right */}
      <section className="grid items-center gap-12 pb-16 pt-12 lg:grid-cols-2 lg:gap-16 lg:pb-24 lg:pt-16">
        <div>
          <h1 className="font-mono-brand text-[clamp(2.2rem,4.6vw,3.3rem)] font-medium leading-[1.04] tracking-[-0.035em]">
            Firebase for agents.
          </h1>
          <p className="mt-5 max-w-[420px] text-[1.12rem] leading-[1.5] text-muted-foreground">
            Write an agent as a TypeScript function, deploy it live in seconds.{" "}
            <span className="font-medium text-foreground">Your keys never enter the runtime.</span>
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <CopyCommand text="npm create @opencomputer/start@latest" />
            <a href={DOCS_URL} className="border-b border-border pb-0.5 text-[15px] text-foreground no-underline hover:border-foreground">
              Read the docs →
            </a>
          </div>
        </div>
        <div className="lg:pl-4">
          <Code file="agent.ts" code={AGENT_CODE} />
          <p className="mt-3 pl-1 text-[13px] text-muted-foreground">
            A real agent: it finds stale feature flags still referenced in code and opens a cleanup PR for each.
          </p>
        </div>
      </section>

      {/* agents */}
      <Section id="agents" eyebrow="Managed" title={"Batteries\nincluded."}>
        <div>
          <StepLabel>Keys it uses but never sees</StepLabel>
          <p className="mt-2.5 text-[16px] leading-[1.65] text-muted-foreground">
            Each secret is bound to one origin and injected after the request leaves the sandbox. The agent can open a
            PR; it can't read the token, and can't send it anywhere else.
          </p>
          <div className="mt-4">
            <Code file="tools/github.ts" code={CONNECTION_CODE} />
          </div>
          <div className="mt-3">
            <WindowChrome file="egress" tone="dark">
              <pre className="overflow-x-auto whitespace-pre-wrap px-5 py-4 font-mono-brand text-[12.5px] leading-[1.75]">
                <span className="text-[#c9c7c0]">POST /repos/acme/app/pulls  </span>
                <span className="text-[#6e6b61]">(open cleanup PR){"\n"}</span>
                <span className="text-[#6e6b61]">Authorization: Bearer </span>
                <span style={{ color: "#e5c07b" }}>••••••••</span>
              </pre>
            </WindowChrome>
          </div>
        </div>

        <div className="mt-12">
          <StepLabel>Deploy it, then leave it running</StepLabel>
          <p className="mt-2.5 text-[16px] leading-[1.65] text-muted-foreground">
            Give it a schedule and it runs itself. Sessions, streaming, MCP, and Slack are handled.
          </p>
          <div className="mt-4">
            <Code file="schedules/weekday-hygiene.ts" code={SCHEDULE_CODE} />
          </div>
          <div className="mt-3">
            <Code tone="dark" dim file="terminal" code={"$ opencomputer deploy\n✓ live · runs weekdays, opens PRs, never sees the token"} />
          </div>
        </div>
      </Section>

      {/* sandboxes */}
      <Section id="sandboxes" title={"Or drop\na layer."}>
        <p className="text-[16px] leading-[1.65] text-muted-foreground">
          Agents run on OpenComputer sandboxes: full Linux microVMs with checkpoint, fork, and live resize. Bringing
          your own harness or runtime? Use the sandbox directly. Same compute, you own the loop.
        </p>
        <div className="my-8 flex flex-col items-center gap-7 rounded-xl border border-border bg-white px-6 py-7 sm:flex-row sm:gap-9">
          <LayerCube />
          <div className="flex flex-1 flex-col gap-4">
            <div>
              <div className="flex items-center gap-2.5 font-mono-brand text-[14px]">
                <Swatch c={AMBERF} /> Agents <span className="text-[11px] uppercase tracking-wide text-muted-foreground">managed</span>
              </div>
              <div className="mt-1 pl-[22px] font-mono-brand text-[12px] text-muted-foreground">egress · sessions · streaming · schedules</div>
            </div>
            <div>
              <div className="flex items-center gap-2.5 font-mono-brand text-[14px]">
                <Swatch c={NEUTRAL} /> Sandboxes
              </div>
              <div className="mt-1 pl-[22px] font-mono-brand text-[12px] text-muted-foreground">microVM · checkpoint · fork · resize</div>
            </div>
            <div className="border-t border-border pt-3 font-mono-brand text-[11px] uppercase tracking-[0.14em] text-muted-foreground">one compute, one bill</div>
          </div>
        </div>
        <Code file="sandbox.ts" code={SANDBOX_CODE} />
      </Section>

      {/* pricing — full width */}
      <section id="pricing" className="scroll-mt-8 border-t border-border py-16 lg:py-24">
        <div className="max-w-[620px]">
          <Eyebrow>Pricing</Eyebrow>
          <h2 className="mt-3 font-mono-brand text-[1.7rem] font-medium leading-[1.1] tracking-[-0.02em]">Pay for what runs.</h2>
          <p className="mt-4 text-[16px] leading-[1.65] text-muted-foreground">
            Start with $10 in credits. After that, stay on pay-as-you-go or pick a plan for included tokens and
            compute. Overage is billed as PAYG.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TIERS.map((t) => (
            <TierCard key={t.name} tier={t} />
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-[640px] font-mono-brand text-[11.5px] leading-[1.7] text-muted-foreground">
            Compute is included on the 10× and 20× plans. On PAYG, and for bare sandboxes, it's billed at cost. Bring
            your own key, or a Codex / Claude subscription, on the 10× plan.
          </p>
          <a href="#sandboxes" className="shrink-0 font-mono-brand text-[13px] text-foreground no-underline">
            <span className="border-b border-border pb-0.5 hover:border-foreground">I just want compute →</span>
          </a>
        </div>
      </section>

      {/* footer */}
      <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-border py-8 text-[14px] text-muted-foreground">
        <img src="/logos/opencomputer.svg" alt="OpenComputer" className="h-4 w-auto opacity-70" />
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

export default Index;
