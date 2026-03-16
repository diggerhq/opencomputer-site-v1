import { Link } from "react-router-dom";
import FadeIn from "@/components/FadeIn";
import SitePageLayout from "@/components/SitePageLayout";

const WhereShouldTheAgentLive = () => {
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
          Where Should the Agent Live?
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
            This post will explore the tradeoffs between running an agent outside the sandbox,
            inside the sandbox, or in a hybrid environment.
          </p>
          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            We will look at latency, safety, tool access, operational complexity, and how the
            right choice changes depending on task difficulty and the types of tool calls an
            agent needs to make.
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
            <li>Who this is for: builders of coding agents, agent platforms, internal automation systems, and B2B products with long-lived agent workflows.</li>
            <li>Frame the problem: an agent is not just an API caller - it needs files, processes, network, dependencies, and memory across turns.</li>
            <li>Preview the core question: if the agent needs sandboxed compute, should it run outside the sandbox, inside it, or in a hybrid setup?</li>
            <li>2. Why agents need isolated compute in the first place</li>
            <li>Agents need real execution surfaces: filesystem access, shell and process execution, installed dependencies, and network access.</li>
            <li>Why local machines or shared hosts are the wrong default.</li>
            <li>Why giving a model unsandboxed shell access is not an acceptable production design.</li>
            <li>3. The security case for sandboxes</li>
            <li>Unsandboxed shell access is fundamentally dangerous.</li>
            <li>Connect to secure deployment guidance: least privilege, process isolation, network restrictions, filesystem boundaries, auditability, and policy enforcement.</li>
            <li>Explain how the placement choice changes the security posture: agent outside the sandbox, inside the sandbox, or hybrid.</li>
            <li>4. The persistence and economics case</li>
            <li>Explain why agents accumulate state across context windows: files created during work, installed packages, partial outputs, and task history.</li>
            <li>Show why this makes the compute environment part of the agent's memory.</li>
            <li>Ephemeral sandboxes force awkward tradeoffs: timeouts, cold starts, repeated hydration, and paying for idle if containers stay warm.</li>
            <li>Contrast this with hibernating or persistent compute.</li>
            <li>Explain why "just spin up a Docker container" works for demos but breaks down at scale.</li>
            <li>5. Where should the agent live?</li>
            <li>Agent outside the sandbox: simpler orchestration, but repeated boundary crossings for tool calls.</li>
            <li>Agent inside the sandbox: stronger isolation and local tool access, but different runtime and operational tradeoffs.</li>
            <li>Hybrid placement: keep safe tools local and send risky tools into stronger isolation.</li>
            <li>6. Performance tradeoffs: latency compounds</li>
            <li>Use the simulations to show how model latency, tool execution time, and sandbox boundary crossings accumulate.</li>
            <li>Emphasize that placement matters most on harder tasks with many tool calls.</li>
            <li>7. What attributes the sandbox should have</li>
            <li>Isolation.</li>
            <li>Persistence.</li>
            <li>Low-latency local execution.</li>
            <li>Lifecycle control: hibernate, resume, snapshot, terminate.</li>
            <li>Observability.</li>
            <li>Policyability.</li>
            <li>Multi-tenant economics.</li>
            <li>8. Decision framework</li>
            <li>Choose outside when tasks are light and orchestration simplicity matters most.</li>
            <li>Choose inside when tool density is high and containment matters.</li>
            <li>Choose hybrid when most tool calls are safe/local but some actions need stronger isolation.</li>
            <li>Statefulness and deployment pattern are a separate design question, covered in the next post.</li>
            <li>9. Conclusion</li>
            <li>Return to the claim: agents need computers, not just throwaway sandboxes.</li>
            <li>Refine it: they need the right kind of computer, the right lifecycle, and the right boundary placement.</li>
            <li>The real question is not whether to sandbox agents, but how to design sandboxed compute that preserves speed, state, and safety.</li>
          </ul>
        </div>
      </FadeIn>
    </SitePageLayout>
  );
};

export default WhereShouldTheAgentLive;
