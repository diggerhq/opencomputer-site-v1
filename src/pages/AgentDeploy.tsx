import { useEffect, useRef, useState } from "react";
import FadeIn from "@/components/FadeIn";
import SEO from "@/components/SEO";
import SiteHeader from "@/components/SiteHeader";
import {
  AGENT_DEPLOY_PROMPT_AFTER_TASK,
  AGENT_DEPLOY_PROMPT_BEFORE_TASK,
  AGENT_DEPLOY_PROMPT_PLACEHOLDER,
  buildAgentDeployPrompt,
} from "./agentDeployPrompt";

const AGENT_NAMES = ["Claude Code", "Codex", "opencode", "Cursor"];

const facts = [
  {
    title: "Durable sessions",
    description: "Survive restarts. Steer them mid-run.",
  },
  {
    title: "oc agent deploy",
    description: "A prompt is a deployable agent.",
  },
  {
    title: "Agent URLs",
    description: "A permanent HTTP address. Slack, hooks, cron.",
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
      await navigator.clipboard.writeText(buildAgentDeployPrompt(cleanTask));
      setCopied(true);
      window.clearTimeout(copyTimer.current);
      copyTimer.current = window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable; leave button label unchanged */
    }
  };

  return (
    <div className="flex min-h-[100dvh] flex-col">
      <SEO
        title="Deploy a managed agent"
        description="The easiest way to deploy a managed agent. Say what your agent should do, paste one prompt into your coding agent, get a live agent URL."
        path="/agentdeploy"
      />
      <SiteHeader />

      <main className="mx-auto flex w-full max-w-[994px] flex-1 items-center px-6 sm:px-10">
        <div className="grid w-full grid-cols-1 items-center gap-10 py-8 lg:grid-cols-[5fr_6fr] lg:gap-14">
          <div>
            <FadeIn>
              <h1 className="font-heading text-[clamp(34px,3.6vw,46px)] leading-[1.12] tracking-[-1.2px] mb-5">
                The easiest way to deploy a <em>managed agent</em>.
              </h1>
            </FadeIn>

            <FadeIn delay={0.06}>
              <p className="text-[15px] leading-[1.7] tracking-[-0.1px] text-muted-foreground mb-7">
                Always on, steerable mid-run, permanent URL. No infrastructure.
              </p>
            </FadeIn>

            <FadeIn delay={0.1}>
              <div className="mb-6">
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
                  className="w-full font-mono-brand text-[14px] text-foreground bg-secondary border border-border rounded-md px-4 py-3 placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors"
                />
              </div>
            </FadeIn>

            <FadeIn delay={0.14}>
              <p className="font-mono-brand text-[12px] text-muted-foreground">
                works in <span className="text-foreground font-medium">Claude Code</span> ·{" "}
                <span className="text-foreground font-medium">Codex</span> ·{" "}
                <span className="text-foreground font-medium">opencode</span> ·{" "}
                <span className="text-foreground font-medium">Cursor</span>
              </p>
            </FadeIn>
          </div>

          <FadeIn delay={0.12}>
            <div>
              <div className="mb-3 flex items-center justify-between">
                <p className="font-mono-brand text-[11px] uppercase tracking-[0.15em] text-foreground font-semibold">
                  Paste into {AGENT_NAMES[nameIndex]}
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
              <div className="bg-foreground text-background rounded-md px-6 py-5 selection:bg-background selection:text-foreground">
                <pre className="font-mono-brand text-[12px] leading-[1.65] whitespace-pre-wrap [overflow-wrap:anywhere]">
                  {AGENT_DEPLOY_PROMPT_BEFORE_TASK}
                  <span className="italic border-b border-background/45">
                    {cleanTask || AGENT_DEPLOY_PROMPT_PLACEHOLDER}
                  </span>
                  {AGENT_DEPLOY_PROMPT_AFTER_TASK}
                </pre>
              </div>
            </div>
          </FadeIn>
        </div>
      </main>

      <div className="border-t border-border">
        <div className="mx-auto grid w-full max-w-[994px] grid-cols-1 gap-2 px-6 py-4 sm:grid-cols-3 sm:gap-8 sm:px-10 sm:py-5">
          {facts.map((fact) => (
            <p key={fact.title} className="text-[13px] leading-[1.6]">
              <span className="font-mono-brand text-[11px] uppercase tracking-[0.15em] text-foreground font-semibold">
                {fact.title}
              </span>{" "}
              <span className="text-muted-foreground">— {fact.description}</span>
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AgentDeploy;
