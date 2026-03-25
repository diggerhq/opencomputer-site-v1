import { useEffect } from "react";
import FadeIn from "@/components/FadeIn";
import SitePageLayout from "@/components/SitePageLayout";

const benefits = [
  {
    title: "80% off future compute",
    description:
      "As a thank you for shaping the product with us, design partners get 80% off all future OpenComputer usage.",
  },
  {
    title: "Direct founder access",
    description:
      "Work directly with our team. Slack channel, weekly syncs, whatever you need to move fast.",
  },
  {
    title: "Shape the roadmap",
    description:
      "Your use case drives what we build next. Features, integrations, SDK changes. You have a seat at the table.",
  },
  {
    title: "Early access",
    description:
      "Get new capabilities before anyone else. Elastic compute, checkpoints, custom templates. You see it first.",
  },
];

const DesignPartners = () => {
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    return () => { document.head.removeChild(meta); };
  }, []);

  return (
    <SitePageLayout>
      <FadeIn>
        <h1 className="font-heading text-[clamp(42px,6vw,64px)] leading-[1.15] tracking-[-1.5px] mb-10">
          Design partnership.
        </h1>
      </FadeIn>

      <FadeIn delay={0.08}>
        <div className="mb-10 space-y-7">
          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            OpenComputer exposes resource scaling as an API your AI agent can
            call from inside the sandbox. If you're building an AI employee
            product (Claw for sales, marketing, hiring, or anything else), you
            don't need to over-provision an expensive box and overpay for idle
            resources.
          </p>
          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            Your agent starts small. If it hits a memory limit, it requests
            more, does its work, and scales back down. All from inside the
            sandbox, without any external orchestration.
          </p>
        </div>
      </FadeIn>

      <FadeIn delay={0.12}>
        <div className="my-14">
          <p className="font-mono-brand text-[11px] uppercase tracking-[0.15em] text-muted-foreground mb-4">
            See it in action
          </p>
          <div
            className="rounded-lg overflow-hidden border border-border/50 shadow-lg"
            style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}
          >
            <iframe
              src="https://www.loom.com/embed/80c2e40bfb894261be795555d4b47eb2"
              frameBorder="0"
              allowFullScreen
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
              }}
            />
          </div>
          <p className="mt-3 text-[13px] text-muted-foreground">
            OpenCLAW running in OpenComputer. The agent hits a memory limit,
            requests more from inside the sandbox, does its work, then scales
            back down. No external orchestration needed.
          </p>
        </div>
      </FadeIn>

      <FadeIn>
        <div className="my-14 space-y-7">
          <p className="font-heading text-[clamp(28px,4vw,38px)] leading-[1.35] tracking-[-0.8px]">
            $100/month. Shape what we build.
          </p>
          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            We're onboarding a small group of design partners to build
            OpenComputer alongside us. At list pricing, $100/month gets you
            ~18,000 GB-hours of compute. As a design partner, you also lock in
            an{" "}<strong>80% discount on all future usage</strong>, which means
            your $100 effectively buys ~90,000 GB-hours of compute going
            forward. That's 5x the value of regular pricing.
          </p>
          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            You get full access to the platform: persistent VMs, elastic
            compute, checkpoints, the SDK, everything. In return, we ask for
            your feedback. What works, what doesn't, what you wish existed.
            Your input directly shapes the product.
          </p>
        </div>
      </FadeIn>

      <FadeIn>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-14">
          {benefits.map((b) => (
            <div
              key={b.title}
              className="p-6 rounded-lg border border-border/50 bg-[hsl(0,0%,98%)] hover:border-foreground/20 transition-colors duration-150"
            >
              <h3 className="font-heading text-[18px] tracking-[-0.3px] mb-2">
                {b.title}
              </h3>
              <p className="text-[15px] leading-[1.7] text-muted-foreground">
                {b.description}
              </p>
            </div>
          ))}
        </div>
      </FadeIn>

      <FadeIn>
        <div className="my-14 space-y-7">
          <p className="font-heading text-[clamp(28px,4vw,38px)] leading-[1.35] tracking-[-0.8px]">
            Who this is for.
          </p>
          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            You're building an AI-native product that needs real compute, not
            ephemeral sandboxes that die after a task. Your agents install
            dependencies, maintain state across sessions, and need to scale
            resources on the fly. You want persistent VMs that your agent
            controls.
          </p>
          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            Whether you're building the next Lovable, Devin, or Bolt, or
            something entirely new like an AI sales rep, AI recruiter, or AI
            analyst: if your agent needs a computer, we'd love to talk.
          </p>
        </div>
      </FadeIn>

      <FadeIn>
        <div className="mt-20 pt-14 border-t border-border">
          <p className="font-heading text-[clamp(24px,3vw,32px)] leading-[1.35] tracking-[-0.5px] mb-6">
            Let's build this together.
          </p>
          <div className="flex gap-3 items-center flex-wrap">
            <a
              href="https://cal.com/team/digger/opencomputer-founder-chat"
              target="_blank"
              className="inline-block text-[15px] font-medium px-10 py-4 rounded-md bg-primary text-primary-foreground border border-primary hover:bg-foreground/90 transition-all duration-150"
            >
              Talk to founders &rarr;
            </a>
            <a
              href="https://app.opencomputer.dev"
              className="inline-block text-sm font-medium px-7 py-3 rounded-md bg-background text-foreground border border-border hover:border-foreground transition-all duration-150"
            >
              Try OpenComputer
            </a>
          </div>
        </div>
      </FadeIn>
    </SitePageLayout>
  );
};

export default DesignPartners;
