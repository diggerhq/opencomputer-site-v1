import { useState, type ReactNode } from "react";
import SEO from "@/components/SEO";

const DOCS_URL = "https://docs.opencomputer.dev/agents/overview";
const APP_URL = "https://app.opencomputer.dev";
const EXAMPLE_URL = "https://github.com/diggerhq/opencomputer-example-unleash";
const CAL_URL = "https://cal.com/team/digger/opencomputer-founder-chat";
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

/* ------------------------------ pricing tiers ------------------------------ */

type Tier = {
  name: string;
  price: string;
  period?: string;
  headline: string;
  points: string[];
  cta: string;
  href: string;
  highlight?: boolean;
  badge?: string;
};

const TIERS: Tier[] = [
  {
    name: "Free",
    price: "$0",
    headline: "$10 in credits to start",
    points: [
      "$10 of free credits to get going",
      "Compute billed at cost, $0.07 / GB-hour",
      "Usage-based once your credits run out",
    ],
    cta: "Start free",
    href: APP_URL,
  },
  {
    name: "Starter",
    price: "$20",
    period: "/mo",
    headline: "Tokens and compute included",
    points: [
      "Monthly tokens included",
      "Compute included",
      "Bring your own key, Codex, or Claude subscription",
      "Usage-based after your included tokens",
    ],
    cta: "Get Starter",
    href: APP_URL,
    highlight: true,
    badge: "Most popular",
  },
  {
    name: "Pro",
    price: "$200",
    period: "/mo",
    headline: "For heavier workloads",
    points: [
      "A larger monthly token allowance",
      "Compute included",
      "Usage-based after your included tokens",
    ],
    cta: "Get Pro",
    href: APP_URL,
  },
  {
    name: "Enterprise",
    price: "Custom",
    headline: "On your terms",
    points: [
      "Your own cloud or VPC, self-hosted connections",
      "Volume pricing and higher limits",
      "SSO, audit log, priority support",
    ],
    cta: "Talk to us",
    href: CAL_URL,
  },
];

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

const TierCard = ({ tier }: { tier: Tier }) => (
  <div
    className="flex flex-col rounded-[12px] border bg-white p-6"
    style={{ borderColor: tier.highlight ? SECRET : "hsl(var(--border))", borderWidth: tier.highlight ? 1.5 : 1 }}
  >
    <div className="mb-3 flex items-center justify-between">
      <span className="font-mono-brand text-[12px] uppercase tracking-[0.1em] text-muted-foreground">{tier.name}</span>
      {tier.badge ? (
        <span className="rounded-full px-2 py-0.5 font-mono-brand text-[10px] uppercase tracking-[0.08em] text-white" style={{ background: SECRET }}>
          {tier.badge}
        </span>
      ) : null}
    </div>
    <div className="mb-1 flex items-baseline gap-1">
      <span className="text-[42px] font-semibold leading-none tracking-[-0.03em]">{tier.price}</span>
      {tier.period ? <span className="text-[15px] text-muted-foreground">{tier.period}</span> : null}
    </div>
    <p className="mb-5 text-[14px] font-medium" style={{ color: SECRET }}>{tier.headline}</p>
    <ul className="flex flex-col gap-2.5 text-[14px] leading-[1.5] text-muted-foreground">
      {tier.points.map((pt, i) => (
        <li key={i} className="flex gap-2.5">
          <span aria-hidden style={{ color: SECRET }}>+</span>
          <span>{pt}</span>
        </li>
      ))}
    </ul>
    <a
      href={tier.href}
      className={
        "mt-6 rounded-md px-4 py-2.5 text-center text-[14px] font-medium no-underline transition-colors " +
        (tier.highlight
          ? "bg-foreground text-background hover:opacity-90"
          : "border border-border bg-background text-foreground hover:border-foreground")
      }
    >
      {tier.cta}
    </a>
  </div>
);

const navLink = "text-[15px] text-muted-foreground transition-colors hover:text-foreground no-underline";

/* ------------------------------ page ------------------------------ */

const Index = () => (
  <div className="min-h-screen bg-background text-foreground antialiased [scroll-behavior:smooth]">
    <SEO
      title="Firebase for agents"
      description="Write an agent as a TypeScript function, deploy it live in seconds, and your keys never enter the runtime. Simple subscription pricing with included tokens; bring your own key or drop to a bare sandbox."
      path="/"
    />

    <div className="mx-auto w-full max-w-[1440px] px-6 sm:px-10">
      {/* header */}
      <header className="flex flex-wrap items-center justify-between gap-3 py-6">
        <a href="/" className="inline-flex items-center no-underline" aria-label="OpenComputer">
          <img src="/logos/opencomputer.svg" alt="OpenComputer" className="h-5 w-auto" />
        </a>
        <nav className="flex items-center gap-5">
          <a href="#agents" className={navLink}>Agents</a>
          <a href="#sandboxes" className={navLink}>Sandboxes</a>
          <a href="#pricing" className={navLink}>Pricing</a>
          <a href={DOCS_URL} className={navLink}>Docs</a>
          <a
            href={APP_URL}
            className="rounded-md bg-foreground px-4 py-1.5 text-[14px] font-medium text-background no-underline transition-opacity hover:opacity-90"
          >
            Log in
          </a>
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
            Each secret is bound to one origin and injected after the request leaves the sandbox. The agent can open a
            PR; it can't read the token, and can't send it anywhere else.
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
        <p className="text-[16px] leading-[1.7] text-muted-foreground">
          A subscription with tokens and compute included. Pay usage-based once your included tokens run out.
        </p>

        <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TIERS.map((t) => (
            <TierCard key={t.name} tier={t} />
          ))}
        </div>

        <p className="mt-4 font-mono-brand text-[12px] leading-[1.6] text-muted-foreground">
          Compute is included on Starter and Pro. On the free tier, and for bare sandboxes, it's billed at cost. Bring
          your own model key, or a Codex / Claude subscription, on Starter.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <a
            href="#sandboxes"
            className="flex items-center justify-between rounded-[10px] border border-border bg-white px-4 py-3.5 no-underline transition-colors hover:border-foreground"
          >
            <span className="text-[15px] text-foreground">I just want compute</span>
            <span className="font-mono-brand text-[12px] text-muted-foreground">bare sandboxes, $0.07 / GB-hr →</span>
          </a>
          <a
            href={DOCS_URL}
            className="flex items-center justify-between rounded-[10px] border border-border bg-white px-4 py-3.5 no-underline transition-colors hover:border-foreground"
          >
            <span className="text-[15px] text-foreground">I'm happy to pay usage prices</span>
            <span className="font-mono-brand text-[12px] text-muted-foreground">skip the subscription →</span>
          </a>
        </div>
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

export default Index;
