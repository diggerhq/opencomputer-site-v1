import { Link } from "react-router-dom";
import FadeIn from "@/components/FadeIn";
import SitePageLayout from "@/components/SitePageLayout";
import SEO from "@/components/SEO";

/* ---------- Callout ---------- */
const Callout = ({ children }: { children: React.ReactNode }) => (
  <div className="my-8 pl-5 border-l-[3px] border-foreground/80 py-1">
    <p className="font-heading text-[19px] leading-[1.65] tracking-[-0.2px] italic text-foreground/85">
      {children}
    </p>
  </div>
);

/* ---------- Architecture diagram boxes ---------- */
const DiagramBox = ({
  label,
  sub,
  accent = false,
}: {
  label: string;
  sub?: string;
  accent?: boolean;
}) => (
  <div
    className={`px-5 py-4 rounded-lg border text-center ${
      accent
        ? "bg-foreground text-background border-foreground"
        : "bg-[hsl(0,0%,98%)] text-foreground border-border"
    }`}
  >
    <p className={`font-mono-brand text-[13px] font-medium ${accent ? "text-background" : ""}`}>
      {label}
    </p>
    {sub && (
      <p
        className={`font-mono-brand text-[11px] mt-1 ${
          accent ? "text-background/60" : "text-muted-foreground"
        }`}
      >
        {sub}
      </p>
    )}
  </div>
);

const Arrow = ({ direction = "down" }: { direction?: "down" | "right" }) => (
  <div className={`flex items-center justify-center ${direction === "right" ? "" : "py-1"}`}>
    <span className="font-mono-brand text-[18px] text-muted-foreground select-none">
      {direction === "right" ? "→" : "↓"}
    </span>
  </div>
);

/* ---------- Figure with caption ---------- */
const Figure = ({
  src,
  alt,
  caption,
  maxW = "max-w-[680px]",
}: {
  src: string;
  alt: string;
  caption: string;
  maxW?: string;
}) => (
  <figure className={`my-10 mx-auto ${maxW}`}>
    <div className="rounded-xl border border-border/50 overflow-hidden bg-[hsl(0,0%,98%)]">
      <img src={src} alt={alt} className="block w-full h-auto" />
    </div>
    <figcaption className="font-mono-brand text-[11px] text-muted-foreground text-center mt-3">
      {caption}
    </figcaption>
  </figure>
);

const WhatItTakesToRunAiCoworkerImessage = () => {
  return (
    <SitePageLayout activeSection="blog" contentAs="article">
      <SEO
        title="What it takes to run an AI coworker on iMessage"
        description="Lessons from shipping Clawputer, a managed openclaw that lives in your iMessage. Patterns for VM lifecycle, versioning, OAuth integrations, and browser offloading when building AI coworkers on long-lived compute."
        author="Mohamed Habib"
        path="/blog/what-it-takes-to-run-an-ai-coworker-on-imessage"
        type="article"
      />

      <FadeIn>
        <Link
          to="/blog"
          className="font-mono-brand text-[13px] text-muted-foreground hover:text-foreground transition-colors no-underline"
        >
          &larr; Back to blog
        </Link>
      </FadeIn>

      <FadeIn delay={0.04}>
        <h1 className="font-heading text-[clamp(36px,5vw,52px)] leading-[1.15] tracking-[-1.5px] mt-8 mb-4">
          What it takes to run an AI coworker on iMessage
        </h1>
      </FadeIn>

      <FadeIn delay={0.08}>
        <p className="font-mono-brand text-[13px] text-muted-foreground mb-10">
          Written by Mohamed Habib, CTO Digger &middot; May 22, 2026
        </p>
      </FadeIn>

      <FadeIn delay={0.12}>
        <div className="space-y-7">
          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            Our team recently shipped{" "}
            <a
              href="https://clawputer.app/"
              target="_blank"
              className="underline hover:text-muted-foreground transition-colors"
            >
              clawputer.app
            </a>
            , a managed openclaw that lives purely in your iMessage. The idea was simple:
          </p>

          <ul className="list-disc list-inside space-y-2 text-[17px] leading-[1.75] tracking-[-0.1px] pl-2">
            <li>A managed openclaw instance for every user</li>
            <li>Lives purely in your iMessage</li>
            <li>Text to start a conversation right away</li>
          </ul>

          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            To preface this, we are{" "}
            <a
              href="https://opencomputer.dev/"
              target="_blank"
              className="underline hover:text-muted-foreground transition-colors"
            >
              opencomputer.dev
            </a>
            . We build computers for agents, specifically optimised for "always on" workloads
            like openclaw, hermes, and the Claude Agent SDK (folks building clawputer-like apps,
            basically).
          </p>

          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            Our thesis is that having no timeouts on how long the VM stays on is the way to go
            for "hosted claw" (or clawternative) offerings. Think Poke, but for your vertical
            usecase. Internally we like to call what we have "lambda ergonomics with EC2
            semantics".
          </p>

          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            In order to really feel for our users I decided to build and launch a fully working
            personal assistant end to end. That led me to a few patterns worth sharing. Since
            many startups are building AI employees around openclaw these days, here is how
            this works under the hood and the gotchas you can avoid when setting up your own
            managed openclaw.
          </p>
        </div>
      </FadeIn>

      <FadeIn>
        <div className="w-12 h-px bg-border my-10" />
      </FadeIn>

      {/* ====== 1. Computer infrastructure ====== */}
      <FadeIn>
        <h2 className="font-heading text-[clamp(28px,4vw,38px)] leading-[1.35] tracking-[-0.8px] mb-6">
          1. Computer infrastructure
        </h2>
      </FadeIn>

      <FadeIn>
        <div className="space-y-7">
          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            Obviously every openclaw needs to live in its own computer. For that we went with
            our product opencomputer.dev (surprise surprise). It lets us spin up many machines
            quickly without worrying about timeouts, so we can keep them alive as long as we
            want, no snapshot-and-restore tricks needed.
          </p>

          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            We had two options for templating: checkpoints / templates, or a Docker image.
            Both would have worked. I opted for the openclaw Docker image because I could
            stand up a stable POC quicker. For every new claw we launch a base opencomputer
            VM, immediately pull the Docker image, and bootstrap the claw. After some
            optimisation, this takes between 10 and 15 seconds to a working claw. With
            checkpoints and forking of running VMs we can get that down to 1 to 3 seconds.
          </p>
        </div>
      </FadeIn>

      {/* Visual: bootstrap flow */}
      <FadeIn>
        <div className="my-12 p-8 rounded-xl border border-border/50 bg-[hsl(0,0%,98.5%)]">
          <p className="font-mono-brand text-[11px] uppercase tracking-[0.15em] text-muted-foreground mb-6">
            Bootstrap, today vs with checkpoints
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-lg border border-border/50 bg-white">
              <p className="font-mono-brand text-[11px] uppercase tracking-[0.12em] text-muted-foreground mb-4">
                Docker bootstrap
              </p>
              <div className="space-y-2">
                <DiagramBox label="Launch base VM" sub="opencomputer" />
                <Arrow />
                <DiagramBox label="Pull image" sub="openclaw:pinned" />
                <Arrow />
                <DiagramBox label="Boot claw" sub="ready" accent />
              </div>
              <p className="font-mono-brand text-[12px] text-muted-foreground mt-4 text-center">
                10 to 15 seconds
              </p>
            </div>
            <div className="p-5 rounded-lg border-2 border-foreground/80 bg-white">
              <p className="font-mono-brand text-[11px] uppercase tracking-[0.12em] text-muted-foreground mb-4">
                Fork from checkpoint
              </p>
              <div className="space-y-2">
                <DiagramBox label="Warm template" sub="pre-baked claw" />
                <Arrow />
                <DiagramBox label="Fork running VM" sub="cow snapshot" />
                <Arrow />
                <DiagramBox label="Boot claw" sub="ready" accent />
              </div>
              <p className="font-mono-brand text-[12px] text-foreground mt-4 text-center">
                1 to 3 seconds
              </p>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* ====== 2. Openclaw specifics ====== */}
      <FadeIn>
        <h2 className="font-heading text-[clamp(28px,4vw,38px)] leading-[1.35] tracking-[-0.8px] mb-6 mt-4">
          2. Openclaw specifics
        </h2>
      </FadeIn>

      <FadeIn>
        <div className="space-y-7">
          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            Openclaw keeps shipping breaking changes around its schema and spec. It is very
            important to pin to a specific version to fight the breaking changes of every
            update. Upgrades need to be explicit, and they need testing, because every update
            is a ticking timebomb waiting to break your claw. I would rather run several
            smoke tests on a new image during an upgrade and be sure the schema is still
            valid. That leads us to the next point: how we handle version updates.
          </p>
        </div>
      </FadeIn>

      <FadeIn>
        <Callout>
          Every openclaw update is a ticking timebomb waiting to break your claw. Pin the
          version, smoke test the upgrade, then ship.
        </Callout>
      </FadeIn>

      {/* ====== 3. VM versioning and updates ====== */}
      <FadeIn>
        <h2 className="font-heading text-[clamp(28px,4vw,38px)] leading-[1.35] tracking-[-0.8px] mb-6 mt-4">
          3. VM versioning and updates
        </h2>
      </FadeIn>

      <FadeIn>
        <div className="space-y-7">
          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            For any long-running VMs there is a big challenge: how to deal with updates. We
            might want to update the system prompt for openclaw, change the schema to add
            more integrations, or simply update the version of openclaw running on the VM.
            We can easily ship an updated Docker image and bump that for all new VMs, but
            what about the older VMs that have an older claw running?
          </p>

          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            One way is to patch them in place: if we need to update a file we perform the
            patch directly. The big drawback is that correctness is hard to guarantee. The
            way we decided to roll is inspired by blue-green deployments. Each VM has a
            version. For each VM in the fleet we do the following:
          </p>

          <ol className="list-decimal list-inside space-y-3 text-[17px] leading-[1.75] tracking-[-0.1px] pl-2">
            <li>Spin up a fresh VM, pull the latest Docker version we want</li>
            <li>Backup the user files, restore them on the new VM</li>
            <li>Run a smoke test to ensure all works</li>
            <li>Redirect traffic to the new healthy VM</li>
            <li>Terminate the old VM</li>
          </ol>

          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            This way we treat VMs as disposable and a single VM never drifts into a state
            where it breaks and we do not know why.
          </p>
        </div>
      </FadeIn>

      {/* Visual: blue-green */}
      <FadeIn>
        <div className="my-12 p-8 rounded-xl border border-border/50 bg-[hsl(0,0%,98.5%)]">
          <p className="font-mono-brand text-[11px] uppercase tracking-[0.15em] text-muted-foreground mb-6">
            Blue-green rollout, per VM
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            <div className="p-5 rounded-lg border border-dashed border-[hsl(0,40%,70%)] bg-[hsl(0,40%,98%)]">
              <p className="font-mono-brand text-[11px] uppercase tracking-[0.12em] text-[hsl(0,40%,40%)] mb-4">
                Old VM (vN)
              </p>
              <div className="space-y-2">
                <DiagramBox label="openclaw vN" sub="serving traffic" />
                <DiagramBox label="user files" sub="source of truth" />
              </div>
            </div>
            <div className="flex flex-col items-center justify-center gap-3">
              <span className="font-mono-brand text-[11px] text-muted-foreground">
                backup, restore, smoke test
              </span>
              <Arrow direction="right" />
              <span className="font-mono-brand text-[11px] text-muted-foreground">
                cut over, terminate
              </span>
            </div>
            <div className="p-5 rounded-lg border-2 border-foreground/80 bg-white">
              <p className="font-mono-brand text-[11px] uppercase tracking-[0.12em] text-foreground mb-4">
                New VM (vN+1)
              </p>
              <div className="space-y-2">
                <DiagramBox label="openclaw vN+1" sub="fresh boot" accent />
                <DiagramBox label="user files" sub="restored, verified" />
              </div>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* ====== 4. Messaging infrastructure ====== */}
      <FadeIn>
        <h2 className="font-heading text-[clamp(28px,4vw,38px)] leading-[1.35] tracking-[-0.8px] mb-6 mt-4">
          4. Messaging infrastructure
        </h2>
      </FadeIn>

      <FadeIn>
        <div className="space-y-7">
          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            A small word on iMessage infrastructure. This was the first time I set this
            integration up and we immediately sought a vendor to help us out. We went with{" "}
            <a
              href="https://linq.app/"
              target="_blank"
              className="underline hover:text-muted-foreground transition-colors"
            >
              linqapp
            </a>{" "}
            and they did not disappoint. One important point they flagged: the first message
            should be inbound (user sending), not outbound. Apparently that helps with
            iMessage reputation, so keep that in mind if you ever integrate with iMessage.
          </p>
        </div>
      </FadeIn>

      {/* ====== 5. Integrations integrations integrations ====== */}
      <FadeIn>
        <h2 className="font-heading text-[clamp(28px,4vw,38px)] leading-[1.35] tracking-[-0.8px] mb-6 mt-4">
          5. Integrations integrations integrations
        </h2>
      </FadeIn>

      <FadeIn>
        <div className="space-y-7">
          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            One of the annoying things for me when I set up openclaw for myself was copying
            over dozens of API keys and integrating with many MCP servers. I wanted the
            experience to feel as easy as an OAuth signup. For that we used{" "}
            <a
              href="https://pipedream.com/connect"
              target="_blank"
              className="underline hover:text-muted-foreground transition-colors"
            >
              Pipedream Connect
            </a>{" "}
            to handle the connection to multiple third parties.
          </p>

          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            The way it works: the main clawputer service exposes an MCP gateway to each
            sandbox VM. The gateway handles connections to user services via OAuth and
            exposes the tools to the VM. Openclaw then knows which services are connected
            and which still need to be connected via the gateway.
          </p>
        </div>
      </FadeIn>

      {/* Visual: MCP gateway architecture */}
      <FadeIn>
        <div className="my-12 p-8 rounded-xl border border-border/50 bg-[hsl(0,0%,98.5%)]">
          <p className="font-mono-brand text-[11px] uppercase tracking-[0.15em] text-muted-foreground mb-6">
            MCP gateway, one per user
          </p>
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 justify-center">
            <DiagramBox label="Sandbox VM" sub="openclaw + agent loop" accent />
            <Arrow direction="right" />
            <DiagramBox label="MCP gateway" sub="OAuth, tool registry" />
            <Arrow direction="right" />
            <div className="flex flex-col gap-2">
              <DiagramBox label="Slack" sub="oauth" />
              <DiagramBox label="Gmail" sub="oauth" />
              <DiagramBox label="Notion" sub="oauth" />
              <DiagramBox label="..." sub="N more" />
            </div>
          </div>
        </div>
      </FadeIn>

      {/* Screenshots: integrations chat + Notion connected */}
      <FadeIn>
        <div className="my-10 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <Figure
            src="/ai-coworker-imessage/imessage-integrations.png"
            alt="iMessage chat showing connected integrations and a Notion OAuth handoff"
            caption="Listing connected integrations and starting a Notion OAuth, all inside iMessage."
            maxW=""
          />
          <Figure
            src="/ai-coworker-imessage/notion-connected.png"
            alt="Notion connected confirmation screen with a Back to iMessage button"
            caption="The hand-off page after OAuth completes. One tap back to the thread."
            maxW=""
          />
        </div>
      </FadeIn>

      <FadeIn>
        <Callout>
          Integrations should feel like an OAuth signup, not a config exercise.
        </Callout>
      </FadeIn>

      {/* ====== 6. Browser infrastructure ====== */}
      <FadeIn>
        <h2 className="font-heading text-[clamp(28px,4vw,38px)] leading-[1.35] tracking-[-0.8px] mb-6 mt-4">
          6. Browser infrastructure
        </h2>
      </FadeIn>

      <FadeIn>
        <div className="space-y-7">
          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            In many cases users ask for things like "analyze my competitor's pages" or
            "find listings on Zillow for my new home". We could run a Chromium instance in
            each VM, but there are a lot of problems to handle around browser use. To keep
            life simple we decided to hand any browser logic to a third-party service that
            performs the action and returns the results back to the claw. For our case we
            went with{" "}
            <a
              href="https://browser-use.com/"
              target="_blank"
              className="underline hover:text-muted-foreground transition-colors"
            >
              Browser Use
            </a>{" "}
            and it worked really well.
          </p>
        </div>
      </FadeIn>

      <FadeIn>
        <Figure
          src="/ai-coworker-imessage/imessage-zillow.png"
          alt="iMessage chat where the assistant scrapes Zillow listings via a stealth browser"
          caption='The browser sidecar in action: "show me latest Zillow listings in sf for a 2b2b".'
          maxW="max-w-[520px]"
        />
      </FadeIn>

      <FadeIn>
        <div className="w-12 h-px bg-border my-10" />
      </FadeIn>

      {/* ====== Wrapping up ====== */}
      <FadeIn>
        <h2 className="font-heading text-[clamp(28px,4vw,38px)] leading-[1.35] tracking-[-0.8px] mb-6">
          Wrapping up
        </h2>
      </FadeIn>

      <FadeIn>
        <div className="space-y-7">
          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            Shipping Clawputer end to end has been clarifying, to say the least. The
            interesting work in a managed claw product is everything around it: keeping VMs
            alive without timing out, versioning them without losing user state, making
            integrations feel like an OAuth signup instead of a config exercise, and handing
            off the messy parts (browsers, messaging) to vendors that have already solved
            them, instead of suffering from a bunch of tiny papercuts.
          </p>

          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            If you are building a vertical agent, an AI coworker on top of openclaw, hermes,
            Claude Agent SDK, OpenAI Agent SDK, or honestly anything "claw shaped" on top of
            long-lived compute, you will hit most of these patterns too.{" "}
            <a
              href="https://opencomputer.dev/"
              target="_blank"
              className="underline hover:text-muted-foreground transition-colors"
            >
              opencomputer.dev
            </a>{" "}
            is the best place to run that. Go and check it out today!
          </p>
        </div>
      </FadeIn>
    </SitePageLayout>
  );
};

export default WhatItTakesToRunAiCoworkerImessage;
