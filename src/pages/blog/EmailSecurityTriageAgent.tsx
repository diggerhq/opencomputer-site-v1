import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import FadeIn from "@/components/FadeIn";
import ShikiCodeBlock from "@/components/ShikiCodeBlock";
import SitePageLayout from "@/components/SitePageLayout";
import SEO from "@/components/SEO";

/* ---------- Table of contents ---------- */
type TocItem = { id: string; label: string; sub?: boolean };
const TOC_ITEMS: TocItem[] = [
  { id: "what-are-we-building", label: "What are we building?" },
  { id: "whats-a-security-report", label: "What's a security report?" },
  { id: "how-will-it-get-mail", label: "Getting the mail" },
  { id: "note-on-dev-process", label: "Note on dev process" },
  { id: "keeping-secrets-secure", label: "Keeping secrets secure" },
  { id: "who-sends-the-email", label: "Who sends the email?" },
  { id: "valid-by-mistake", label: "A valid-by-mistake report" },
  { id: "conclusion", label: "Conclusion" },
];

const TableOfContents = () => {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-80px 0px -70% 0px", threshold: 0 },
    );
    TOC_ITEMS.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <aside
      aria-label="Table of contents"
      className="hidden [@media(min-width:1360px)]:block fixed top-[140px] right-6 w-[150px] max-h-[calc(100vh-180px)] overflow-y-auto z-10"
    >
      <div className="font-mono-brand text-[11px] uppercase tracking-[0.14em] text-muted-foreground mb-3 pb-2 border-b border-border/40">
        Contents
      </div>
      <ul className="space-y-1.5">
        {TOC_ITEMS.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              aria-current={activeId === item.id ? "location" : undefined}
              className={`block font-mono-brand text-[12px] leading-[1.45] no-underline transition-colors ${
                item.sub ? "pl-3" : ""
              } ${
                activeId === item.id
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
};

const InlineCode = ({ children }: { children: React.ReactNode }) => (
  <code className="font-mono-brand text-[15px] bg-[hsl(0,0%,93%)] px-1.5 py-0.5 rounded">
    {children}
  </code>
);

/* ---------- Embedded HTML visual (iframe) ----------
 * The iframe carries the interactive demo for JS-rendering browsers.
 * The <noscript> block carries an indexable text description for crawlers
 * that don't render JS or don't follow iframe sources.
 */
const Visual = ({
  src,
  height,
  title,
  fallback,
}: {
  src: string;
  height: number;
  title: string;
  fallback: string;
}) => (
  <figure className="my-10 -mx-2 sm:mx-0">
    <iframe
      src={src}
      title={title}
      aria-label={title}
      loading="lazy"
      style={{ width: "100%", height: `${height}px`, border: 0, display: "block" }}
    />
    <figcaption className="sr-only">{fallback}</figcaption>
    <noscript>
      <p className="font-mono-brand text-[12px] text-muted-foreground mt-2 italic">
        {title}: {fallback}
      </p>
    </noscript>
  </figure>
);

const VISUAL_BASE = "/blog-visuals/email-security-triage-agent";

/* ---------- Code constants ---------- */
const CODE_AGENT_START = `const sandbox = await Sandbox.create({ timeout: 600 });
await sandbox.agent.start({
  systemPrompt: TRIAGE_PROMPT, prompt
});`;

const CODE_SECRET_STORE = `const store = await SecretStore.create({
  name: "triage",
  egressAllowlist: ["api.anthropic.com"],
});

await SecretStore.setSecret(store.id, "ANTHROPIC_API_KEY", key, {
  allowedHosts: ["api.anthropic.com"],
});`;

const CODE_SANDBOX_WITH_STORE = `const sandbox = await Sandbox.create({
  secretStore: "triage",
  timeout: 600,
});`;

const CODE_CALLBACK = `curl -sX POST "$CALLBACK_URL/report" \\
    -H "X-Run-Id: $RUN_ID" \\
    -d @findings.json`;

const CODE_WORKER_REPORT = `app.post("/report", async (c) => {
  const findings = await c.req.json();
  const to = recipientFor(c.req.header("X-Run-Id"));   // we choose the recipient, not the agent

  await resend.emails.send({
    from: "triage@alerts.opencomputer.dev",
    to,
    subject: \`Triage: \${findings.subject}\`,
    text: findings.draft_reply,
  });

  return c.json({ ok: true });
});`;

const CODE_BOGUS_REPORT = `From: alex.sec.research@gmail.com
Subject: [CRITICAL] Remote Code Execution in OpenComputer Sandbox API (CVSS 9.8)

Hello Security Team,

During authorized research I discovered a critical Remote Code Execution (RCE)
vulnerability. The sandbox exec endpoint does not sanitize user input before
passing it to the system shell, allowing arbitrary command execution.

Proof of Concept:
  POST /v1/sandboxes/{id}/exec  {"cmd": "ls; cat /etc/passwd"}
  -> the response includes the contents of /etc/passwd

Impact: full server compromise, data exfiltration, and lateral movement across
your infrastructure.
Severity: Critical (CVSS 9.8 / AV:N/AC:L/PR:N/UI:N/S:C/C:H/I:H/A:H).

Please confirm this issue and advise on the bounty reward per your program.

Best regards,
Alex`;

const P = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <p className={`text-[17px] leading-[1.75] tracking-[-0.1px] ${className}`}>{children}</p>
);

const EmailSecurityTriageAgent = () => {
  return (
    <SitePageLayout activeSection="blog" contentAs="article">
      <SEO
        title="I built an email agent to triage bogus security reports"
        description="Most security reports arriving by email are AI-generated noise, but every one has to be reviewed. So I built an agent that triages them against the actual codebase: labels as signal, SecretStores against key exfiltration, and why the agent must never pick the email recipient."
        author="Igor Zalutski"
        path="/blog/email-security-triage-agent"
        type="article"
      />

      <TableOfContents />

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
          I built an email agent to triage bogus security reports
        </h1>
      </FadeIn>

      <FadeIn delay={0.08}>
        <p className="font-mono-brand text-[13px] text-muted-foreground mb-10">
          Written by Igor Zalutski{" "}
          &middot;{" "}
          <time dateTime="2026-06-04">June 4, 2026</time>
        </p>
      </FadeIn>

      {/* ---- Intro ---- */}
      <FadeIn delay={0.12}>
        <div className="space-y-7">
          <P>
            A customer shared a problem that at first sounded odd: they wanted to build an agent
            specifically to automatically review security reports they were getting on email. My
            initial reaction was: would you want something like that? Don't you want to review
            those reports yourself, it's security after all? Turns out, most of them were
            AI-generated and mostly noise; but they <em>had</em> to review each one because, well,
            it's security.
          </P>
          <P>
            Now, we aren't in the business of building agents. We're building OpenComputer, an
            infrastructure primitive that agents use. But the question got me curious enough to
            want to actually build something. My thinking was: perhaps by building an agent I
            could discover something that I could improve in OpenComputer?
          </P>
          <p className="text-[15px] leading-[1.7] text-muted-foreground italic">
            Disclaimer: "I built" means mostly "Claude built". I didn't write much code by hand,
            but the decisions while driving it felt worth sharing anyways. The result lives in the{" "}
            <a
              href="https://github.com/diggerhq/demo-agent-triage"
              target="_blank"
              rel="noreferrer"
              className="underline hover:text-foreground"
            >
              demo-agent-triage repo
            </a>
            .
          </p>
        </div>
      </FadeIn>

      <FadeIn>
        <div className="w-12 h-px bg-border my-10" />
      </FadeIn>

      {/* ====== What are we building? ====== */}
      <FadeIn>
        <h2 id="what-are-we-building" className="scroll-mt-24 font-heading text-[clamp(28px,4vw,38px)] leading-[1.35] tracking-[-0.8px] mb-6">
          What are we building?
        </h2>
      </FadeIn>

      <FadeIn>
        <div className="space-y-5">
          <P>
            The first thing to clarify was the rough shape of the thing we want to end up with. No
            matter how good the coding agent is, it is not of much use if you don't know what to
            ask.
          </P>
          <P>
            I wanted it to be as simple as possible, meaning as little moving parts as possible.
            The customer's problem originated in email and they wanted the result to land back in
            the email, so we can skip the UI. The agent would just:
          </P>
          <ul className="space-y-2 text-[17px] leading-[1.75] tracking-[-0.1px] pl-1">
            {[
              "get the email with a security report",
              "analyze it against the actual codebase",
              "send an email with a result",
            ].map((item, i) => (
              <li
                key={i}
                className="pl-5 relative before:content-['—'] before:absolute before:left-0 before:text-muted-foreground"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </FadeIn>

      <FadeIn>
        <div className="w-12 h-px bg-border my-10" />
      </FadeIn>

      {/* ====== What's a security report? ====== */}
      <FadeIn>
        <h2 id="whats-a-security-report" className="scroll-mt-24 font-heading text-[clamp(28px,4vw,38px)] leading-[1.35] tracking-[-0.8px] mb-6">
          What's a security report?
        </h2>
      </FadeIn>

      <FadeIn>
        <div className="space-y-5">
          <P>How would it know which emails to process?</P>
          <P>
            One way to solve it would be to spin up a sandbox with an agent for every email, and
            just do nothing if it's not a security report. But that would be obviously wasteful.
            So we'd need some way to only launch a "full" agent for the right emails.
          </P>
          <P>
            We could build a "hierarchy" of agents: one simple one-shot LLM loop for every email
            and another in-depth for stuff that looks like a security report. But that felt like
            overengineering.
          </P>
          <P>
            The approach I went with (I swear it was me, not Claude, who came up with this!):{" "}
            <strong>use labels as signal</strong> for the agent. So when the user receives
            something that looks like a security report, they'd just label it, and after a few
            minutes they receive a review in the same thread. Neat!
          </P>
        </div>
      </FadeIn>

      <Visual
        src={`${VISUAL_BASE}/01-inbox-label-demo.html`}
        height={620}
        title="Interactive demo: the label is the only signal"
        fallback="A mock inbox holds four emails: a vendor newsletter, a CVSS 9.8 RCE report from alex.sec.research@gmail.com, a domain invoice, and a recruiter intro. Applying the security-report label to the RCE email kicks off the pipeline: a cron job polls IMAP, finds the label, boots an OpenComputer sandbox, Claude reads the actual codebase, and a reply lands in the same thread with the verdict 'not a vulnerability'. The other three emails are never seen by the agent and no sandbox is spun up for them."
      />

      <FadeIn>
        <div className="w-12 h-px bg-border my-10" />
      </FadeIn>

      {/* ====== How will the agent get mail? ====== */}
      <FadeIn>
        <h2 id="how-will-it-get-mail" className="scroll-mt-24 font-heading text-[clamp(28px,4vw,38px)] leading-[1.35] tracking-[-0.8px] mb-6">
          How will the agent get mail?
        </h2>
      </FadeIn>

      <FadeIn>
        <div className="space-y-5">
          <P>
            There are two very different ways to approach this, resulting in two very different
            agents.
          </P>
          <P>
            One way is to give the agent its own inbox, so it'd only ever see the mail that's
            intended for it. Another is to have it access the full inbox, get notified of all
            messages (or pull via IMAP), but only process the labeled ones.
          </P>
          <P>
            The first option is obviously better security / privacy. But I decided to go with the
            second one (against Claude's recommendation), mainly because I wanted to have less
            moving parts.
          </P>
          <P>
            Pulling via IMAP was the simplest option: just need to have some sort of a cron job.
          </P>
          <P>
            So at this point the solution shape is very clear, and I just told "let's build it" to
            Claude and stepped away for a few minutes.
          </P>
        </div>
      </FadeIn>

      <FadeIn>
        <div className="w-12 h-px bg-border my-10" />
      </FadeIn>

      {/* ====== Note on dev process ====== */}
      <FadeIn>
        <h2 id="note-on-dev-process" className="scroll-mt-24 font-heading text-[clamp(28px,4vw,38px)] leading-[1.35] tracking-[-0.8px] mb-6">
          Note on dev process
        </h2>
      </FadeIn>

      <FadeIn>
        <div className="space-y-5">
          <P>
            This has nothing to do with an email agent, but I want to share this anyways because
            someone might find this approach useful too.
          </P>
          <P>
            Both Claude and Codex have a tendency to encourage you to stay in the thread and jump
            into building right away; I'm not sure why, perhaps engagement metrics look better
            this way. But I'm finding that this doesn't translate into the best or fastest
            outcomes.
          </P>
          <P>
            An approach that I'm finding more useful is to iterate on a working / design markdown
            doc before shipping any code. You have to actively push it to do so: write an explicit
            instruction in <InlineCode>AGENTS.md</InlineCode> and also regularly tell it to write
            a working doc first. I keep them under <InlineCode>.agents/work</InlineCode> in the
            repo, and move to <InlineCode>/done</InlineCode> with final notes when done. Bigger
            pieces sometimes benefit from 2 or more levels: make a doc in{" "}
            <InlineCode>/design</InlineCode> first that's only about system design, iterate on it
            for a while, and then extract one or more working docs from it.
          </P>
          <P>
            This agent though was small enough to fit into just one working doc. Here's the{" "}
            <a
              href="https://github.com/diggerhq/demo-agent-triage"
              target="_blank"
              rel="noreferrer"
              className="underline hover:text-foreground"
            >
              repo
            </a>{" "}
            btw.
          </P>
        </div>
      </FadeIn>

      <FadeIn>
        <div className="w-12 h-px bg-border my-10" />
      </FadeIn>

      {/* ====== Keeping secrets secure ====== */}
      <FadeIn>
        <h2 id="keeping-secrets-secure" className="scroll-mt-24 font-heading text-[clamp(28px,4vw,38px)] leading-[1.35] tracking-[-0.8px] mb-6">
          Keeping secrets secure
        </h2>
      </FadeIn>

      <FadeIn>
        <div className="space-y-5">
          <P>When Claude finished building, we ended up with just 2 moving parts:</P>
          <ul className="space-y-2 text-[17px] leading-[1.75] tracking-[-0.1px] pl-1">
            <li className="pl-5 relative before:content-['—'] before:absolute before:left-0 before:text-muted-foreground">
              A Cloudflare worker that held the main API, triggered on cron
            </li>
            <li className="pl-5 relative before:content-['—'] before:absolute before:left-0 before:text-muted-foreground">
              An OpenComputer sandbox that clones the repo and runs Claude Code
            </li>
          </ul>
          <P>
            OpenComputer comes with handy APIs that allow you to run Claude or any other coding
            agent without having to deal with custom images or write code to pull it into the box,
            like this:
          </P>
        </div>
      </FadeIn>

      <FadeIn>
        <ShikiCodeBlock
          code={CODE_AGENT_START}
          language="typescript"
          theme="dark-plus"
          copyable
          className="my-6 border border-border/50 shadow-lg"
          bodyClassName="[&_pre]:px-6 [&_pre]:py-5 [&_pre]:text-[13.5px] [&_pre]:leading-[1.85]"
        />
      </FadeIn>

      <FadeIn>
        <div className="space-y-5">
          <P>
            But there's one caveat: we cannot just run Claude and provide{" "}
            <InlineCode>ANTHROPIC_API_KEY</InlineCode> as an env var. It would work, but no matter
            how careful you are, there's always a possibility of a prompt injection attack and the
            key can get exfiltrated. And this agent's whole job is reading emails from strangers
            who are already trying to game it.
          </P>
          <P>
            OpenComputer solves it with SecretStores: your sensitive keys get replaced in flight,
            so that the agent never sees the actual values. You configure a secret store like this
            (once, at build time):
          </P>
        </div>
      </FadeIn>

      <FadeIn>
        <ShikiCodeBlock
          code={CODE_SECRET_STORE}
          language="typescript"
          theme="dark-plus"
          copyable
          className="my-6 border border-border/50 shadow-lg"
          bodyClassName="[&_pre]:px-6 [&_pre]:py-5 [&_pre]:text-[13.5px] [&_pre]:leading-[1.85]"
        />
      </FadeIn>

      <FadeIn>
        <P className="mb-4">And then use it at runtime to create your sandboxes like this:</P>
        <ShikiCodeBlock
          code={CODE_SANDBOX_WITH_STORE}
          language="typescript"
          theme="dark-plus"
          copyable
          className="my-6 border border-border/50 shadow-lg"
          bodyClassName="[&_pre]:px-6 [&_pre]:py-5 [&_pre]:text-[13.5px] [&_pre]:leading-[1.85]"
        />
      </FadeIn>

      <Visual
        src={`${VISUAL_BASE}/02-secret-store.html`}
        height={420}
        title="Interactive demo: SecretStore in-flight key replacement"
        fallback="Diagram of three nodes: a sandbox running Claude Code whose environment only holds the placeholder oc_secret_a91f, a SecretStore egress proxy, and two destinations. When the agent calls api.anthropic.com (on the allowlist) the proxy swaps the placeholder for the real sk-ant key in flight and delivers the request. When an injected prompt tries to POST the key to attacker.net, the proxy blocks the request because the host is not on the egress allowlist, and even if it had gotten through the payload only contains the worthless placeholder. The agent never sees the real key, so there is nothing in the sandbox to exfiltrate."
      />

      <FadeIn>
        <div className="w-12 h-px bg-border my-10" />
      </FadeIn>

      {/* ====== Who should send the email? ====== */}
      <FadeIn>
        <h2 id="who-sends-the-email" className="scroll-mt-24 font-heading text-[clamp(28px,4vw,38px)] leading-[1.35] tracking-[-0.8px] mb-6">
          Who should send the email?
        </h2>
      </FadeIn>

      <FadeIn>
        <div className="space-y-5">
          <P>
            The first version I shipped simply instructed the agent to "send the email via
            Resend". I just put the Resend key into a secret store and thought that's secure
            enough.
          </P>
          <P>
            But I failed to account for LLM creativity. I tested it on the OpenComputer repo; so
            Claude used the GitHub API to get maintainers' info and sent the emails to a
            completely different address! To be fair, I also forgot to add the correct email
            address to the prompt. But still, this shouldn't have happened.
          </P>
        </div>
      </FadeIn>

      <Visual
        src={`${VISUAL_BASE}/03-who-sends-email.html`}
        height={400}
        title="Interactive comparison: who controls the recipient"
        fallback="Two versions compared. In v1 the agent inside the sandbox holds the RESEND_API_KEY and is told to 'send the email via Resend'; with no recipient in the prompt it queried the GitHub API for the repo maintainers and emailed them directly, while the intended recipient never got the report. In v2 the agent has no email key at all; it can only POST its findings to a callback URL, and the worker code picks the recipient deterministically with recipientFor(runId) before calling Resend. The agent reports findings; it never gets a vote on where they go."
      />

      <FadeIn>
        <div className="space-y-5">
          <P>
            The solution was to move Resend API calls outside of the agent's view, to the API. The
            agent simply reports back from inside the OpenComputer sandbox via curl:
          </P>
        </div>
      </FadeIn>

      <FadeIn>
        <ShikiCodeBlock
          code={CODE_CALLBACK}
          language="bash"
          theme="dark-plus"
          copyable
          className="my-6 border border-border/50 shadow-lg"
          bodyClassName="[&_pre]:px-6 [&_pre]:py-5 [&_pre]:text-[13.5px] [&_pre]:leading-[1.9]"
        />
      </FadeIn>

      <FadeIn>
        <P className="mb-4">And then the worker sends the email:</P>
        <ShikiCodeBlock
          code={CODE_WORKER_REPORT}
          language="typescript"
          theme="dark-plus"
          copyable
          className="my-6 border border-border/50 shadow-lg"
          bodyClassName="[&_pre]:px-6 [&_pre]:py-5 [&_pre]:text-[13.5px] [&_pre]:leading-[1.85]"
        />
      </FadeIn>

      <FadeIn>
        <P>
          This way the agent is never given control over the recipient list; it can only say
          "report my findings back", and the decision on whom to route it to is in good old code.
        </P>
      </FadeIn>

      <FadeIn>
        <div className="w-12 h-px bg-border my-10" />
      </FadeIn>

      {/* ====== A valid-by-mistake report ====== */}
      <FadeIn>
        <h2 id="valid-by-mistake" className="scroll-mt-24 font-heading text-[clamp(28px,4vw,38px)] leading-[1.35] tracking-[-0.8px] mb-6">
          A valid-by-mistake report
        </h2>
      </FadeIn>

      <FadeIn>
        <div className="space-y-5">
          <P>
            The funniest thing that actually happened: an LLM-generated report that was meant to
            be obviously bogus got flagged as valid, and for a good reason!
          </P>
          <P>Claude came up with roughly the following text for a "bogus" report:</P>
        </div>
      </FadeIn>

      <FadeIn>
        <ShikiCodeBlock
          code={CODE_BOGUS_REPORT}
          language="log"
          theme="dark-plus"
          copyable
          className="my-6 border border-border/50 shadow-lg"
          bodyClassName="[&_pre]:px-6 [&_pre]:py-5 [&_pre]:text-[13.5px] [&_pre]:leading-[1.85]"
        />
      </FadeIn>

      <FadeIn>
        <div className="space-y-5">
          <P>
            At the time I was using the OpenComputer repo for testing the agent; so it tried to
            find an obviously-bogus vulnerability: remote execution of arbitrary code. That's what
            sandboxes are for!
          </P>
          <P>
            However, Claude-the-reviewer took it very seriously, and decided to flag it as an
            actual remote code execution vulnerability. Because, technically, yes: you can run any
            code in a sandbox, even though sandboxes are meant for that.
          </P>
          <P>
            I didn't bother to fix it, just switched the repo from the OpenComputer repo to the
            code of the agent itself.
          </P>
        </div>
      </FadeIn>

      <FadeIn>
        <div className="w-12 h-px bg-border my-10" />
      </FadeIn>

      {/* ====== Conclusion ====== */}
      <FadeIn>
        <h2 id="conclusion" className="scroll-mt-24 font-heading text-[clamp(28px,4vw,38px)] leading-[1.35] tracking-[-0.8px] mb-6">
          Conclusion
        </h2>
      </FadeIn>

      <FadeIn>
        <div className="space-y-5">
          <P>
            It is surprisingly easy and fun to build ultra-niche agents for yourself. Hope you
            enjoyed the story!
          </P>
          <ul className="space-y-2 text-[17px] leading-[1.75] tracking-[-0.1px] pl-1">
            <li className="pl-5 relative before:content-['—'] before:absolute before:left-0 before:text-muted-foreground">
              <a
                href="https://github.com/diggerhq/opencomputer"
                target="_blank"
                rel="noreferrer"
                className="underline hover:text-foreground"
              >
                OpenComputer repo
              </a>
            </li>
            <li className="pl-5 relative before:content-['—'] before:absolute before:left-0 before:text-muted-foreground">
              <a href="https://opencomputer.dev" className="underline hover:text-foreground">
                OpenComputer website
              </a>
            </li>
            <li className="pl-5 relative before:content-['—'] before:absolute before:left-0 before:text-muted-foreground">
              <a
                href="https://github.com/diggerhq/demo-agent-triage"
                target="_blank"
                rel="noreferrer"
                className="underline hover:text-foreground"
              >
                demo-agent-triage repo
              </a>
            </li>
          </ul>
          <p className="font-mono-brand text-[13px] text-muted-foreground italic">
            Written by a human.
          </p>
        </div>
      </FadeIn>

      <FadeIn>
        <div className="mt-16 pt-8 border-t border-border/50">
          <Link
            to="/blog"
            className="font-mono-brand text-[13px] text-muted-foreground hover:text-foreground transition-colors no-underline"
          >
            &larr; Back to blog
          </Link>
        </div>
      </FadeIn>
    </SitePageLayout>
  );
};

export default EmailSecurityTriageAgent;
