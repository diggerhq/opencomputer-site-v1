import { Link } from "react-router-dom";
import FadeIn from "@/components/FadeIn";
import SEO from "@/components/SEO";
import ShikiCodeBlock from "@/components/ShikiCodeBlock";
import SitePageLayout from "@/components/SitePageLayout";

const caseStudies = [
  {
    logo: "/logos/ramp.svg",
    logoAlt: "Ramp",
    logoClass: "h-7",
    name: "Inspect",
    summary:
      "Ramp's background agent writes code and verifies its own work: it runs tests, checks telemetry, and serves live previews. Every session gets its own sandboxed VM with a full dev environment.",
    stat: "~30% of merged PRs within months of launch",
    sourceUrl: "https://builders.ramp.com/post/why-we-built-our-background-agent",
    sourceLabel: "Why we built our own background agent",
  },
  {
    logo: "/logos/stripe.svg",
    logoAlt: "Stripe",
    logoClass: "h-7",
    name: "Minions",
    summary:
      "Stripe's one-shot agents start from a Slack message and end in a CI-passing PR, no interaction in between. Each minion runs on its own isolated cloud devbox, pre-warmed and ready in ~10 seconds.",
    stat: "1,300+ agent-merged PRs per week",
    sourceUrl:
      "https://stripe.dev/blog/minions-stripes-one-shot-end-to-end-coding-agents",
    sourceLabel: "Minions: Stripe's one-shot coding agents",
  },
  {
    logo: "/logos/workos.svg",
    logoAlt: "WorkOS",
    logoClass: "h-6",
    name: "Horizon",
    summary:
      "WorkOS's event-driven agent system turns Linear issues, GitHub events, and Slack messages into shipped PRs. Agents execute in isolated cloud sandboxes after the team outgrew GitHub Codespaces.",
    stat: "A self-driving codebase, humans review PRs",
    sourceUrl: "https://workos.com/blog/project-horizon",
    sourceLabel: "The self-driving codebase",
  },
];

const inVmScaleSnippet = `# From inside the VM: grab headroom before the heavy step
curl -s -X POST http://169.254.169.254/v1/scale \\
  -H "Content-Type: application/json" \\
  -d '{"memoryMB": 16384}'

npm run build   # or cargo build, pytest, an agent harness...

# Done. Scale back down, stop paying for 16 GB.
curl -s -X POST http://169.254.169.254/v1/scale \\
  -H "Content-Type: application/json" \\
  -d '{"memoryMB": 4096}'`;

const autoscaleSnippet = `import { Sandbox } from "@opencomputer/sdk";

const sandbox = await Sandbox.create();

// Opt in once. The platform resizes the VM for you
// based on observed memory pressure.
await sandbox.setAutoscale({
  enabled: true,
  minMemoryMB: 1024,
  maxMemoryMB: 16384,
});`;

const BackgroundAgents = () => {
  return (
    <SitePageLayout>
      <SEO
        title="Build your own background agent"
        description="Ramp built Inspect. Stripe built Minions. WorkOS built Horizon. The pattern is the same: one isolated computer per agent. OpenComputer gives you that layer, with compute that scales itself."
        path="/background-agents"
      />

      <FadeIn>
        <h1 className="font-heading text-[clamp(42px,6vw,64px)] leading-[1.15] tracking-[-1.5px] mb-10">
          Build your own background agent.
        </h1>
      </FadeIn>

      <FadeIn delay={0.08}>
        <div className="mb-12 space-y-7">
          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            The best engineering teams stopped waiting for someone to sell them
            a coding agent. Ramp built Inspect. Stripe built Minions. WorkOS
            built Horizon. Different companies, different stacks, and they all
            landed on the same architecture: an agent that picks up work from
            Slack or an issue tracker, runs unattended on its own isolated
            computer, and shows up later with a PR for a human to review.
          </p>
          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            The agent loop is the easy part. A few hundred lines of code around
            a model API. The hard part is the computer underneath it: one
            isolated, fully equipped machine per agent, ready instantly, sized
            right for whatever the agent decides to do. That's the layer
            OpenComputer gives you.
          </p>
        </div>
      </FadeIn>

      <FadeIn delay={0.12}>
        <div className="my-14">
          <p className="font-mono-brand text-[11px] uppercase tracking-[0.15em] text-muted-foreground mb-6">
            Who's already doing this
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {caseStudies.map((c) => (
              <div
                key={c.name}
                className="flex flex-col p-6 rounded-lg border border-border/50 bg-[hsl(0,0%,98%)] hover:border-foreground/20 transition-colors duration-150"
              >
                <div className="h-8 flex items-center mb-5">
                  <img
                    src={c.logo}
                    alt={c.logoAlt}
                    className={`${c.logoClass} w-auto`}
                  />
                </div>
                <h3 className="font-heading text-[20px] tracking-[-0.3px] mb-2">
                  {c.name}
                </h3>
                <p className="text-[14px] leading-[1.7] text-muted-foreground mb-4 flex-1">
                  {c.summary}
                </p>
                <p className="font-mono-brand text-[11px] uppercase tracking-[0.1em] text-foreground mb-4">
                  {c.stat}
                </p>
                <a
                  href={c.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[13px] font-medium text-muted-foreground underline hover:text-foreground transition-colors"
                >
                  {c.sourceLabel} &rarr;
                </a>
              </div>
            ))}
          </div>
        </div>
      </FadeIn>

      <FadeIn>
        <div className="my-14 space-y-7">
          <p className="font-heading text-[clamp(28px,4vw,38px)] leading-[1.35] tracking-[-0.8px]">
            All three converge on the same design.
          </p>
          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            Ramp gives every Inspect session a sandboxed VM with everything an
            engineer would have locally. Stripe runs each minion on its own
            devbox, isolated so the agent never needs per-action permission
            checks. WorkOS moved Horizon off Codespaces into sandboxes it can
            control programmatically. Strip away the branding and the recipe is
            identical: <strong>one real computer per agent</strong>, isolated
            from production, with the repo, the toolchain, and room to work.
          </p>
          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            None of these teams could buy that layer off the shelf, so they
            built it on raw infrastructure: Modal, EC2, Cloudflare. You don't
            have to. An OpenComputer sandbox is a full Linux VM with its own
            kernel, filesystem, and network. It persists for hours or days,
            hibernates when idle, and checkpoints like a git branch, so you can
            keep a warm snapshot of your repo and fork a fresh machine per task
            in seconds. The same trick Stripe uses to get a minion working in
            10 seconds.
          </p>
        </div>
      </FadeIn>

      <FadeIn>
        <div className="my-14">
          <p className="font-heading text-[clamp(28px,4vw,38px)] leading-[1.35] tracking-[-0.8px] mb-6">
            Compute that scales itself. Stop OOMing, stop overpaying.
          </p>
          <div className="space-y-7 mb-8">
            <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
              Here's the problem every one of these teams hits: you can't size
              a VM for an agent, because the agent decides what to run. Most of
              the time it's reading files and calling a model, and 1 GB is
              plenty. Then it kicks off a build or a test suite and suddenly
              needs 16. Provision for the peak and you pay for idle memory all
              day. Provision for the average and the kernel OOM-kills your
              agent mid-task.
            </p>
            <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
              OpenComputer sandboxes resize at runtime, from 1 GB / 1 vCPU up
              to 16 GB / 4 vCPU. And the agent itself can drive it: every
              sandbox exposes an internal API that code <em>inside</em> the VM
              can call to scale its own machine. Your agent grabs headroom
              before the heavy step and gives it back after.
            </p>
          </div>
          <ShikiCodeBlock
            code={inVmScaleSnippet}
            language="bash"
            filename="inside the sandbox"
            copyable
            className="mb-8"
          />
          <div className="space-y-7 mb-8">
            <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
              Prefer not to think about it at all? Opt in to autoscaling and
              the platform watches memory pressure for you. Above 75%
              utilization the sandbox jumps to the next tier. Once usage stays
              below 25%, it steps back down. Instead of dying at a fixed
              memory cap, your agent gets headroom when it needs it, and you
              stop paying for a peak that already passed.
            </p>
          </div>
          <ShikiCodeBlock
            code={autoscaleSnippet}
            language="typescript"
            filename="autoscale.ts"
            copyable
            className="mb-6"
          />
          <p className="text-[15px] leading-[1.7] text-muted-foreground">
            The platform also refuses to shrink a sandbox below its current
            working set, so a scale-down can never OOM-kill your agent either.{" "}
            <a
              href="https://docs.opencomputer.dev/sandboxes/elasticity"
              target="_blank"
              rel="noreferrer"
              className="underline hover:text-foreground transition-colors"
            >
              Read the elasticity docs &rarr;
            </a>
          </p>
        </div>
      </FadeIn>

      <FadeIn>
        <div className="my-14 space-y-7">
          <p className="font-heading text-[clamp(28px,4vw,38px)] leading-[1.35] tracking-[-0.8px]">
            What your Inspect looks like on OpenComputer.
          </p>
          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            Snapshot a VM with your repo and toolchain installed. On every
            Slack message or labeled issue, fork the snapshot, drop an agent
            harness like Claude Agent SDK into it, and let it work. The sandbox
            scales itself up for builds and back down for thinking. When the
            PR is open, hibernate or kill the VM. We wrote up a working
            version, a ~250-line agent that turns labeled GitHub issues into
            draft PRs at about $0.30 per task:
          </p>
          <Link
            to="/guides/background-coding-agent"
            className="block p-6 rounded-lg border border-border/50 bg-[hsl(0,0%,98%)] hover:border-foreground/20 transition-colors duration-150 no-underline"
          >
            <h3 className="font-heading text-[20px] tracking-[-0.3px] mb-2 text-foreground">
              Build a background coding agent that works while you sleep
            </h3>
            <p className="text-[15px] leading-[1.7] text-muted-foreground">
              The snapshot, the agent loop, the webhook server, and the dead
              ends we'd save you from. Label an issue, wake up to a draft PR.
            </p>
          </Link>
        </div>
      </FadeIn>

      <FadeIn>
        <div className="mt-20 pt-14 border-t border-border">
          <p className="font-heading text-[clamp(24px,3vw,32px)] leading-[1.35] tracking-[-0.5px] mb-4">
            Start building yours.
          </p>
          <p className="text-[17px] leading-[1.75] tracking-[-0.1px] mb-8 max-w-[640px]">
            Log in, grab an API key, and you have a full Linux VM in one SDK
            call. Follow the guide to get to a working agent, or book 30
            minutes with the founders and we'll sketch the architecture for
            your stack together.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 items-start mb-10">
            <div>
              <p className="font-mono-brand text-[11px] uppercase tracking-[0.15em] text-foreground font-semibold mb-3">
                Build it yourself
              </p>
              <a
                href="https://app.opencomputer.dev"
                className="w-full flex items-center justify-between gap-4 text-left text-[15px] font-medium px-5 py-4 rounded-md bg-foreground text-background hover:opacity-90 transition-opacity duration-150"
              >
                <span>Log in and create your first VM</span>
                <span aria-hidden="true">&rarr;</span>
              </a>
            </div>
            <div>
              <p className="font-mono-brand text-[11px] uppercase tracking-[0.15em] text-foreground font-semibold mb-3">
                Or have us walk you through it
              </p>
              <a
                href="https://cal.com/team/digger/opencomputer-founder-chat"
                target="_blank"
                rel="noreferrer"
                className="w-full inline-block text-center text-[15px] font-medium px-5 py-4 rounded-md bg-background text-foreground border border-border hover:border-foreground transition-all duration-150"
              >
                Book a demo with the founders
              </a>
            </div>
          </div>
          <div className="flex gap-3 items-center flex-wrap">
            <Link
              to="/guides/background-coding-agent"
              className="inline-block text-sm font-medium px-7 py-3 rounded-md bg-background text-foreground border border-border hover:border-foreground transition-all duration-150"
            >
              Read the guide
            </Link>
            <a
              href="https://docs.opencomputer.dev/sandboxes/elasticity"
              target="_blank"
              rel="noreferrer"
              className="inline-block text-sm font-medium px-7 py-3 rounded-md bg-background text-foreground border border-border hover:border-foreground transition-all duration-150"
            >
              Elasticity docs
            </a>
          </div>
        </div>
      </FadeIn>
    </SitePageLayout>
  );
};

export default BackgroundAgents;
