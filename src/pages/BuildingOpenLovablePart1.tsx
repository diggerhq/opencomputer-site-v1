import { useState } from "react";
import { Link } from "react-router-dom";
import { Copy, Check } from "lucide-react";
import FadeIn from "@/components/FadeIn";

interface InlineCodeBlockProps {
  filename: string;
  code: string;
  children: React.ReactNode;
}

const InlineCodeBlock = ({ filename, code, children }: InlineCodeBlockProps) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="my-8 rounded-lg overflow-hidden border border-border/50 shadow-lg">
      <div className="bg-[hsl(0,0%,95%)] border-b border-[hsl(0,0%,88%)] px-4 py-2.5 flex justify-between items-center">
        <div className="flex gap-2">
          <span className="w-3 h-3 rounded-full bg-[hsl(0,0%,75%)]" />
          <span className="w-3 h-3 rounded-full bg-[hsl(0,0%,75%)]" />
          <span className="w-3 h-3 rounded-full bg-[hsl(0,0%,75%)]" />
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono-brand text-xs text-[hsl(0,0%,55%)]">
            {filename}
          </span>
          <button
            onClick={handleCopy}
            className="text-[hsl(0,0%,55%)] hover:text-[hsl(0,0%,30%)] transition-colors"
            aria-label="Copy to clipboard"
          >
            {copied ? (
              <Check className="w-4 h-4" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
      <pre className="px-6 py-5 bg-[hsl(0,0%,8%)] font-mono-brand text-[13.5px] leading-[1.9] overflow-x-auto text-[hsl(0,0%,85%)]">
        <code>{children}</code>
      </pre>
    </div>
  );
};

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
      <p className={`font-mono-brand text-[11px] mt-1 ${accent ? "text-background/60" : "text-muted-foreground"}`}>
        {sub}
      </p>
    )}
  </div>
);

const Arrow = ({ direction = "down" }: { direction?: "down" | "right" | "both" }) => (
  <div className={`flex items-center justify-center ${direction === "right" ? "" : "py-1"}`}>
    <span className="font-mono-brand text-[18px] text-muted-foreground select-none">
      {direction === "right" ? "\u2192" : direction === "both" ? "\u2194" : "\u2193"}
    </span>
  </div>
);

/* ---------- Code constants ---------- */
const CODE_SANDBOX = `// Create the sandbox via OpenComputer SDK
const sandbox = await Sandbox.create({
  template: "default",
  timeout: 600,
  apiKey: settings.apiKey,
  apiUrl: settings.apiUrl,
  envs: { ANTHROPIC_API_KEY: settings.anthropicApiKey },
  memoryMB: 1024,
  cpuCount: 2,
});

// Create a preview URL for the sandbox's port 80
const preview = await sandbox.createPreviewURL({ port: 80 });
const previewUrl = hostname.includes("nip.io")
  ? \`http://\${hostname}:8081\`
  : \`https://\${hostname}\`;


// Scaffold the Vite project and start the dev server
// (we do this so we have a placeholder app to display while our agent is cooking)
await scaffoldProject(sandbox);`;

const CODE_AGENT = `const session = await sandbox.agent.start({
  prompt,
  systemPrompt: SYSTEM_PROMPT,
  maxTurns: 30,
  cwd: "/workspace",
  onEvent: handleEvent,
});
}, [settings]);`;

const CODE_EVENTS = `const handleEvent = useCallback((event: AgentEvent) => {
  switch (event.type) {
    case "assistant": {
      // Extract text blocks and tool_use blocks from the assistant message
      const content = event.message?.content;
      if (Array.isArray(content)) {
        for (const block of content) {
          if (block.type === "text") {
            resetToolAccumulator();
            addLog("assistant", block.text);
          } else if (block.type === "tool_use") {
            addOrUpdateToolSummary(block.name, block.input);
          }
        }
      }
      break;
    }
    case "turn_complete":
      // Agent finished its turn — resolve the promise so we can scan files
      if (turnResolveRef.current) {
        turnResolveRef.current();
        turnResolveRef.current = null;
      }
      break;
    case "error":
      addLog("error", String(event.message));
      break;
  }
}, []);`;

const BuildingOpenLovablePart1 = () => {
  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="max-w-[994px] mx-auto px-10 py-6 flex items-center justify-between">
        <span
          className="glitch-logo font-mono text-[15px] font-medium tracking-tight text-foreground"
          data-text="digger"
        >
          <a
            href="https://digger.dev"
            target="_blank"
            className="font-display text-lg font-medium tracking-tight text-foreground logo-ai-hover cursor-pointer no-underline"
            data-text="digger"
          >
            digger
          </a>{" "}
          /{" "}
          <a
            href="/"
            className="font-display text-lg font-medium tracking-tight text-foreground logo-ai-hover cursor-pointer no-underline"
            data-text="digger"
          >
            opencomputer
          </a>
        </span>
        <div className="flex items-center gap-5">
          <Link
            to="/guides"
            className="font-mono-brand text-[13px] text-muted-foreground hover:text-foreground transition-colors no-underline"
          >
            guides
          </Link>
          <a
            href="https://github.com/diggerhq/opencomputer"
            target="_blank"
            className="font-mono-brand text-[13px] text-muted-foreground hover:text-foreground transition-colors no-underline flex items-center gap-1.5"
          >
            <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>
            GitHub
          </a>
        </div>
      </nav>

      {/* Article */}
      <article className="max-w-[994px] mx-auto px-10 pt-10 pb-[60px]">
        <FadeIn>
          <Link
            to="/guides"
            className="font-mono-brand text-[13px] text-muted-foreground hover:text-foreground transition-colors no-underline"
          >
            &larr; Back to guides
          </Link>
        </FadeIn>

        <FadeIn delay={0.04}>
          <h1 className="font-heading text-[clamp(36px,5vw,52px)] leading-[1.15] tracking-[-1.5px] mt-8 mb-4">
            Building an Open Lovable - part 1
          </h1>
        </FadeIn>

        <FadeIn delay={0.08}>
          <p className="font-mono-brand text-[13px] text-muted-foreground mb-10">
            Written by Mohamed Habib, CTO Digger &middot; March 11, 2026
          </p>
        </FadeIn>

        <FadeIn delay={0.12}>
          <div className="space-y-7">
            <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
              This is a series to build a lovable clone to learn how lovable works under
              the hood. You can test the final result{" "}
              <a
                href="https://openlovable.cc/"
                target="_blank"
                className="underline hover:text-muted-foreground transition-colors"
              >
                here
              </a>
              . You will need to grab an{" "}
              <a
                href="https://app.opencomputer.dev/"
                target="_blank"
                className="underline hover:text-muted-foreground transition-colors"
              >
                opencomputer
              </a>{" "}
              api key and an{" "}
              <a
                href="https://platform.claude.com/"
                target="_blank"
                className="underline hover:text-muted-foreground transition-colors"
              >
                anthropic api key
              </a>{" "}
              to test this demo. You can also check out the code on{" "}
              <a
                href="https://github.com/diggerhq/openlovable/tree/part1"
                target="_blank"
                className="underline hover:text-muted-foreground transition-colors"
              >
                github
              </a>
              . Lets dive in!
            </p>
          </div>
        </FadeIn>

        <FadeIn>
          <div className="w-12 h-px bg-border my-10" />
        </FadeIn>

        {/* ====== Section: The early days ====== */}
        <FadeIn>
          <h2 className="font-heading text-[clamp(28px,4vw,38px)] leading-[1.35] tracking-[-0.8px] mb-6">
            The early days - how agents were built back then
          </h2>
        </FadeIn>

        <FadeIn>
          <div className="space-y-7">
            <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
              A few years ago in the early days of GPT all we had was LLMs and apis
              around them, not much of the infra or patterns had been established. The
              way you would build something like lovable would be to scaffold alot of
              workflows around the LLM to make it happen. Lovable is a complex beast
              but at the heart of it we are generating a react app and previewing it.
              At the heart of it we have the user prompt "I want to create a todo app".
              This would then get appended to a system prompt in order to start
              generating the code in a structured way, file by file generated by the
              LLM and written to the file system. Of course our precious LLMs have
              limited context windows that we need to respect. So we can't just loop
              over and keep an ever growing context window. We need to do alot of
              workflows and context engineering around it. Basically we need to break
              the larger task of creating a react codebase into smaller subtasks to keep
              the smaller contexts under control. Each subtask will need to have the
              right context injected and the ability to query it (yep something like RAG
              to inject context). This is the part that currently people refer to as the
              agent loop or the "harness".
            </p>

            <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
              So that's the first part, the agentic loop. As code gets generated it
              also needs to get written to files so that we generate the preview. To
              keep our backend secure this code gets written to a remote isolated
              container somewhere. The container is able to serve this code as a web
              service and it is embedded into the application so that users are able to
              preview their creations. Yes as you guessed it - this is the part which we
              now refer to as the sandbox.
            </p>
          </div>
        </FadeIn>

        {/* ── Visual: Early architecture ── */}
        <FadeIn>
          <div className="my-12 p-8 rounded-xl border border-border/50 bg-[hsl(0,0%,98.5%)]">
            <p className="font-mono-brand text-[11px] uppercase tracking-[0.15em] text-muted-foreground mb-6">
              The early pattern
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 justify-center">
              <DiagramBox label="User Prompt" sub='"make me a todo app"' />
              <Arrow direction="right" />
              <DiagramBox label="System Prompt + LLM" sub="context engineering" />
              <Arrow direction="right" />
              <div className="flex flex-col gap-2">
                <DiagramBox label="Subtask 1" sub="generate App.tsx" />
                <DiagramBox label="Subtask 2" sub="generate styles" />
                <DiagramBox label="Subtask N" sub="..." />
              </div>
              <Arrow direction="right" />
              <DiagramBox label="File System" sub="write to sandbox" />
            </div>
          </div>
        </FadeIn>

        <FadeIn>
          <Callout>
            Each subtask needs the right context injected and the ability to query
            it. This is what people now call the agent loop or the "harness".
          </Callout>
        </FadeIn>

        <FadeIn>
          <div className="space-y-7">
            <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
              During the early days of lovable these terms and patterns were not
              established at all. Everything was brand new and people were figuring out
              these concepts out of thin air, I don't think that sandboxes as a category
              existed back then either. We also certainly did not have "harnesses" such
              as claude code as a tool at our disposal to use, we had to create our own.
              Maybe we only add langgraph, an amazing library which allowed us to
              assemble these agentic loops, workflows, do LLM tool calls and DIY a
              solution like the above.
            </p>

            <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
              As a result of how early we were patterns emerged in a certain direction.
              we had the sandbox as an isolated concept, and we had the agent loop
              living somewhere else doing its thing with the LLMs and eventually doing
              the codegen + writing to the remote sandbox.
            </p>

            <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
              Today we have ready harnesses that we can plugin to make our life easier,
              while they come with their drawbacks they are damn good most of the time
              and can do the job. In many cases you can get very far re-using a harness
              such as agent sdk instead of rolling your own.
            </p>

            <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
              We have a similar story for the sandboxes of the world. Many sandboxes
              started as a disposable place to run some code and then get destroyed
              quickly. "Run AI code" was the theme of these sandboxes.
            </p>

            <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
              As a result of how these two categories evolved early, we traditionally
              would run the agent loop somewhere and then eventually have the agent loop
              communicate with a remote sandbox to run code, write files and whatnot.
              This decision made sense back then, but I don't think that it makes sense
              today. With sandboxes being more and more established it makes sense to
              run our agent loop <em className="font-heading">inside</em> the sandbox.
              This gives us alot of benefits - 1/ it is simpler to manage one component,
              2/ there is less latency when it comes to reading and writing files.
            </p>
          </div>
        </FadeIn>

        {/* ── Visual: Old vs New comparison ── */}
        <FadeIn>
          <div className="my-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Old way */}
            <div className="p-6 rounded-xl border border-border/50 bg-[hsl(0,0%,98.5%)]">
              <p className="font-mono-brand text-[11px] uppercase tracking-[0.15em] text-muted-foreground mb-5">
                Before &mdash; separated
              </p>
              <div className="space-y-3">
                <div className="p-4 rounded-lg border border-dashed border-[hsl(0,70%,65%)] bg-[hsl(0,70%,97%)]">
                  <p className="font-mono-brand text-[12px] font-medium text-[hsl(0,50%,40%)]">Your Server</p>
                  <div className="mt-3 space-y-2">
                    <DiagramBox label="Agent Loop" sub="LLM calls, tool use, RAG" />
                    <DiagramBox label="Context Management" sub="langgraph / custom" />
                  </div>
                </div>
                <Arrow />
                <p className="font-mono-brand text-[11px] text-center text-muted-foreground">network calls, latency</p>
                <Arrow />
                <div className="p-4 rounded-lg border border-dashed border-border bg-white">
                  <p className="font-mono-brand text-[12px] font-medium text-muted-foreground">Remote Sandbox</p>
                  <div className="mt-3">
                    <DiagramBox label="File System + Preview" sub="ephemeral, dies on timeout" />
                  </div>
                </div>
              </div>
            </div>

            {/* New way */}
            <div className="p-6 rounded-xl border border-foreground/20 bg-[hsl(0,0%,98.5%)]">
              <p className="font-mono-brand text-[11px] uppercase tracking-[0.15em] text-muted-foreground mb-5">
                Now &mdash; unified
              </p>
              <div className="p-4 rounded-lg border-2 border-foreground/80 bg-white">
                <p className="font-mono-brand text-[12px] font-medium text-foreground">OpenComputer VM</p>
                <div className="mt-3 space-y-2">
                  <DiagramBox label="Claude Agent SDK" sub="harness + agent loop" accent />
                  <DiagramBox label="File System" sub="read/write instantly, no network" />
                  <DiagramBox label="Preview Server" sub="served from same VM" />
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="font-mono-brand text-[11px] text-muted-foreground">
                    hibernates when idle, wakes in seconds
                  </span>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>

        <FadeIn>
          <div className="space-y-7">
            <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
              <a
                href="https://opencomputer.dev/"
                target="_blank"
                className="underline hover:text-muted-foreground transition-colors"
              >
                OpenComputer
              </a>{" "}
              helps here, it gives users a long-lived sandbox environment to run agent
              loops inside. The sandboxes hibernate and wakeup quickly, so they never
              die. We are going to build our open lovable clone around open computer.
              Since this is being written in 2026, we are going to package a ready-made
              harness - claude agent sdk - into a sandbox and have it do its thing with
              the agentic loop, and we will surface its thinking to the users as it
              goes. Similarly we will serve a preview of the app right from the same
              sandbox VM.
            </p>
          </div>
        </FadeIn>

        <FadeIn>
          <Callout>
            Our setup is so simple that all it takes is a react app to do the most
            basic clone of lovable &mdash; no servers needed!
          </Callout>
        </FadeIn>

        <FadeIn>
          <div className="w-12 h-px bg-border my-10" />
        </FadeIn>

        {/* ====== Section: Building step by step ====== */}
        <FadeIn>
          <h2 className="font-heading text-[clamp(28px,4vw,38px)] leading-[1.35] tracking-[-0.8px] mb-6">
            Building the open lovable step by step
          </h2>
        </FadeIn>

        <FadeIn>
          <div className="space-y-7">
            <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
              So the user just typed their prompt to create the generational app, what
              next? Lets go through step by step
            </p>
          </div>
        </FadeIn>

        {/* ── Visual: Flow overview ── */}
        <FadeIn>
          <div className="my-10 p-8 rounded-xl border border-border/50 bg-[hsl(0,0%,98.5%)]">
            <p className="font-mono-brand text-[11px] uppercase tracking-[0.15em] text-muted-foreground mb-6">
              The 4-step flow
            </p>
            <div className="flex flex-col sm:flex-row items-stretch gap-0">
              {[
                { num: "1", label: "Create Sandbox", sub: "OpenComputer SDK" },
                { num: "2", label: "Start Agent", sub: "Claude Agent SDK" },
                { num: "3", label: "Stream Events", sub: "tool calls + thinking" },
                { num: "4", label: "Follow Up", sub: "same session, multi-turn" },
              ].map((step, i) => (
                <div key={step.num} className="flex items-center flex-1">
                  <div className="flex-1 text-center p-4">
                    <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-foreground text-background font-mono-brand text-[13px] font-bold mb-2">
                      {step.num}
                    </div>
                    <p className="font-mono-brand text-[13px] font-medium">{step.label}</p>
                    <p className="font-mono-brand text-[11px] text-muted-foreground mt-0.5">{step.sub}</p>
                  </div>
                  {i < 3 && (
                    <span className="hidden sm:block font-mono-brand text-[18px] text-muted-foreground select-none px-1">
                      {"\u2192"}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* Step 1 */}
        <FadeIn>
          <h3 className="font-heading text-[22px] tracking-[-0.3px] mt-10 mb-4">
            1/ Create the sandbox
          </h3>
          <p className="text-[17px] leading-[1.75] tracking-[-0.1px] mb-4">
            Of course, since without the sandbox we have no place to run our agent!
          </p>
          <InlineCodeBlock filename="sandbox.ts" code={CODE_SANDBOX}>
            <span className="text-[hsl(0,0%,40%)]">{"// Create the sandbox via OpenComputer SDK"}</span>{"\n"}
            <span className="text-[hsl(300,30%,68%)]">const</span> <span className="text-[hsl(210,60%,70%)]">sandbox</span> = <span className="text-[hsl(300,30%,68%)]">await</span> Sandbox.<span className="text-[hsl(50,60%,70%)]">create</span>({"{"}{"\n"}
            {"  "}<span className="text-[hsl(210,60%,70%)]">template</span>: <span className="text-[hsl(130,40%,60%)]">"default"</span>,{"\n"}
            {"  "}<span className="text-[hsl(210,60%,70%)]">timeout</span>: <span className="text-[hsl(35,70%,65%)]">600</span>,{"\n"}
            {"  "}<span className="text-[hsl(210,60%,70%)]">apiKey</span>: settings.apiKey,{"\n"}
            {"  "}<span className="text-[hsl(210,60%,70%)]">apiUrl</span>: settings.apiUrl,{"\n"}
            {"  "}<span className="text-[hsl(210,60%,70%)]">envs</span>: {"{"} <span className="text-[hsl(210,60%,70%)]">ANTHROPIC_API_KEY</span>: settings.anthropicApiKey {"}"},  {"\n"}
            {"  "}<span className="text-[hsl(210,60%,70%)]">memoryMB</span>: <span className="text-[hsl(35,70%,65%)]">1024</span>,{"\n"}
            {"  "}<span className="text-[hsl(210,60%,70%)]">cpuCount</span>: <span className="text-[hsl(35,70%,65%)]">2</span>,{"\n"}
            {"}"});{"\n"}
            {"\n"}
            <span className="text-[hsl(0,0%,40%)]">{"// Create a preview URL for the sandbox's port 80"}</span>{"\n"}
            <span className="text-[hsl(300,30%,68%)]">const</span> <span className="text-[hsl(210,60%,70%)]">preview</span> = <span className="text-[hsl(300,30%,68%)]">await</span> sandbox.<span className="text-[hsl(50,60%,70%)]">createPreviewURL</span>({"{"} <span className="text-[hsl(210,60%,70%)]">port</span>: <span className="text-[hsl(35,70%,65%)]">80</span> {"}"});{"\n"}
            <span className="text-[hsl(300,30%,68%)]">const</span> <span className="text-[hsl(210,60%,70%)]">previewUrl</span> = hostname.<span className="text-[hsl(50,60%,70%)]">includes</span>(<span className="text-[hsl(130,40%,60%)]">"nip.io"</span>){"\n"}
            {"  "}? <span className="text-[hsl(130,40%,60%)]">{"`http://${hostname}:8081`"}</span>{"\n"}
            {"  "}: <span className="text-[hsl(130,40%,60%)]">{"`https://${hostname}`"}</span>;{"\n"}
            {"\n"}
            {"\n"}
            <span className="text-[hsl(0,0%,40%)]">{"// Scaffold the Vite project and start the dev server"}</span>{"\n"}
            <span className="text-[hsl(0,0%,40%)]">{"// (we do this so we have a placeholder app to display while our agent is cooking)"}</span>{"\n"}
            <span className="text-[hsl(300,30%,68%)]">await</span> <span className="text-[hsl(50,60%,70%)]">scaffoldProject</span>(sandbox);
          </InlineCodeBlock>
        </FadeIn>

        {/* ── Visual: What the sandbox gives us ── */}
        <FadeIn>
          <div className="my-10 grid grid-cols-3 gap-4">
            {[
              { label: "2 vCPU", sub: "compute" },
              { label: "1 GB RAM", sub: "memory" },
              { label: "Port 80", sub: "preview URL" },
            ].map((item) => (
              <div
                key={item.label}
                className="p-5 rounded-lg border border-border/50 bg-[hsl(0,0%,98%)] text-center"
              >
                <p className="font-heading text-[24px] tracking-[-0.5px]">{item.label}</p>
                <p className="font-mono-brand text-[11px] text-muted-foreground mt-1">{item.sub}</p>
              </div>
            ))}
          </div>
        </FadeIn>

        {/* Step 2 */}
        <FadeIn>
          <h3 className="font-heading text-[22px] tracking-[-0.3px] mt-10 mb-4">
            2/ Start a Claude Agent SDK session
          </h3>
          <p className="text-[17px] leading-[1.75] tracking-[-0.1px] mb-4">
            Conveniently opencomputer gives us a nice abstraction around that too:
          </p>
          <InlineCodeBlock filename="agent.ts" code={CODE_AGENT}>
            <span className="text-[hsl(300,30%,68%)]">const</span> <span className="text-[hsl(210,60%,70%)]">session</span> = <span className="text-[hsl(300,30%,68%)]">await</span> sandbox.agent.<span className="text-[hsl(50,60%,70%)]">start</span>({"{"}{"\n"}
            {"  "}<span className="text-[hsl(210,60%,70%)]">prompt</span>,{"\n"}
            {"  "}<span className="text-[hsl(210,60%,70%)]">systemPrompt</span>: SYSTEM_PROMPT,{"\n"}
            {"  "}<span className="text-[hsl(210,60%,70%)]">maxTurns</span>: <span className="text-[hsl(35,70%,65%)]">30</span>,{"\n"}
            {"  "}<span className="text-[hsl(210,60%,70%)]">cwd</span>: <span className="text-[hsl(130,40%,60%)]">"/workspace"</span>,{"\n"}
            {"  "}<span className="text-[hsl(210,60%,70%)]">onEvent</span>: handleEvent,{"\n"}
            {"}"});
          </InlineCodeBlock>
          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            Oh btw, this is our{" "}
            <a
              href="https://github.com/diggerhq/openlovable/blob/main/src/hooks/useSandboxAgent.ts#L6"
              target="_blank"
              className="underline hover:text-muted-foreground transition-colors"
            >
              system prompt
            </a>{" "}
            in case you are curious. Prompt is what the user inputs.
          </p>
        </FadeIn>

        {/* ── Visual: What the agent session gives us ── */}
        <FadeIn>
          <div className="my-10 p-6 rounded-xl border border-border/50 bg-[hsl(0,0%,98.5%)]">
            <p className="font-mono-brand text-[11px] uppercase tracking-[0.15em] text-muted-foreground mb-4">
              Inside the agent session
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-4 rounded-lg bg-white border border-border/50">
                <span className="flex-shrink-0 w-6 h-6 rounded bg-foreground text-background font-mono-brand text-[11px] flex items-center justify-center font-bold">P</span>
                <div>
                  <p className="font-mono-brand text-[13px] font-medium">Prompt</p>
                  <p className="font-mono-brand text-[11px] text-muted-foreground mt-0.5">User's request + system instructions</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-lg bg-white border border-border/50">
                <span className="flex-shrink-0 w-6 h-6 rounded bg-foreground text-background font-mono-brand text-[11px] flex items-center justify-center font-bold">30</span>
                <div>
                  <p className="font-mono-brand text-[13px] font-medium">Max Turns</p>
                  <p className="font-mono-brand text-[11px] text-muted-foreground mt-0.5">Up to 30 agentic iterations per request</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-lg bg-white border border-border/50">
                <span className="flex-shrink-0 w-6 h-6 rounded bg-foreground text-background font-mono-brand text-[11px] flex items-center justify-center font-bold">/</span>
                <div>
                  <p className="font-mono-brand text-[13px] font-medium">Working Dir</p>
                  <p className="font-mono-brand text-[11px] text-muted-foreground mt-0.5">/workspace &mdash; where the code lives</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-lg bg-white border border-border/50">
                <span className="flex-shrink-0 w-6 h-6 rounded bg-foreground text-background font-mono-brand text-[11px] flex items-center justify-center font-bold">fn</span>
                <div>
                  <p className="font-mono-brand text-[13px] font-medium">Event Stream</p>
                  <p className="font-mono-brand text-[11px] text-muted-foreground mt-0.5">Real-time tool calls + thinking to UI</p>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Step 3 */}
        <FadeIn>
          <h3 className="font-heading text-[22px] tracking-[-0.3px] mt-10 mb-4">
            3/ Stream events back to the UI
          </h3>
          <p className="text-[17px] leading-[1.75] tracking-[-0.1px] mb-4">
            Now the agent.start interface also allows us to stream back all the tool
            calling and thinking happening within our agent loop which is running in
            our sandbox. So we get back all these messages that we can then display
            nicely to our user, this is what our handleEvent callback looks like:
          </p>
          <InlineCodeBlock filename="events.ts" code={CODE_EVENTS}>
            <span className="text-[hsl(300,30%,68%)]">const</span> <span className="text-[hsl(210,60%,70%)]">handleEvent</span> = <span className="text-[hsl(50,60%,70%)]">useCallback</span>((event: AgentEvent) =&gt; {"{"}{"\n"}
            {"  "}<span className="text-[hsl(300,30%,68%)]">switch</span> (event.type) {"{"}{"\n"}
            {"    "}<span className="text-[hsl(300,30%,68%)]">case</span> <span className="text-[hsl(130,40%,60%)]">"assistant"</span>: {"{"}{"\n"}
            {"      "}<span className="text-[hsl(0,0%,40%)]">{"// Extract text blocks and tool_use blocks from the assistant message"}</span>{"\n"}
            {"      "}<span className="text-[hsl(300,30%,68%)]">const</span> <span className="text-[hsl(210,60%,70%)]">content</span> = event.message?.content;{"\n"}
            {"      "}<span className="text-[hsl(300,30%,68%)]">if</span> (Array.<span className="text-[hsl(50,60%,70%)]">isArray</span>(content)) {"{"}{"\n"}
            {"        "}<span className="text-[hsl(300,30%,68%)]">for</span> (<span className="text-[hsl(300,30%,68%)]">const</span> block <span className="text-[hsl(300,30%,68%)]">of</span> content) {"{"}{"\n"}
            {"          "}<span className="text-[hsl(300,30%,68%)]">if</span> (block.type === <span className="text-[hsl(130,40%,60%)]">"text"</span>) {"{"}{"\n"}
            {"            "}<span className="text-[hsl(50,60%,70%)]">resetToolAccumulator</span>();{"\n"}
            {"            "}<span className="text-[hsl(50,60%,70%)]">addLog</span>(<span className="text-[hsl(130,40%,60%)]">"assistant"</span>, block.text);{"\n"}
            {"          "}{"}"} <span className="text-[hsl(300,30%,68%)]">else if</span> (block.type === <span className="text-[hsl(130,40%,60%)]">"tool_use"</span>) {"{"}{"\n"}
            {"            "}<span className="text-[hsl(50,60%,70%)]">addOrUpdateToolSummary</span>(block.name, block.input);{"\n"}
            {"          "}{"}"}{"\n"}
            {"        "}{"}"}{"\n"}
            {"      "}{"}"}{"\n"}
            {"      "}<span className="text-[hsl(300,30%,68%)]">break</span>;{"\n"}
            {"    "}{"}"}{"\n"}
            {"    "}<span className="text-[hsl(300,30%,68%)]">case</span> <span className="text-[hsl(130,40%,60%)]">"turn_complete"</span>:{"\n"}
            {"      "}<span className="text-[hsl(0,0%,40%)]">{"// Agent finished its turn — resolve the promise so we can scan files"}</span>{"\n"}
            {"      "}<span className="text-[hsl(300,30%,68%)]">if</span> (turnResolveRef.current) {"{"}{"\n"}
            {"        "}turnResolveRef.current();{"\n"}
            {"        "}turnResolveRef.current = <span className="text-[hsl(300,30%,68%)]">null</span>;{"\n"}
            {"      "}{"}"}{"\n"}
            {"      "}<span className="text-[hsl(300,30%,68%)]">break</span>;{"\n"}
            {"    "}<span className="text-[hsl(300,30%,68%)]">case</span> <span className="text-[hsl(130,40%,60%)]">"error"</span>:{"\n"}
            {"      "}<span className="text-[hsl(50,60%,70%)]">addLog</span>(<span className="text-[hsl(130,40%,60%)]">"error"</span>, String(event.message));{"\n"}
            {"      "}<span className="text-[hsl(300,30%,68%)]">break</span>;{"\n"}
            {"  "}{"}"}{"\n"}
            {"}"}, []);
          </InlineCodeBlock>
        </FadeIn>

        {/* ── Visual: Event types ── */}
        <FadeIn>
          <div className="my-10 overflow-hidden rounded-xl border border-border/50">
            <div className="bg-[hsl(0,0%,95%)] border-b border-[hsl(0,0%,88%)] px-5 py-3">
              <p className="font-mono-brand text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
                Event types your UI handles
              </p>
            </div>
            <div className="divide-y divide-border/50">
              {[
                {
                  event: "assistant",
                  tag: "text",
                  tagColor: "bg-blue-100 text-blue-700",
                  desc: "LLM thinking and responses displayed to the user",
                },
                {
                  event: "assistant",
                  tag: "tool_use",
                  tagColor: "bg-amber-100 text-amber-700",
                  desc: "File writes, shell commands, code generation in progress",
                },
                {
                  event: "turn_complete",
                  tag: "done",
                  tagColor: "bg-green-100 text-green-700",
                  desc: "Agent finished \u2014 refresh preview and fetch file tree",
                },
                {
                  event: "error",
                  tag: "error",
                  tagColor: "bg-red-100 text-red-700",
                  desc: "Something went wrong, surface it to the user",
                },
              ].map((row, i) => (
                <div key={i} className="flex items-center gap-4 px-5 py-4 bg-white">
                  <code className="font-mono-brand text-[13px] text-foreground w-[130px] flex-shrink-0">
                    {row.event}
                  </code>
                  <span
                    className={`font-mono-brand text-[11px] px-2 py-0.5 rounded-full flex-shrink-0 ${row.tagColor}`}
                  >
                    {row.tag}
                  </span>
                  <p className="text-[14px] text-muted-foreground">{row.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>

        <FadeIn>
          <div className="space-y-7">
            <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
              And once we get the agent signaling is done{" "}
              <code className="font-mono-brand text-[15px] bg-[hsl(0,0%,93%)] px-1.5 py-0.5 rounded">
                turn_complete
              </code>{" "}
              we then do the final refresh from the preview url and fetch all the files
              so that our file browser can showcase that to the user.
            </p>
          </div>
        </FadeIn>

        {/* Step 4 */}
        <FadeIn>
          <h3 className="font-heading text-[22px] tracking-[-0.3px] mt-10 mb-4">
            4/ Follow up requests and conversations
          </h3>
          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            For follow ups from the user we do the same process, while ensuring that
            all the follow up messages use the same claude session for context reasons.
            Once again leaving all the messages history and context management back to
            claude agent sdk to handle.
          </p>
        </FadeIn>

        {/* ── Visual: Multi-turn flow ── */}
        <FadeIn>
          <div className="my-10 p-6 rounded-xl border border-border/50 bg-[hsl(0,0%,8%)] text-[hsl(0,0%,85%)]">
            <p className="font-mono-brand text-[11px] uppercase tracking-[0.15em] text-[hsl(0,0%,50%)] mb-5">
              Multi-turn conversation
            </p>
            <div className="space-y-3 font-mono-brand text-[13px] leading-[1.8]">
              <div className="flex gap-3">
                <span className="text-[hsl(210,60%,70%)] flex-shrink-0">user</span>
                <span className="text-[hsl(130,40%,60%)]">"make me a todo app"</span>
              </div>
              <div className="flex gap-3">
                <span className="text-[hsl(35,70%,65%)] flex-shrink-0">agent</span>
                <span className="text-[hsl(0,0%,50%)]">
                  creates App.tsx, TodoList.tsx, styles.css ...{" "}
                  <span className="text-green-400">done</span>
                </span>
              </div>
              <div className="h-px bg-[hsl(0,0%,20%)]" />
              <div className="flex gap-3">
                <span className="text-[hsl(210,60%,70%)] flex-shrink-0">user</span>
                <span className="text-[hsl(130,40%,60%)]">"add dark mode and a filter dropdown"</span>
              </div>
              <div className="flex gap-3">
                <span className="text-[hsl(35,70%,65%)] flex-shrink-0">agent</span>
                <span className="text-[hsl(0,0%,50%)]">
                  modifies styles.css, updates App.tsx ...{" "}
                  <span className="text-green-400">done</span>
                </span>
              </div>
              <div className="h-px bg-[hsl(0,0%,20%)]" />
              <div className="flex gap-3 items-center">
                <span className="text-[hsl(210,60%,70%)] flex-shrink-0">user</span>
                <span className="text-[hsl(0,0%,50%)] animate-pulse">|</span>
              </div>
            </div>
            <p className="font-mono-brand text-[11px] text-[hsl(0,0%,40%)] mt-4">
              same session, full context preserved across turns
            </p>
          </div>
        </FadeIn>

        <FadeIn>
          <div className="w-12 h-px bg-border my-10" />
        </FadeIn>

        {/* ====== Summary ====== */}
        <FadeIn>
          <h2 className="font-heading text-[clamp(28px,4vw,38px)] leading-[1.35] tracking-[-0.8px] mb-6">
            Summary and next parts
          </h2>
        </FadeIn>

        <FadeIn>
          <div className="space-y-7">
            <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
              So we've implemented a basic lovable clone using the claude code harness
              and opencomputer in this guide. We are able to retrive and display the
              basic url and have multi turn conversations with the user. In the next
              parts we will deal with different aspects on making this basic prototype
              better:
            </p>

            <ol className="list-decimal list-inside space-y-3 text-[17px] leading-[1.75] tracking-[-0.1px] pl-2">
              <li>How to deal with longer conversations and context compaction</li>
              <li>
                How to allow users to deploy their creations and share them with others
                - including private URLs
              </li>
              <li>
                Dealing with more complex apps that have backend, DB, auth, generating
                them for users and having different integrations with other APIs (which
                is where the lovable magic is)
              </li>
              <li>
                Customising the harness and creating your own so that you are able to
                roll your own agent loops to have more control over the outcome over how
                things work during the code generation
              </li>
            </ol>

            <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
              Stay tuned!
            </p>
          </div>
        </FadeIn>

      </article>

      {/* Footer */}
      <footer className="max-w-[994px] mx-auto px-10 py-10 border-t border-border flex items-center justify-between">
        <span className="font-mono-brand text-[13px] text-muted-foreground">
          &copy; 2026 opencomputer by{" "}
          <span className="underline">
            <a
              href="https://digger.dev"
              target="_blank"
              data-text="digger"
            >
              digger
            </a>
          </span>
        </span>
        <a
          href="https://github.com/diggerhq/opencomputer"
          target="_blank"
          className="font-mono-brand text-[13px] text-muted-foreground hover:text-foreground transition-colors no-underline flex items-center gap-1.5"
        >
          <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>
          GitHub
        </a>
      </footer>
    </div>
  );
};

export default BuildingOpenLovablePart1;
