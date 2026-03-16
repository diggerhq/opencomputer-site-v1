import { Link } from "react-router-dom";
import FadeIn from "@/components/FadeIn";
import SitePageLayout from "@/components/SitePageLayout";

const SandboxStatefulnessDesigns = () => {
  return (
    <SitePageLayout activeSection="blog" contentAs="article">
      <FadeIn>
        <Link
          to="/blog"
          className="font-mono-brand text-[13px] text-muted-foreground transition-colors hover:text-foreground no-underline"
        >
          &larr; Back to blog
        </Link>
      </FadeIn>

      <FadeIn delay={0.04}>
        <h1 className="mt-8 mb-4 font-heading text-[clamp(36px,5vw,52px)] leading-[1.15] tracking-[-1.5px]">
          Sandbox Statefulness Designs
        </h1>
      </FadeIn>

      <FadeIn delay={0.08}>
        <p className="mb-10 font-mono-brand text-[13px] text-muted-foreground">
          Written by TODO: placeholder &middot; March 15, 2026
        </p>
      </FadeIn>

      <FadeIn delay={0.12}>
        <div className="space-y-7">
          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            This post will focus on the second half of the architecture decision: how the
            sandbox itself should live over time.
          </p>
          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            We will look at ephemeral, long-running, hybrid, and shared-environment designs,
            and connect those patterns to the statefulness models described in the Claude
            Agent SDK docs.
          </p>
        </div>
      </FadeIn>

      <FadeIn>
        <div className="my-10 h-px w-12 bg-border" />
      </FadeIn>

      <FadeIn>
        <div className="rounded-lg border border-dashed border-border/80 bg-[hsl(0,0%,98%)] p-8">
          <p className="font-mono-brand text-[12px] uppercase tracking-[0.15em] text-muted-foreground">
            Draft outline
          </p>
          <ul className="mt-4 space-y-3 text-[16px] leading-[1.7] text-muted-foreground">
            <li>1. Set the stage</li>
            <li>Why statefulness is a separate design decision from where the agent lives.</li>
            <li>How lifecycle design affects continuity, cost, reliability, and operator ergonomics.</li>
            <li>2. What state an agent actually accumulates</li>
            <li>Filesystem changes, installed packages, partial outputs, task history, and execution context.</li>
            <li>Why context windows alone are not enough.</li>
            <li>3. Ephemeral sessions</li>
            <li>Where they shine.</li>
            <li>Where they break down.</li>
            <li>4. Long-running sessions</li>
            <li>Persistent containers for proactive, high-throughput, or continuously interactive agents.</li>
            <li>Tradeoffs in cost, operations, and reliability.</li>
            <li>5. Hybrid sessions</li>
            <li>Ephemeral compute hydrated with saved history and filesystem state.</li>
            <li>Why this is often the most pragmatic middle ground.</li>
            <li>6. Shared environments / single-container patterns</li>
            <li>When multiple agents need to collaborate in one writable environment.</li>
            <li>Coordination risks and overwrite hazards.</li>
            <li>7. Mapping these designs to the Claude Agent SDK statefulness guidance</li>
            <li>Session resumption, persistent containers, and hosted patterns.</li>
            <li>8. Choosing the right statefulness model</li>
            <li>How task duration, interruption frequency, and collaboration needs affect the decision.</li>
            <li>9. Conclusion</li>
            <li>Agents need stateful computers, not just execution sandboxes.</li>
            <li>The right lifecycle model depends on how much continuity and coordination your product requires.</li>
          </ul>
        </div>
      </FadeIn>
    </SitePageLayout>
  );
};

export default SandboxStatefulnessDesigns;
