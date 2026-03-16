import { Link } from "react-router-dom";
import FadeIn from "@/components/FadeIn";
import SitePageLayout from "@/components/SitePageLayout";

/* ---------- Callout ---------- */
const Callout = ({ children }: { children: React.ReactNode }) => (
  <div className="my-8 pl-5 border-l-[3px] border-foreground/80 py-1">
    <p className="font-heading text-[19px] leading-[1.65] tracking-[-0.2px] italic text-foreground/85">
      {children}
    </p>
  </div>
);

const TheAgenticWorkload = () => {
  return (
    <SitePageLayout activeSection="blog" contentAs="article">
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
            The Agentic Workload
          </h1>
        </FadeIn>

        <FadeIn delay={0.08}>
          <p className="font-mono-brand text-[13px] text-muted-foreground mb-10">
            Written by Igor Zalutski &middot; March 15, 2026
          </p>
        </FadeIn>

        <FadeIn delay={0.12}>
          <div className="space-y-7">
            <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
              For a while now I've been sitting on this uneasy feeling that the code we write when
              building agents does not fit nicely into any of the existing "kinds" of code that we are
              used to from the pre-AI era. But I didn't know why; the only hunch I had was that every
              time I made another agent, the code that I wrote came out awkward - and it wasn't Claude's
              fault. It took embarrassingly many repetitions of building the same thing over and over
              again for it to "click". It feels obvious in hindsight assuming a few plausible priors are true.
            </p>
          </div>
        </FadeIn>

        <FadeIn>
          <div className="w-12 h-px bg-border my-10" />
        </FadeIn>

        {/* ====== Section: Leading coding agents are CLIs ====== */}
        <FadeIn>
          <h2 className="font-heading text-[clamp(28px,4vw,38px)] leading-[1.35] tracking-[-0.8px] mb-6">
            Leading coding agents are CLIs for a reason
          </h2>
        </FadeIn>

        <FadeIn>
          <div className="space-y-7">
            <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
              Claude Code, Codex, Amp and similar command-line agents are so universally loved because
              their creators have figured something counterintuitive: for the "right" system design of
              an agent to become practically useful without disastrous security consequences, most of
              the existing developer infrastructure needs to be rebuilt for agentic autonomy. You could
              wait for that to happen - or you could ship something that works{" "}
              <em className="font-heading">today</em>, even if it looks somewhat{" "}
              <em className="font-heading">wrong</em>.
            </p>
          </div>
        </FadeIn>

        {/* ── Visual: "Right" vs "Wrong" design — whiteboard vs terminal ── */}
        <FadeIn>
          <div className="my-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* "Right" design — whiteboard style with strikethrough */}
            <div className="p-6 rounded-xl bg-white relative overflow-hidden" style={{ backgroundImage: "radial-gradient(circle, hsl(0,0%,85%) 1px, transparent 1px)", backgroundSize: "24px 24px" }}>
              <div className="absolute top-4 right-4">
                <span className="font-mono-brand text-[11px] px-2 py-1 rounded-full bg-[hsl(0,70%,95%)] text-[hsl(0,50%,45%)]">
                  doesn't work
                </span>
              </div>
              <p className="font-heading text-[20px] tracking-[-0.3px] mb-5 text-foreground/70">
                The "right" design
              </p>
              <div className="space-y-4 relative">
                <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                  <div className="w-[110%] h-[3px] bg-[hsl(0,65%,55%)] -rotate-12 opacity-60" />
                </div>
                <div className="text-center p-3 rounded border border-dashed border-[hsl(0,0%,75%)] text-[hsl(0,0%,50%)] font-mono-brand text-[12px]">
                  Stateless Server
                </div>
                <div className="text-center font-mono-brand text-[14px] text-[hsl(0,0%,70%)]">&darr;</div>
                <div className="grid grid-cols-3 gap-2">
                  {["git", "npm", "docker"].map((t) => (
                    <div key={t} className="text-center p-2 rounded border border-dashed border-[hsl(0,0%,75%)] text-[hsl(0,0%,50%)] font-mono-brand text-[11px]">
                      {t} ???
                    </div>
                  ))}
                </div>
                <p className="font-mono-brand text-[11px] text-[hsl(0,0%,55%)] text-center italic pt-2">
                  these live on laptops, not behind APIs
                </p>
              </div>
            </div>

            {/* "Wrong" design — terminal style */}
            <div className="rounded-xl overflow-hidden border border-[hsl(0,0%,20%)]">
              <div className="bg-[hsl(0,0%,12%)] px-4 py-2.5 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[hsl(0,60%,55%)]" />
                <span className="w-3 h-3 rounded-full bg-[hsl(45,80%,55%)]" />
                <span className="w-3 h-3 rounded-full bg-[hsl(120,50%,50%)]" />
                <span className="ml-auto font-mono-brand text-[11px] px-2 py-0.5 rounded-full bg-[hsl(120,40%,20%)] text-[hsl(120,50%,65%)]">
                  just works
                </span>
              </div>
              <div className="bg-[hsl(0,0%,8%)] p-5 font-mono-brand text-[13px] leading-[2] text-[hsl(0,0%,55%)]">
                <p><span className="text-[hsl(120,50%,65%)]">$</span> <span className="text-[hsl(0,0%,85%)]">npm install -g claude-code</span></p>
                <p><span className="text-[hsl(120,50%,65%)]">$</span> <span className="text-[hsl(0,0%,85%)]">claude</span></p>
                <p className="mt-2 text-[hsl(210,60%,70%)]">&#9656; Agent has access to:</p>
                <div className="ml-4 space-y-0.5 text-[hsl(0,0%,70%)]">
                  <p>git, npm, docker, databases</p>
                  <p>your codebase (read/write)</p>
                  <p>all terminal tools</p>
                  <p>no network overhead</p>
                </div>
                <p className="mt-3 flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[hsl(0,0%,50%)]">ready</span>
                </p>
              </div>
            </div>
          </div>
        </FadeIn>

        <FadeIn>
          <div className="space-y-7">
            <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
              What does the <em className="font-heading">right</em> design look like? An agent is basically LLM
              calls with tools in a loop. It reacts to user input, produces outputs, manages context, and so
              on. One might naturally design such a thing as a stateless server-side application, running in a
              container or a serverless function. Tools would be API calls, each tool cleanly abstracting away
              the internals. On a whiteboard this looks great! Scalability, reliability, all that.
            </p>

            <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
              The only problem is this <em className="font-heading">right</em> design doesn't work. Not
              because of technical reasons; but because the code that the agent needs to modify doesn't sit
              neatly in one github repo waiting to be pulled. It's not even about the code - it's about all
              the countless utilities and services that developers use for building. They are all on their
              laptops - and no one is going to bother setting up remote development environments just to try
              this new AI thing.
            </p>

            <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
              The <em className="font-heading">wrong</em> design on the other hand solves it beautifully.
              A CLI meets developers where they are - there's no need to set up anything else other than
              installing Claude Code or Codex. If a tool can be used by hand in the terminal, the agent can
              use it too. This way the actual development environment is fully at the harness's disposal.
              Also no networking overhead on calling remote services for every step - so it feels snappy,
              much more so than first-gen cloud-based agents.
            </p>
          </div>
        </FadeIn>

        <FadeIn>
          <Callout>
            The "wrong" design works because it meets developers where they are.
            A CLI agent has access to everything a developer has &mdash; no setup, no remote environments, no API abstractions.
          </Callout>
        </FadeIn>

        <FadeIn>
          <div className="w-12 h-px bg-border my-10" />
        </FadeIn>

        {/* ====== Section: The rise of harness-based agent SDKs ====== */}
        <FadeIn>
          <h2 className="font-heading text-[clamp(28px,4vw,38px)] leading-[1.35] tracking-[-0.8px] mb-6">
            The rise of harness-based agent SDKs
          </h2>
        </FadeIn>

        <FadeIn>
          <div className="space-y-7">
            <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
              The best coding agents are indeed CLIs - but that does not mean that agentic coding can now
              only happen on people's laptops! All sorts of code-generating agents are exploding in
              popularity, many of which are fully autonomous, or are built for non-technical users.
              For example apps like Lovable allow anyone to create a fully functional application in a
              few prompts in the browser; Greptile reviews pull requests for bugs and security; many
              other agents are built for implementing fixes or entire features in response to Slack
              mentions or Linear tickets.
            </p>

            <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
              All such agents work with code - so if you are building one, which agent framework should
              you use? Turns out Claude, Codex and other CLI harnesses got so good that if you choose a
              conventional LLM framework like Langchain or AI SDK you'll have to put in a lot of work
              just to match their performance with code, especially on more challenging assignments that
              might take longer. Anthropic and other coding CLI creators put in a lot of effort into
              their agents to make them stable in a wide range of coding scenarios; matching that is
              anything but trivial.
            </p>
          </div>
        </FadeIn>

        {/* ── Visual: Evolution — stacking layers ── */}
        <FadeIn>
          <div className="my-12">
            <p className="font-mono-brand text-[11px] uppercase tracking-[0.15em] text-muted-foreground mb-6">
              The shift: from DIY to harness SDKs
            </p>
            <div className="space-y-3">
              {[
                { label: "Official SDKs", sub: "Claude Agent SDK, Codex SDK", width: "100%", opacity: "1", bg: "bg-foreground", text: "text-background", subText: "text-background/50" },
                { label: "People shelling out to CLIs", sub: "calling Claude Code / Codex from app code", width: "82%", opacity: "0.9", bg: "bg-[hsl(0,0%,15%)]", text: "text-[hsl(0,0%,90%)]", subText: "text-[hsl(0,0%,55%)]" },
                { label: "CLI Agents", sub: "Claude Code, Codex, Amp — the breakthrough", width: "64%", opacity: "0.8", bg: "bg-[hsl(0,0%,25%)]", text: "text-[hsl(0,0%,85%)]", subText: "text-[hsl(0,0%,55%)]" },
                { label: "DIY Harness", sub: "Langchain, AI SDK, custom loops", width: "46%", opacity: "0.6", bg: "bg-[hsl(0,0%,88%)]", text: "text-[hsl(0,0%,40%)]", subText: "text-[hsl(0,0%,60%)]" },
              ].reverse().map((layer) => (
                <div
                  key={layer.label}
                  className={`${layer.bg} rounded-lg px-5 py-4 transition-all`}
                  style={{ width: layer.width, opacity: layer.opacity }}
                >
                  <p className={`font-mono-brand text-[13px] font-medium ${layer.text}`}>{layer.label}</p>
                  <p className={`font-mono-brand text-[11px] mt-0.5 ${layer.subText}`}>{layer.sub}</p>
                </div>
              ))}
            </div>
            <p className="font-mono-brand text-[11px] text-muted-foreground mt-4 italic">
              Each layer builds on the one below &mdash; the industry converged on wrapping CLI harnesses, not replacing them.
            </p>
          </div>
        </FadeIn>

        <FadeIn>
          <div className="space-y-7">
            <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
              Realising that, people started simply calling Codex or Claude CLIs in their applications -
              and achieved superior performance compared to a DIY harness. Big labs noticed that pattern,
              and shipped SDKs that make such usage easier while still relying on the harness CLI under
              the hood ({" "}
              <a
                href="https://platform.claude.com/docs/en/agent-sdk/overview"
                target="_blank"
                className="underline hover:text-muted-foreground transition-colors"
              >
                Claude Agent SDK
              </a>
              ,{" "}
              <a
                href="https://developers.openai.com/codex/sdk/"
                target="_blank"
                className="underline hover:text-muted-foreground transition-colors"
              >
                Codex SDK
              </a>
              ). Bill Chen from OpenAI{" "}
              <a
                href="https://youtu.be/wVl6ZjELpBk?t=712"
                target="_blank"
                className="underline hover:text-muted-foreground transition-colors"
              >
                suggests
              </a>{" "}
              to "shift your mindset" - stop making direct model calls and treat the harness as the
              pluggable building block instead.
            </p>
          </div>
        </FadeIn>

        <FadeIn>
          <Callout>
            "Shift your mindset" &mdash; stop making direct model calls and treat the harness
            as the pluggable building block instead.
          </Callout>
        </FadeIn>

        <FadeIn>
          <div className="w-12 h-px bg-border my-10" />
        </FadeIn>

        {/* ====== Section: So where does my agent live? ====== */}
        <FadeIn>
          <h2 className="font-heading text-[clamp(28px,4vw,38px)] leading-[1.35] tracking-[-0.8px] mb-6">
            So where does my agent live?
          </h2>
        </FadeIn>

        <FadeIn>
          <div className="space-y-7">
            <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
              Because leading coding agents are CLIs, the most useful SDKs for building coding agents
              ended up built around those CLIs. So if you are building an agent with Claude Agent SDK,
              it will shell out to the Claude Code CLI to do its thing. If you are new to building agents
              but built some web apps or distributed systems before, you might be freaking out - and
              rightfully so! What do you mean it <em className="font-heading">shells out</em>??? Like,
              starting another process… on the same host where my application runs? For every request???
              Forget scalability or even basic reliability - because it's going to read and write files
              also, oh and could also run arbitrary code.
            </p>

            <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
              These properties make the code written with these SDKs much more similar to a CI job in
              nature than it is to an application. Because every "run" of an agent could potentially
              overwrite or delete any file if the harness decides so; also its resource consumption profile
              cannot be known beforehand. But at the same time, it's clearly an application - an agent
              might need to respond to user requests, make API calls and so on. However deploying such
              code to destinations that the application code is traditionally deployed to - like containers
              or serverless functions - is clearly not a good idea, for the reasons stated above.
              So what do we do?
            </p>
          </div>
        </FadeIn>

        {/* ── Visual: Spectrum — app to CI with agent in the middle ── */}
        <FadeIn>
          <div className="my-12">
            {/* The agent marker — centered, above the spectrum */}
            <div className="flex justify-center mb-4">
              <div className="bg-foreground text-background px-5 py-3 rounded-lg text-center relative">
                <p className="font-mono-brand text-[13px] font-bold">Agentic Workload</p>
                <p className="font-mono-brand text-[10px] mt-0.5 text-background/60">interactive + destructive + unpredictable</p>
                {/* Arrow pointing down to spectrum */}
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-r-[8px] border-t-[12px] border-l-transparent border-r-transparent border-t-foreground" />
              </div>
            </div>

            {/* The spectrum bar */}
            <div className="h-3 rounded-full mt-2" style={{ background: "linear-gradient(to right, hsl(210,50%,92%), hsl(0,0%,15%), hsl(35,60%,90%))" }} />

            {/* Labels on the spectrum */}
            <div className="flex justify-between mt-3">
              <div className="text-left">
                <p className="font-mono-brand text-[13px] font-medium">Traditional App</p>
                <p className="font-mono-brand text-[11px] text-muted-foreground mt-1 max-w-[180px]">
                  Predictable, stateless, doesn't touch the filesystem
                </p>
              </div>
              <div className="text-right">
                <p className="font-mono-brand text-[13px] font-medium">CI Job</p>
                <p className="font-mono-brand text-[11px] text-muted-foreground mt-1 max-w-[180px]">
                  Isolated, runs anything, fire-and-forget
                </p>
              </div>
            </div>

            {/* Properties comparison — horizontal rows */}
            <div className="mt-12 space-y-2">
              {[
                { prop: "Responds to requests", app: true, agent: true, ci: false },
                { prop: "Makes API calls", app: true, agent: true, ci: false },
                { prop: "Interactive / multi-turn", app: true, agent: true, ci: false },
                { prop: "Runs arbitrary code", app: false, agent: true, ci: true },
                { prop: "Modifies files freely", app: false, agent: true, ci: true },
                { prop: "Isolated environment", app: false, agent: true, ci: true },
                { prop: "Predictable resources", app: true, agent: false, ci: false },
              ].map((row) => (
                <div key={row.prop} className="flex items-center gap-2 font-mono-brand text-[12px]">
                  <span className="w-[200px] flex-shrink-0 text-muted-foreground truncate">{row.prop}</span>
                  <span className={`w-16 text-center flex-shrink-0 ${row.app ? "text-foreground" : "text-[hsl(0,0%,82%)]"}`}>
                    {row.app ? "●" : "○"}
                  </span>
                  <span className={`w-16 text-center flex-shrink-0 font-bold ${row.agent ? "text-foreground" : "text-[hsl(0,0%,82%)]"}`}>
                    {row.agent ? "●" : "○"}
                  </span>
                  <span className={`w-16 text-center flex-shrink-0 ${row.ci ? "text-foreground" : "text-[hsl(0,0%,82%)]"}`}>
                    {row.ci ? "●" : "○"}
                  </span>
                </div>
              ))}
              {/* Column headers at bottom */}
              <div className="flex items-center gap-2 font-mono-brand text-[10px] text-muted-foreground uppercase tracking-[0.1em] pt-2 border-t border-border/50">
                <span className="w-[200px] flex-shrink-0" />
                <span className="w-16 text-center flex-shrink-0">App</span>
                <span className="w-16 text-center flex-shrink-0 font-bold text-foreground">Agent</span>
                <span className="w-16 text-center flex-shrink-0">CI</span>
              </div>
            </div>
          </div>
        </FadeIn>

        <FadeIn>
          <div className="w-12 h-px bg-border my-10" />
        </FadeIn>

        {/* ====== Section: The Agentic Workload ====== */}
        <FadeIn>
          <h2 className="font-heading text-[clamp(28px,4vw,38px)] leading-[1.35] tracking-[-0.8px] mb-6">
            The Agentic Workload
          </h2>
        </FadeIn>

        <FadeIn>
          <div className="space-y-7">
            <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
              Anthropic wrote a detailed{" "}
              <a
                href="https://platform.claude.com/docs/en/agent-sdk/hosting"
                target="_blank"
                className="underline hover:text-muted-foreground transition-colors"
              >
                guide
              </a>{" "}
              on Agent SDK deployment patterns. Regardless of which pattern you pick, you'll likely end
              up implementing some of the following in your application:
            </p>
          </div>
        </FadeIn>

        {/* ── Visual: Vertical pipeline — what you'll end up building ── */}
        <FadeIn>
          <div className="my-10 max-w-[520px] mx-auto">
            <p className="font-mono-brand text-[11px] uppercase tracking-[0.15em] text-muted-foreground mb-6">
              What every agent deployment ends up needing
            </p>
            {[
              { label: "Gateway Service", desc: "always-on, handles webhooks & requests", icon: "⚙" },
              { label: "Message Queue", desc: "buffers requests while sandbox spins up", icon: "☰" },
              { label: "Ad-hoc Sandbox", desc: "isolated env per session, lifecycle tracked", icon: "□" },
              { label: "Your Agent Code", desc: "injected into the sandbox at runtime", icon: "▷" },
            ].map((item, i) => (
              <div key={item.label}>
                <div className="flex items-stretch gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full border-2 border-foreground flex items-center justify-center text-[16px]">
                      {item.icon}
                    </div>
                    {i < 3 && <div className="w-px flex-1 bg-foreground/20 my-1" />}
                  </div>
                  <div className="pb-6">
                    <p className="font-mono-brand text-[14px] font-medium">{item.label}</p>
                    <p className="font-mono-brand text-[12px] text-muted-foreground mt-0.5">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
            <p className="font-mono-brand text-[11px] text-muted-foreground mt-2 italic ml-14">
              ...regardless of what your agent actually does.
            </p>
          </div>
        </FadeIn>

        <FadeIn>
          <div className="space-y-7">
            <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
              Pretty much every agent using Claude Agent SDK or Codex SDK will end up doing something
              similar, regardless of what the agent does (other than generate some code).
            </p>

            <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
              It's a new type of workload - not a traditional backend service; and not a frontend. This
              type of workload doesn't (yet) have an obvious "home" - as in, here are some services I
              could deploy it to. But that's strange; because for every piece of code that works locally
              (and such agents obviously do work locally) there's typically a range of services they can
              be deployed into. I think this is something that will be solved in the near future and we'll
              see some new awesome dev platforms emerge.
            </p>
          </div>
        </FadeIn>

        <FadeIn>
          <Callout>
            It's a new type of workload &mdash; not a traditional backend service, and not a frontend.
            For every piece of code that works locally there's typically a range of services it can be
            deployed into. This one doesn't have a home yet.
          </Callout>
        </FadeIn>

        <FadeIn>
          <div className="w-12 h-px bg-border my-10" />
        </FadeIn>

        {/* ====== References ====== */}
        <FadeIn>
          <h2 className="font-heading text-[clamp(28px,4vw,38px)] leading-[1.35] tracking-[-0.8px] mb-6">
            References
          </h2>
        </FadeIn>

        <FadeIn>
          <ul className="space-y-4 text-[17px] leading-[1.75] tracking-[-0.1px] list-none pl-0">
            <li className="flex items-start gap-3">
              <span className="font-mono-brand text-[13px] text-muted-foreground mt-1 flex-shrink-0">&rarr;</span>
              <a
                href="https://michaellivs.com/blog/sandbox-comparison-2026"
                target="_blank"
                className="underline hover:text-muted-foreground transition-colors"
              >
                A thousand ways to sandbox an agent
              </a>
            </li>
            <li className="flex items-start gap-3">
              <span className="font-mono-brand text-[13px] text-muted-foreground mt-1 flex-shrink-0">&rarr;</span>
              <a
                href="https://x.com/hwchase17/status/2021261552222158955"
                target="_blank"
                className="underline hover:text-muted-foreground transition-colors"
              >
                The two patterns by which agents connect sandboxes
              </a>
            </li>
            <li className="flex items-start gap-3">
              <span className="font-mono-brand text-[13px] text-muted-foreground mt-1 flex-shrink-0">&rarr;</span>
              <a
                href="https://fly.io/blog/code-and-let-live/"
                target="_blank"
                className="underline hover:text-muted-foreground transition-colors"
              >
                Code and Let Live by fly.io
              </a>
            </li>
          </ul>
        </FadeIn>
    </SitePageLayout>
  );
};

export default TheAgenticWorkload;
