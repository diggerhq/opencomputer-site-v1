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
    title: "Persistent VMs",
    description:
      "Hibernate/wake instead of timeouts. Your VM sleeps when idle and wakes in seconds -right where you left off.",
  },
  {
    title: "Checkpoints",
    description:
      "Instant snapshots. Fork or restore to any point. Break something, roll back in a second.",
  },
  {
    title: "Preview URLs",
    description:
      "Expose ports externally with auth (Clerk) and custom domains. Give every environment a live URL.",
  },
  {
    title: "Per-tenant package control",
    description:
      "Manage and hot-swap software versions inside running VMs. Every tenant gets exactly the stack they need.",
  },
];

const Index = () => {
  const [copied, setCopied] = useState(false);
  // TODO: Hide this link behind a preview/local toggle before production launch.

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
            Pay per VM-hour. Hibernated VMs don't count.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-6 rounded-lg border border-border/50 bg-[hsl(0,0%,98%)]">
              <p className="font-mono-brand text-[11px] uppercase tracking-[0.15em] text-muted-foreground mb-4">Free</p>
              <p className="font-heading text-[36px] tracking-[-1px] mb-1">$0</p>
              <p className="font-mono-brand text-[13px] text-muted-foreground mb-6">forever</p>
              <div className="space-y-2.5 text-[14px]">
                <p>Up to 2 vCPU (shared)</p>
                <p>Up to 2 GB RAM (shared)</p>
                <p>3 GB disk per VM</p>
                <p>5 concurrent VMs</p>
              </div>
            </div>
            <div className="p-6 rounded-lg border-2 border-foreground/80 bg-[hsl(0,0%,98%)]">
              <p className="font-mono-brand text-[11px] uppercase tracking-[0.15em] text-muted-foreground mb-4">Pro</p>
              <p className="font-heading text-[36px] tracking-[-1px] mb-1">$0.04<span className="text-[20px] text-muted-foreground">/hr</span></p>
              <p className="font-mono-brand text-[13px] text-muted-foreground mb-6">per vCPU-hour</p>
              <div className="space-y-2.5 text-[14px]">
                <p>Up to 64 vCPU per VM</p>
                <p>Up to 512 GB RAM</p>
                <p>Expandable disk</p>
                <p>Unlimited concurrent VMs</p>
              </div>
            </div>
            <div className="p-6 rounded-lg border border-border/50 bg-[hsl(0,0%,98%)]">
              <p className="font-mono-brand text-[11px] uppercase tracking-[0.15em] text-muted-foreground mb-4">Enterprise</p>
              <p className="font-heading text-[36px] tracking-[-1px] mb-1">Custom</p>
              <p className="font-mono-brand text-[13px] text-muted-foreground mb-6">volume discounts</p>
              <div className="space-y-2.5 text-[14px]">
                <p>Dedicated infrastructure</p>
                <p>Custom VM sizes</p>
                <p>Priority support</p>
                <p><a href="https://cal.com/team/digger/opencomputer-founder-chat" target="_blank" className="underline hover:text-muted-foreground transition-colors">Talk to us</a></p>
              </div>
            </div>
          </div>
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
            scratch. OpenComputer VMs are stateful - they hibernate instead of
            dying, so state survives across sessions without you having to
            snapshot/restore manually.
          </p>
          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            No more re-installing node_modules from scratch because the
            container died between API calls. Your VM stays alive as long as
            you need it. When it's idle, it hibernates to disk, not nuked.
          </p>
        </div>
      </FadeIn>

      <FadeIn>
        <div className="my-14">
          <p className="font-heading text-[clamp(28px,4vw,38px)] leading-[1.35] tracking-[-0.8px] mb-8">
            Guides
          </p>
          <Link
            to="/guides/building-open-lovable-part-1"
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
      </FadeIn>

      <FadeIn>
        <div className="mt-20 pt-14 border-t border-border">
          <div className="flex gap-3 items-center flex-wrap">
            <a
              href="https://app.opencomputer.dev"
              className="inline-block text-sm font-medium px-7 py-3 rounded-md bg-primary text-primary-foreground border border-primary hover:bg-foreground/90 transition-all duration-150"
            >
              Get started
            </a>
            <a
              href="https://docs.opencomputer.dev"
              className="inline-block text-sm font-medium px-7 py-3 rounded-md bg-background text-foreground border border-border hover:border-foreground transition-all duration-150"
            >
              Read the docs
            </a>
            <a
              href="https://github.com/diggerhq/opencomputer"
              target="_blank"
              className="inline-flex items-center gap-2 text-sm font-medium px-7 py-3 rounded-md bg-background text-foreground border border-border hover:border-foreground transition-all duration-150"
            >
              <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" /></svg>
              Star on GitHub
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
