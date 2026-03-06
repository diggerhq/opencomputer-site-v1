import { useState } from "react";
import { Copy, Check } from "lucide-react";
import FadeIn from "@/components/FadeIn";

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

  const handleCopy = () => {
    navigator.clipboard.writeText(SDK_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
  <div className="min-h-screen">
    {/* Nav */}
    <nav className="max-w-[994px] mx-auto px-10 py-6 flex items-center justify-between">
      <span
        className="glitch-logo font-mono text-[15px] font-medium tracking-tight text-foreground"
        data-text="opencomputer"
      >
        <a
          href="/"
          className="font-display text-lg font-medium tracking-tight text-foreground logo-ai-hover cursor-pointer no-underline"
          data-text="digger"
        >
          digger
        </a>{" "}
        / opencomputer
      </span>
    </nav>

    {/* Main */}
    <main className="max-w-[994px] mx-auto px-10 pt-10 pb-[60px]">
      <FadeIn>
        <h1 className="font-heading text-[clamp(42px,6vw,64px)] leading-[1.15] tracking-[-1.5px] mb-10">
          Agents are becoming the application.
        </h1>
      </FadeIn>

      <FadeIn delay={0.08}>
        <div className="mb-10 space-y-7">
          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            Today, people build an app and the app calls an agent to do a task.
            The app is the product, the agent is a feature. That's{" "}
            <em className="font-heading text-[19px]">sandbox-as-tool</em>{" "}
            territory.
          </p>
          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            We think the agent <em className="font-heading text-[19px]">is</em>{" "}
            the product. Someone builds a support agent, a research agent, a
            coding agent -that agent needs to live somewhere, have a URL, and
            run. Stop treating it like a function call. Deploy it like a
            service.
          </p>
        </div>
      </FadeIn>

      <FadeIn delay={0.16}>
        <p className="font-heading text-[clamp(28px,4vw,38px)] leading-[1.35] tracking-[-0.8px] mt-2 mb-2">
          And services need computers, not sandboxes.
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
          </div>
        </div>
      </FadeIn>
    </main>

    {/* Footer */}
    <footer className="max-w-[994px] mx-auto px-10 py-10 border-t border-border">
      <span className="font-mono-brand text-[13px] text-muted-foreground">
        © 2026 opencomputer by{" "}
        <span className="underline">
          <a
            href="/"
            data-text="digger"
          >
            digger
          </a>
        </span>
      </span>
    </footer>
  </div>
  );
};

export default Index;
