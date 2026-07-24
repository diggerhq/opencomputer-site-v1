import { useEffect, useRef, useState } from "react";
import FadeIn from "@/components/FadeIn";
import SEO from "@/components/SEO";
import SitePageLayout from "@/components/SitePageLayout";

const AGENT_NAMES = ["Claude Code", "Codex", "opencode", "Cursor"];
const BLANK = "____________";

const buildPrompt = (task: string) => `Set up OpenComputer and deploy my first agent.

1. Install the CLI:
   curl -fsSL https://raw.githubusercontent.com/diggerhq/opencomputer/main/scripts/install.sh | bash
2. Open https://app.opencomputer.dev so I can create an API key,
   then set it with: oc config set api-key <key>
3. Run \`oc agent init\`, write prompt.md for an agent that ${task || BLANK},
   then run \`oc agent deploy\`.
4. Smoke-test it with \`oc agent invoke\` and give me the live agent URL
   and the dashboard link.`;

const facts = [
  {
    title: "Durable sessions",
    description: "Agents that survive restarts. Follow them live, steer them mid-run.",
  },
  {
    title: "oc agent deploy",
    description: "A prompt and a manifest is a deployable agent. Revisions, rollbacks, schedules.",
  },
  {
    title: "Agent URLs",
    description: "Every agent gets a permanent HTTP address. Slack, hooks, cron included.",
  },
];

const AgentDeploy = () => {
  const [task, setTask] = useState("");
  const [copied, setCopied] = useState(false);
  const [nameIndex, setNameIndex] = useState(0);
  const copyTimer = useRef<number>();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(
      () => setNameIndex((i) => (i + 1) % AGENT_NAMES.length),
      2400,
    );
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => () => window.clearTimeout(copyTimer.current), []);

  const cleanTask = task.trim().replace(/[.\s]+$/, "");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(buildPrompt(cleanTask));
      setCopied(true);
      window.clearTimeout(copyTimer.current);
      copyTimer.current = window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable; leave button label unchanged */
    }
  };

  return (
    <SitePageLayout>
      <SEO
        title="Deploy a managed agent"
        description="The easiest way to deploy a managed agent. Say what your agent should do, paste one prompt into your coding agent, get a live agent URL."
        path="/agentdeploy"
      />

      <FadeIn>
        <h1 className="font-heading text-[clamp(42px,6vw,64px)] leading-[1.15] tracking-[-1.5px] mb-7">
          The easiest way to deploy a <em>managed agent</em>.
        </h1>
      </FadeIn>

      <FadeIn delay={0.08}>
        <p className="text-[17px] leading-[1.75] tracking-[-0.1px] max-w-[620px] mb-12">
          Always on, steerable mid-run, permanent URL. No infrastructure. Say
          what your agent should do, then paste the prompt into your coding
          agent.
        </p>
      </FadeIn>

      <FadeIn delay={0.12}>
        <div className="mb-9 max-w-[620px]">
          <label
            htmlFor="agent-task"
            className="block font-mono-brand text-[11px] uppercase tracking-[0.15em] text-foreground font-semibold mb-3"
          >
            What should your agent do?
          </label>
          <input
            id="agent-task"
            type="text"
            autoComplete="off"
            spellCheck={false}
            placeholder="triage new GitHub issues and open fix PRs"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            className="w-full font-mono-brand text-[15px] text-foreground bg-secondary border border-border rounded-md px-[18px] py-[14px] placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors"
          />
        </div>
      </FadeIn>

      <FadeIn delay={0.16}>
        <div className="mb-5">
          <div className="flex items-center justify-between mb-3">
            <p className="font-mono-brand text-[11px] uppercase tracking-[0.15em] text-foreground font-semibold">
              Deploy one — paste into {AGENT_NAMES[nameIndex]}
            </p>
            <button
              type="button"
              onClick={handleCopy}
              aria-label="Copy the prompt"
              className="font-mono-brand text-[11px] uppercase tracking-[0.15em] font-semibold text-foreground bg-transparent border border-foreground rounded-md px-[14px] py-[7px] cursor-pointer hover:bg-foreground hover:text-background focus-visible:bg-foreground focus-visible:text-background transition-colors"
            >
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <div className="bg-foreground text-background rounded-md px-8 py-7 overflow-x-auto">
            <pre className="font-mono-brand text-[13px] leading-[1.75] whitespace-pre-wrap">
              {`Set up OpenComputer and deploy my first agent.

1. Install the CLI:
   curl -fsSL https://raw.githubusercontent.com/diggerhq/opencomputer/main/scripts/install.sh | bash
2. Open https://app.opencomputer.dev so I can create an API key,
   then set it with: oc config set api-key <key>
3. Run \`oc agent init\`, write prompt.md for an agent that `}
              <span className="italic border-b border-background/45">
                {cleanTask || BLANK}
              </span>
              {`,
   then run \`oc agent deploy\`.
4. Smoke-test it with \`oc agent invoke\` and give me the live agent URL
   and the dashboard link.`}
            </pre>
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={0.2}>
        <p className="font-mono-brand text-[13px] text-muted-foreground mb-[72px]">
          works in <span className="text-foreground font-medium">Claude Code</span> ·{" "}
          <span className="text-foreground font-medium">Codex</span> ·{" "}
          <span className="text-foreground font-medium">opencode</span> ·{" "}
          <span className="text-foreground font-medium">Cursor</span> · any
          terminal agent
        </p>
      </FadeIn>

      <FadeIn delay={0.24}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7 md:gap-10 border-t border-border pt-10">
          {facts.map((fact) => (
            <div key={fact.title}>
              <p className="font-mono-brand text-[11px] uppercase tracking-[0.15em] text-foreground font-semibold mb-2.5">
                {fact.title}
              </p>
              <p className="text-[15px] leading-[1.7] tracking-[-0.1px] text-muted-foreground">
                {fact.description}
              </p>
            </div>
          ))}
        </div>
      </FadeIn>
    </SitePageLayout>
  );
};

export default AgentDeploy;
