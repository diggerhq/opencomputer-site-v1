import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Link } from "react-router-dom";
import FadeIn from "@/components/FadeIn";
import SitePageLayout from "@/components/SitePageLayout";

const SDK_CODE = `import { Sandbox } from '@opencomputer/sdk';

// Create a sandbox
const sandbox = await Sandbox.create({ template: 'default' });

// Run a command
const result = await sandbox.commands.run('node --version');
console.log(result.stdout);

// Work with files
await sandbox.files.write('/app/index.js', 'console.log("hello")');
const output = await sandbox.commands.run('node /app/index.js');
console.log(output.stdout); // hello

// Clean up
await sandbox.kill();`;

const features = [
  {
    title: "Agent Friendly",
    description:
      "Purpose built for running harnesses such as Claude Agent SDK.",
  },
  {
    title: "Elastic Compute",
    description:
      "Resize memory and CPU while VM is running.",
  },
  {
    title: "Persistent VMs",
    description:
      "VMs stay on forever until you hibernate or delete them.",
  },
  {
    title: "Checkpoints",
    description:
      "Instant snapshots. Fork or restore to any point. Bad VM state? Roll back in a second.",
  },
];

const pricingTiers = [
  { mem: "256 MB", cpu: "0.25 vCPU", month: "$0.50", sec: "$0.000000190" },
  { mem: "512 MB", cpu: "1 vCPU", month: "$1", sec: "$0.000000380" },
  { mem: "1 GB", cpu: "2 vCPU", month: "$4", sec: "$0.000001521" },
  { mem: "2 GB", cpu: "4 vCPU", month: "$6", sec: "$0.000002282" },
  { mem: "4 GB", cpu: "8 vCPU", month: "$12", sec: "$0.000004563" },
  { mem: "8 GB", cpu: "16 vCPU", month: "$24", sec: "$0.000009126" },
  { mem: "16 GB", cpu: "32 vCPU", month: "$48", sec: "$0.000018252" },
];

const Index = () => {
  const [copied, setCopied] = useState(false);
  const [tierIndex, setTierIndex] = useState(2);

  const handleCopy = () => {
    navigator.clipboard.writeText(SDK_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
  <SitePageLayout>
      <FadeIn>
        <h1 className="font-heading text-[clamp(42px,6vw,64px)] leading-[1.15] tracking-[-1.5px] mb-10">
          Beyond sandboxes.
        </h1>
      </FadeIn>

      <FadeIn delay={0.08}>
        <div className="mb-10 space-y-7">
          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            Today, agents use sandboxes to run untrusted code. Disposable
            computers that spin up, do a task, and disappear. But agents are
            getting more ambitious. They need a whole computer at their
            disposal - always on, always persistent, always ready.
          </p>
          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            Sandboxes are for throwaway tasks. Agents need something that
            sticks around.
          </p>
        </div>
      </FadeIn>

      <FadeIn delay={0.12}>
        <div className="mb-10">
          <a
            href="https://app.opencomputer.dev"
            className="inline-block text-[15px] font-medium px-10 py-4 rounded-md bg-primary text-primary-foreground border border-primary hover:bg-foreground/90 transition-all duration-150"
          >
            Try it now &rarr;
          </a>
        </div>
      </FadeIn>

      <FadeIn delay={0.16}>
        <p className="font-heading text-[clamp(28px,4vw,38px)] leading-[1.35] tracking-[-0.8px] mt-2 mb-2">
          It's time to give your agents a real computer.
        </p>
      </FadeIn>

      <FadeIn delay={0.24}>
        <div className="w-12 h-px bg-border my-8" />
      </FadeIn>

      <FadeIn>
        <div className="mb-14 space-y-7">
          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            Every OpenComputer is a real machine - a full filesystem, full OS
            access, and persistent state. It hibernates when idle and wakes in
            seconds. No timeouts, no teardowns. Your computer is just there.
          </p>
          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            Think of it as the compute equivalent of a laptop that sleeps when
            you close the lid and is right where you left off when you open it.
            Except it's in the cloud, it scales to thousands, and you're not
            paying for it while it's asleep.
          </p>
        </div>
      </FadeIn>

      <FadeIn>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-14">
          {features.map((f) => (
            <div
              key={f.title}
              className="p-6 rounded-lg border border-border/50 bg-[hsl(0,0%,98%)] hover:border-foreground/20 transition-colors duration-150"
            >
              <h3 className="font-heading text-[18px] tracking-[-0.3px] mb-2">
                {f.title}
              </h3>
              <p className="text-[15px] leading-[1.7] text-muted-foreground">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </FadeIn>

      <FadeIn>
        <div className="my-14 rounded-lg overflow-hidden border border-border/50 shadow-lg">
          <div className="bg-[hsl(0,0%,95%)] border-b border-[hsl(0,0%,88%)] px-4 py-2.5 flex justify-between items-center">
            <div className="flex gap-2">
              <span className="w-3 h-3 rounded-full bg-[hsl(0,0%,75%)]" />
              <span className="w-3 h-3 rounded-full bg-[hsl(0,0%,75%)]" />
              <span className="w-3 h-3 rounded-full bg-[hsl(0,0%,75%)]" />
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono-brand text-xs text-[hsl(0,0%,55%)]">index.ts</span>
              <button
                onClick={handleCopy}
                className="text-[hsl(0,0%,55%)] hover:text-[hsl(0,0%,30%)] transition-colors"
                aria-label="Copy to clipboard"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div className="px-6 py-5 bg-[hsl(0,0%,8%)] font-mono-brand text-[13.5px] leading-[1.9] overflow-x-auto">
            <div><span className="text-[hsl(300,30%,68%)]">import</span> <span className="text-[hsl(0,0%,85%)]">{"{ Sandbox }"}</span> <span className="text-[hsl(300,30%,68%)]">from</span> <span className="text-[hsl(130,40%,60%)]">'@opencomputer/sdk'</span><span className="text-[hsl(0,0%,40%)]">;</span></div>
            <div className="h-4" />
            <div><span className="text-[hsl(0,0%,40%)]">// Create a sandbox</span></div>
            <div><span className="text-[hsl(300,30%,68%)]">const</span> <span className="text-[hsl(210,60%,70%)]">sandbox</span> <span className="text-[hsl(0,0%,85%)]">=</span> <span className="text-[hsl(300,30%,68%)]">await</span> <span className="text-[hsl(210,60%,70%)]">Sandbox</span><span className="text-[hsl(0,0%,85%)]">.</span><span className="text-[hsl(50,60%,70%)]">create</span><span className="text-[hsl(0,0%,85%)]">({"{"}</span> <span className="text-[hsl(210,60%,70%)]">template</span><span className="text-[hsl(0,0%,85%)]">:</span> <span className="text-[hsl(130,40%,60%)]">'default'</span> <span className="text-[hsl(0,0%,85%)]">{"}"})</span><span className="text-[hsl(0,0%,40%)]">;</span></div>
            <div className="h-4" />
            <div><span className="text-[hsl(0,0%,40%)]">// Run a command</span></div>
            <div><span className="text-[hsl(300,30%,68%)]">const</span> <span className="text-[hsl(210,60%,70%)]">result</span> <span className="text-[hsl(0,0%,85%)]">=</span> <span className="text-[hsl(300,30%,68%)]">await</span> <span className="text-[hsl(210,60%,70%)]">sandbox</span><span className="text-[hsl(0,0%,85%)]">.</span><span className="text-[hsl(210,60%,70%)]">commands</span><span className="text-[hsl(0,0%,85%)]">.</span><span className="text-[hsl(50,60%,70%)]">run</span><span className="text-[hsl(0,0%,85%)]">(</span><span className="text-[hsl(130,40%,60%)]">'node --version'</span><span className="text-[hsl(0,0%,85%)]">)</span><span className="text-[hsl(0,0%,40%)]">;</span></div>
            <div><span className="text-[hsl(210,60%,70%)]">console</span><span className="text-[hsl(0,0%,85%)]">.</span><span className="text-[hsl(50,60%,70%)]">log</span><span className="text-[hsl(0,0%,85%)]">(</span><span className="text-[hsl(210,60%,70%)]">result</span><span className="text-[hsl(0,0%,85%)]">.</span><span className="text-[hsl(210,60%,70%)]">stdout</span><span className="text-[hsl(0,0%,85%)]">)</span><span className="text-[hsl(0,0%,40%)]">;</span></div>
            <div className="h-4" />
            <div><span className="text-[hsl(0,0%,40%)]">// Work with files</span></div>
            <div><span className="text-[hsl(300,30%,68%)]">await</span> <span className="text-[hsl(210,60%,70%)]">sandbox</span><span className="text-[hsl(0,0%,85%)]">.</span><span className="text-[hsl(210,60%,70%)]">files</span><span className="text-[hsl(0,0%,85%)]">.</span><span className="text-[hsl(50,60%,70%)]">write</span><span className="text-[hsl(0,0%,85%)]">(</span><span className="text-[hsl(130,40%,60%)]">'/app/index.js'</span><span className="text-[hsl(0,0%,85%)]">,</span> <span className="text-[hsl(130,40%,60%)]">'console.log("hello")'</span><span className="text-[hsl(0,0%,85%)]">)</span><span className="text-[hsl(0,0%,40%)]">;</span></div>
            <div><span className="text-[hsl(300,30%,68%)]">const</span> <span className="text-[hsl(210,60%,70%)]">output</span> <span className="text-[hsl(0,0%,85%)]">=</span> <span className="text-[hsl(300,30%,68%)]">await</span> <span className="text-[hsl(210,60%,70%)]">sandbox</span><span className="text-[hsl(0,0%,85%)]">.</span><span className="text-[hsl(210,60%,70%)]">commands</span><span className="text-[hsl(0,0%,85%)]">.</span><span className="text-[hsl(50,60%,70%)]">run</span><span className="text-[hsl(0,0%,85%)]">(</span><span className="text-[hsl(130,40%,60%)]">'node /app/index.js'</span><span className="text-[hsl(0,0%,85%)]">)</span><span className="text-[hsl(0,0%,40%)]">;</span></div>
            <div><span className="text-[hsl(210,60%,70%)]">console</span><span className="text-[hsl(0,0%,85%)]">.</span><span className="text-[hsl(50,60%,70%)]">log</span><span className="text-[hsl(0,0%,85%)]">(</span><span className="text-[hsl(210,60%,70%)]">output</span><span className="text-[hsl(0,0%,85%)]">.</span><span className="text-[hsl(210,60%,70%)]">stdout</span><span className="text-[hsl(0,0%,85%)]">)</span><span className="text-[hsl(0,0%,40%)]">;</span> <span className="text-[hsl(0,0%,40%)]">// hello</span></div>
            <div className="h-4" />
            <div><span className="text-[hsl(0,0%,40%)]">// Clean up</span></div>
            <div><span className="text-[hsl(300,30%,68%)]">await</span> <span className="text-[hsl(210,60%,70%)]">sandbox</span><span className="text-[hsl(0,0%,85%)]">.</span><span className="text-[hsl(50,60%,70%)]">kill</span><span className="text-[hsl(0,0%,85%)]">()</span><span className="text-[hsl(0,0%,40%)]">;</span></div>
          </div>
        </div>
      </FadeIn>

      <FadeIn>
        <div className="my-14">
          <p className="font-heading text-[clamp(28px,4vw,38px)] leading-[1.35] tracking-[-0.8px] mb-6">
            Pricing
          </p>
          <p className="text-[17px] leading-[1.75] tracking-[-0.1px] mb-8">
            Resizable memory with proportional CPU. 20 GB disk per VM. Hibernated VMs are not billed.
          </p>

          <div className="p-8 rounded-xl border border-border/50 bg-[hsl(0,0%,98.5%)]">
            {/* Slider */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <p className="font-mono-brand text-[11px] uppercase tracking-[0.15em] text-muted-foreground">Memory</p>
                <p className="font-heading text-[28px] tracking-[-0.5px]">{pricingTiers[tierIndex].mem}</p>
              </div>
              <input
                type="range"
                min={0}
                max={pricingTiers.length - 1}
                value={tierIndex}
                onChange={(e) => setTierIndex(Number(e.target.value))}
                className="w-full h-2 rounded-full appearance-none cursor-pointer bg-border accent-foreground"
              />
              <div className="flex justify-between mt-2">
                <span className="font-mono-brand text-[11px] text-muted-foreground">256 MB</span>
                <span className="font-mono-brand text-[11px] text-muted-foreground">16 GB</span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center p-4 rounded-lg bg-white border border-border/50">
                <p className="font-heading text-[28px] tracking-[-0.5px]">{pricingTiers[tierIndex].cpu}</p>
                <p className="font-mono-brand text-[11px] text-muted-foreground mt-1">compute</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-white border border-border/50">
                <p className="font-heading text-[28px] tracking-[-0.5px]">{pricingTiers[tierIndex].month}<span className="text-[16px] text-muted-foreground">/mo</span></p>
                <p className="font-mono-brand text-[11px] text-muted-foreground mt-1">{pricingTiers[tierIndex].sec} / sec</p>
              </div>
            </div>
          </div>

          <p className="mt-4 text-[13px] text-muted-foreground">
            Need more? <a href="https://cal.com/team/digger/opencomputer-founder-chat" target="_blank" className="underline hover:text-foreground transition-colors">Talk to us</a> about custom sizing and volume discounts.
          </p>
        </div>
      </FadeIn>

      <FadeIn>
        <div className="my-14 space-y-7">
          <p className="font-heading text-[clamp(28px,4vw,38px)] leading-[1.35] tracking-[-0.8px]">
            Built for B2B agent platforms.
          </p>
          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            If you're building the next Lovable, Devin, or Bolt, your users
            don't just need a sandbox that runs a script and dies. They need a
            computer that remembers what it installed yesterday, keeps their
            files between sessions, and picks up exactly where it left off.
            Sandboxes give you isolation. OpenComputer gives you isolation{" "}
            <em className="font-heading text-[19px]">and</em> persistence.
          </p>
          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            Ephemeral sandboxes are stateless - every session starts from
            scratch. OpenComputer VMs are persistent - they stay on until you
            explicitly stop or delete them, so state survives across sessions
            without any extra work.
          </p>
          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            No more re-installing node_modules from scratch because the
            container timed out. Your VM stays alive as long as you need it.
            Need more CPU mid-session? Resize on the fly without restarting.
          </p>
        </div>
      </FadeIn>

      <FadeIn>
        <div className="my-14">
          <p className="font-heading text-[clamp(28px,4vw,38px)] leading-[1.35] tracking-[-0.8px] mb-8">
            Blog
          </p>
          <div className="space-y-4">
            <Link
              to="/blog/agent-execution-new-http-request"
              className="block p-6 rounded-lg border border-border/50 bg-[hsl(0,0%,98%)] hover:border-foreground/20 transition-colors duration-150 no-underline"
            >
              <h3 className="font-heading text-[22px] tracking-[-0.3px] mb-2 text-foreground">
                Agent Execution Is the New HTTP Request
              </h3>
              <p className="text-[15px] leading-[1.7] text-muted-foreground mb-3">
                From CGI scripts to serverless, web infrastructure evolved over 30 years. Now agents are taking us full circle.
              </p>
              <p className="font-mono-brand text-[12px] text-muted-foreground">
                Igor Zalutski &middot; March 17, 2026
              </p>
            </Link>
            <Link
              to="/blog/sandbox-fingerprinting"
              className="block p-6 rounded-lg border border-border/50 bg-[hsl(0,0%,98%)] hover:border-foreground/20 transition-colors duration-150 no-underline"
            >
              <h3 className="font-heading text-[22px] tracking-[-0.3px] mb-2 text-foreground">
                I Asked Opus 4.6 to Fingerprint Sandbox Vendors
              </h3>
              <p className="text-[15px] leading-[1.7] text-muted-foreground mb-3">
                We fingerprinted 6 sandbox providers to understand their isolation models. Here's what we found.
              </p>
              <p className="font-mono-brand text-[12px] text-muted-foreground">
                Mohamed Habib &middot; March 17, 2026
              </p>
            </Link>
            <Link
              to="/blog/the-agentic-workload"
              className="block p-6 rounded-lg border border-border/50 bg-[hsl(0,0%,98%)] hover:border-foreground/20 transition-colors duration-150 no-underline"
            >
              <h3 className="font-heading text-[22px] tracking-[-0.3px] mb-2 text-foreground">
                The Agentic Workload
              </h3>
              <p className="text-[15px] leading-[1.7] text-muted-foreground mb-3">
                Agent code doesn't fit neatly into existing categories. It's not a traditional app, and it's not a CI job. It's something new.
              </p>
              <p className="font-mono-brand text-[12px] text-muted-foreground">
                Igor Zalutski &middot; March 15, 2026
              </p>
            </Link>
            <Link
              to="/blog/building-open-lovable-part-1"
              className="block p-6 rounded-lg border border-border/50 bg-[hsl(0,0%,98%)] hover:border-foreground/20 transition-colors duration-150 no-underline"
            >
              <h3 className="font-heading text-[22px] tracking-[-0.3px] mb-2 text-foreground">
                Building an Open Lovable - part 1
              </h3>
              <p className="text-[15px] leading-[1.7] text-muted-foreground mb-3">
                A series to build a lovable clone to learn how lovable works under the hood using Claude Agent SDK and OpenComputer.
              </p>
              <p className="font-mono-brand text-[12px] text-muted-foreground">
                Mohamed Habib, CTO Digger &middot; March 11, 2026
              </p>
            </Link>
          </div>
        </div>
      </FadeIn>

      <FadeIn>
        <div className="mt-20 pt-14 border-t border-border">
          <div className="flex gap-3 items-center flex-wrap">
            <a
              href="https://app.opencomputer.dev"
              className="inline-block text-[15px] font-medium px-10 py-4 rounded-md bg-primary text-primary-foreground border border-primary hover:bg-foreground/90 transition-all duration-150"
            >
              Try it now &rarr;
            </a>
            <a
              href="https://cal.com/team/digger/opencomputer-founder-chat"
              target="_blank"
              className="inline-block text-sm font-medium px-7 py-3 rounded-md bg-background text-foreground border border-border hover:border-foreground transition-all duration-150"
            >
              Speak to founders
            </a>
          </div>
        </div>
      </FadeIn>
  </SitePageLayout>
  );
};

export default Index;
