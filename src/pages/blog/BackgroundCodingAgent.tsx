import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import FadeIn from "@/components/FadeIn";
import ShikiCodeBlock from "@/components/ShikiCodeBlock";
import SitePageLayout from "@/components/SitePageLayout";
import SEO from "@/components/SEO";

/* ---------- Table of contents ---------- *
 * Fixed to the right margin on xl: viewports (1280+). Below that, hidden —
 * the 994px article column doesn't leave room for a sidebar at smaller widths.
 * IntersectionObserver tracks which section is in view and highlights the
 * matching link. Click → native anchor scroll; scroll-mt on the H2s clears
 * any sticky header.
 */
const TOC_ITEMS = [
  { id: "what-youll-build", label: "What you'll build" },
  { id: "how-the-pieces-fit", label: "How the pieces fit" },
  { id: "prerequisites", label: "Prerequisites" },
  { id: "environment-setup", label: "Environment setup" },
  { id: "agent-setup", label: "Set up with an agent" },
  { id: "implementation", label: "Implementation" },
  { id: "where-it-can-fail", label: "Where it can fail" },
  { id: "the-tradeoff", label: "The tradeoff" },
];

const TableOfContents = () => {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          // pick the topmost visible heading
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
      className="hidden xl:block fixed top-[140px] right-4 w-[120px] z-10"
    >
      <div className="font-mono-brand text-[10px] uppercase tracking-[0.14em] text-muted-foreground mb-3 pb-2 border-b border-border/40">
        Contents
      </div>
      <ul className="space-y-2">
        {TOC_ITEMS.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              aria-current={activeId === item.id ? "location" : undefined}
              className={`block font-mono-brand text-[11px] leading-[1.45] no-underline transition-colors ${
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

/* ---------- Callout ---------- */
const Callout = ({ children }: { children: React.ReactNode }) => (
  <div className="my-8 pl-5 border-l-[3px] border-foreground/80 py-1">
    <p className="font-heading text-[19px] leading-[1.65] tracking-[-0.2px] italic text-foreground/85">
      {children}
    </p>
  </div>
);

const InlineCode = ({ children }: { children: React.ReactNode }) => (
  <code className="font-mono-brand text-[15px] bg-[hsl(0,0%,93%)] px-1.5 py-0.5 rounded">
    {children}
  </code>
);

/* ---------- Embedded video ----------
 * preload="metadata" keeps the page light until play; the <a> fallback gives
 * non-HTML5 clients (and crawlers) a direct file link they can follow.
 */
const Video = ({
  src,
  caption,
  poster,
}: {
  src: string;
  caption: string;
  poster?: string;
}) => (
  <figure className="my-10 -mx-2 sm:mx-0">
    <video
      controls
      preload="metadata"
      playsInline
      poster={poster}
      className="w-full rounded-lg border border-border/50 shadow-lg bg-black"
    >
      <source src={src} type="video/mp4" />
      <a href={src} className="underline">Download the demo video</a>
    </video>
    <figcaption className="font-mono-brand text-[12px] text-muted-foreground mt-3 italic">
      {caption}
    </figcaption>
  </figure>
);

/* ---------- Embedded HTML visual (iframe) ----------
 * The iframe carries the interactive demo for JS-rendering browsers.
 * The <noscript> block carries an indexable text description for crawlers
 * that don't render JS or don't follow iframe sources — without it, the
 * visual contributes nothing to the post's citation surface area.
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

const VISUAL_BASE = "/blog-visuals/background-coding-agent";

/* ---------- Code constants ---------- */
const CODE_BUILD_SNAPSHOT = `# build_snapshot.py
import asyncio
import sys
from opencomputer import Snapshots, Image
from dotenv import load_dotenv

load_dotenv()


async def main() -> None:
    snapshots = Snapshots()

    image = (
        Image.base()
        .apt_install(["curl", "git", "jq", "build-essential", "ca-certificates"])
        .run_commands(
            # gh CLI from the official apt repo (build runs as non-root, so sudo)
            "curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg "
            "| sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg",
            "sudo chmod go+r /usr/share/keyrings/githubcli-archive-keyring.gpg",
            "echo 'deb [arch=amd64 signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg]"
            " https://cli.github.com/packages stable main'"
            " | sudo tee /etc/apt/sources.list.d/github-cli.list",
            "sudo apt update && sudo apt install -y gh",
            "sudo npm install -g @anthropic-ai/claude-code",
            "git config --global user.email 'agent@sleep.dev'",
            "git config --global user.name 'sleep-agent'",
            "git config --global init.defaultBranch main",
        )
        .workdir("/workspace")
    )

    snap = await snapshots.create(
        name="coder",
        image=image,
        on_build_logs=lambda line: sys.stdout.write(line),
    )
    print(f"\\nSnapshot ready: {snap['name']} ({snap['id']})")


if __name__ == "__main__":
    asyncio.run(main())`;

const CODE_AGENT_BOOT = `# agent.py
import asyncio
import os
from dataclasses import dataclass
import httpx
from opencomputer import Sandbox
from opencomputer.exec import ProcessResult

USE_SNAPSHOT = os.environ.get("USE_SNAPSHOT", "0") == "1"
# Cheaper/faster than Opus for bug-fix-sized tickets. Override with CLAUDE_MODEL.
MODEL = os.environ.get("CLAUDE_MODEL", "claude-sonnet-4-6")

# Base already ships claude/git/node/python; only gh is missing.
RUNTIME_PREP = " && ".join([
    "curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg "
    "| sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg",
    "sudo chmod go+r /usr/share/keyrings/githubcli-archive-keyring.gpg",
    "echo 'deb [arch=amd64 signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg]"
    " https://cli.github.com/packages stable main'"
    " | sudo tee /etc/apt/sources.list.d/github-cli.list",
    "sudo apt-get update -qq",
    "sudo apt-get install -y -qq gh",
    "git config --global user.email 'agent@sleep.dev'",
    "git config --global user.name 'sleep-agent'",
    "git config --global init.defaultBranch main",
])


@dataclass
class IssueTask:
    repo: str            # "owner/name"
    issue_number: int
    title: str
    body: str


async def _exec(sandbox, cmd, *, cwd=None, env=None, timeout=60,
                retries=3, check=True) -> ProcessResult:
    """Run a command, retrying transient gateway errors (the platform throws the
    occasional 524). With check=True, a non-zero exit raises with stderr."""
    last = None
    for attempt in range(retries):
        try:
            r = await sandbox.exec.run(cmd, timeout=timeout, cwd=cwd, env=env)
            break
        except (httpx.HTTPStatusError, httpx.ReadTimeout, httpx.RemoteProtocolError) as e:
            last = e
            await asyncio.sleep(4)
    else:
        raise RuntimeError(f"exec failed after {retries} tries: {last}")
    if check and r.exit_code != 0:
        raise RuntimeError(f"\\\`{cmd[:60]}...\\\` exited {r.exit_code}: {r.stderr[:500]}")
    return r


async def run_agent(task: IssueTask) -> str:
    token = os.environ["GITHUB_TOKEN"]
    # Secrets are injected per-command (exec env), NOT via Sandbox.create(envs=).
    # Passing them at create time routes egress through the secrets proxy, which
    # blocks all outbound traffic unless an egress allowlist is configured. Per
    # exec keeps the sandbox on open egress so git/claude/pip just work.
    secret_env = {
        "ANTHROPIC_API_KEY": os.environ["ANTHROPIC_API_KEY"],
        "GITHUB_TOKEN": token,
        "GH_TOKEN": token,
    }
    metadata = {"issue": f"{task.repo}#{task.issue_number}"}

    if USE_SNAPSHOT:
        sandbox = await Sandbox.create(
            snapshot="coder",
            timeout=1800,                                   # 30 min idle ceiling
            metadata=metadata,
        )
    else:
        sandbox = await Sandbox.create(
            template="base",
            timeout=1800,
            metadata=metadata,
        )

    # exec.run is one buffered HTTP call; the SDK's default client timeout (30s)
    # is shorter than a real Claude run, so widen it to the process ceiling.
    sandbox._client._timeout = httpx.Timeout(1700.0)

    try:
        if not USE_SNAPSHOT:
            await _exec(sandbox, RUNTIME_PREP, timeout=300)

        # Clone the repo with a token-authenticated URL
        await _exec(
            sandbox,
            f"git clone https://x-access-token:{token}@github.com/{task.repo}.git repo",
            cwd="/workspace",
            timeout=120,
        )

        branch = f"agent/issue-{task.issue_number}"

        # Write the task so Claude can re-read it when it gets lost mid-loop
        await sandbox.files.write(
            "/workspace/repo/TASK.md",
            "\\n".join([
                f"# Issue #{task.issue_number}: {task.title}",
                "",
                task.body or "_(no body)_",
                "",
                "## Working Instructions",
                "",
                "- Read the relevant code before editing.",
                "- Run the project's existing test suite after your changes.",
                "- If tests fail, fix them before stopping.",
                "- Keep the diff focused. Do not refactor unrelated files.",
                "- Delete this TASK.md file before committing.",
            ]),
        )

        await _exec(sandbox, f"git checkout -b {branch}", cwd="/workspace/repo", timeout=30)
        # ... continues below`;

const CODE_AGENT_CLAUDE = `        # Hand it to Claude. --dangerously-skip-permissions is safe here because
        # we're in a fresh, disposable VM (and lets it read CLAUDE.md if present).
        # No retry: re-running a non-idempotent agent would double the spend.
        claude_result = await _exec(
            sandbox,
            'claude -p "$(cat TASK.md)" --dangerously-skip-permissions '
            f"--model {MODEL} --max-turns 50 --output-format json",
            cwd="/workspace/repo",
            env=secret_env,
            timeout=1500,
            retries=1,
        )
        if claude_result.exit_code != 0:
            raise RuntimeError(
                f"Claude exited {claude_result.exit_code}: {claude_result.stderr[:500]}"
            )

        safe_title = task.title.replace('"', '\\\\"')

        # Commit and push. Claude often commits its own work, so only commit when
        # something is actually staged, then always push (a hard && chain here
        # would swallow the push whenever Claude already committed).
        await _exec(
            sandbox,
            "rm -f TASK.md && git add -A && "
            "(git diff --cached --quiet || "
            f'git commit -m "fix: address #{task.issue_number} ({safe_title})") && '
            f"git push --set-upstream origin {branch}",
            cwd="/workspace/repo",
            env=secret_env,
            timeout=120,
        )

        # Open the draft PR
        pr = await _exec(
            sandbox,
            f'gh pr create --draft --title "fix: {safe_title}" '
            f'--body "Closes #{task.issue_number}\\n\\n'
            '_Drafted by sleep-agent. Review the diff before merging._"',
            cwd="/workspace/repo",
            env=secret_env,
            timeout=60,
        )

        return pr.stdout.strip()
    finally:
        await sandbox.kill()`;

const CODE_SERVER = `# server.py
import asyncio
import hashlib
import hmac
import os
import httpx
from fastapi import FastAPI, Header, HTTPException, Request
from dotenv import load_dotenv
from agent import IssueTask, run_agent

load_dotenv()

WEBHOOK_SECRET = os.environ["GITHUB_WEBHOOK_SECRET"].encode()
GH_TOKEN = os.environ["GITHUB_TOKEN"]
GH_API = "https://api.github.com"
GH_HEADERS = {
    "Authorization": f"Bearer {GH_TOKEN}",
    "Accept": "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
}

app = FastAPI()


def verify_signature(body: bytes, signature: str) -> bool:
    expected = "sha256=" + hmac.new(WEBHOOK_SECRET, body, hashlib.sha256).hexdigest()
    return hmac.compare_digest(expected, signature)


async def post_comment(repo: str, issue_number: int, body: str) -> None:
    async with httpx.AsyncClient(timeout=30) as client:
        r = await client.post(
            f"{GH_API}/repos/{repo}/issues/{issue_number}/comments",
            headers=GH_HEADERS,
            json={"body": body},
        )
        r.raise_for_status()


async def handle_labeled(payload: dict) -> None:
    repo = payload["repository"]["full_name"]
    issue_number = payload["issue"]["number"]
    task = IssueTask(
        repo=repo,
        issue_number=issue_number,
        title=payload["issue"]["title"],
        body=payload["issue"].get("body") or "",
    )

    await post_comment(repo, issue_number, "🤖 sleep-agent picked this up. Draft PR incoming.")

    try:
        pr_url = await run_agent(task)
        await post_comment(repo, issue_number, f"✅ Draft PR ready: {pr_url}")
    except Exception as exc:
        await post_comment(
            repo, issue_number,
            f"❌ sleep-agent failed:\\n\\n\\\`\\\`\\\`\\n{exc}\\n\\\`\\\`\\\`",
        )


@app.post("/webhook")
async def webhook(
    request: Request,
    x_hub_signature_256: str = Header(default=""),
    x_github_event: str = Header(default=""),
):
    body = await request.body()
    if not verify_signature(body, x_hub_signature_256):
        raise HTTPException(status_code=401, detail="bad signature")

    if x_github_event != "issues":
        return {"status": "ignored"}

    payload = await request.json()
    if payload.get("action") != "labeled":
        return {"status": "ignored"}
    if (payload.get("label") or {}).get("name") != "agent":
        return {"status": "ignored"}

    # Fire-and-forget. Don't block the webhook response on the agent run.
    asyncio.create_task(handle_labeled(payload))
    return {"status": "accepted"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("PORT", "3000")))`;

const CODE_ENV = `OPENCOMPUTER_API_KEY=osb_...        # app.opencomputer.dev — API Keys
ANTHROPIC_API_KEY=sk-ant-...        # console.anthropic.com — API Keys
GITHUB_TOKEN=ghp_...                # github.com/settings/tokens — repo scope
GITHUB_WEBHOOK_SECRET=letmein       # any random string, paste the same one into GitHub
PORT=3000`;

const CODE_PIP_INSTALL = `pip install opencomputer-sdk fastapi "uvicorn[standard]" httpx python-dotenv`;

const CODE_AGENT_PROMPT = `Build the self-hosted background coding agent described in this post: [LINK]. Read it and follow it as the source of truth for the code and setup.

What it is: a FastAPI webhook server that, when a GitHub issue is labeled \`agent\`, spins up a disposable OpenComputer sandbox, runs Claude Code headless on the issue, and opens a draft PR.

Files to create:
- build_snapshot.py  (optional, one-time snapshot build)
- agent.py           (handles one issue inside a sandbox)
- server.py          (the webhook receiver)
- .env               (secrets and config)

Environment variables (.env):
- OPENCOMPUTER_API_KEY
- ANTHROPIC_API_KEY
- GITHUB_TOKEN          (repo scope)
- GITHUB_WEBHOOK_SECRET

Ask me for: the four values above, the target GitHub repo, and confirmation once I've created the \`agent\` label and pointed a webhook (Issues events) at the server.`;

const BackgroundCodingAgent = () => {
  return (
    <SitePageLayout activeSection="blog" contentAs="article">
      <SEO
        title="Build a background coding agent that works while you sleep"
        description="A 250-line self-hosted background coding agent. Label a GitHub issue with `agent`, wake up to a draft PR. ~$0.30/task. The snapshot, the agent loop, the webhook server, and the dead ends I'd save you from."
        author="Utpal Nadiger"
        path="/blog/background-coding-agent"
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
          Build a background coding agent that works while you sleep
        </h1>
      </FadeIn>

      <FadeIn delay={0.08}>
        <p className="font-mono-brand text-[13px] text-muted-foreground mb-10">
          Written by Utpal Nadiger{" "}
          &middot;{" "}
          <time dateTime="2026-06-01">June 1, 2026</time>{" "}
          &middot;{" "}
          <a
            href="/blog/background-coding-agent.md"
            rel="alternate"
            type="text/markdown"
            className="underline hover:text-foreground transition-colors"
          >
            read as markdown
          </a>
        </p>
      </FadeIn>

      {/* ---- Intro ---- */}
      <FadeIn delay={0.12}>
        <div className="space-y-7">
          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            I have a backlog of issues I'd rather not touch. Stuff like missing CLI flags, typos,
            flaky tests, and the list goes on. Out of equal parts curiosity and laziness, I wanted
            to hand these issues to one of these background coding agents and see if they could
            handle the work without me having to do it.
          </p>
          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            After testing hosted options such as Devin, I decided to control the entire stack.
          </p>
          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            I'll walk you through building your own background coding agent using OpenComputer's
            VMs and sandboxes in about 250 lines of Python, at roughly $0.30 per task at Claude's
            current pricing.
          </p>
          <p className="text-[15px] leading-[1.7] text-muted-foreground italic">
            Know the basics? Jump to the implementation of the recipe or just grab the{" "}
            <a
              href="https://manicule.link/background-agent-repo"
              target="_blank"
              rel="noreferrer"
              className="underline hover:text-foreground"
            >
              full working code
            </a>
            .
          </p>
        </div>
      </FadeIn>

      <FadeIn>
        <div className="w-12 h-px bg-border my-10" />
      </FadeIn>

      {/* ====== Section: What you'll build ====== */}
      <FadeIn>
        <h2 id="what-youll-build" className="scroll-mt-24 font-heading text-[clamp(28px,4vw,38px)] leading-[1.35] tracking-[-0.8px] mb-6">
          What you'll build
        </h2>
      </FadeIn>

      <FadeIn>
        <div className="my-8 p-6 rounded-xl border border-border/50 bg-[hsl(0,0%,98%)]">
          <p className="text-[16px] leading-[1.7]">
            A self-hosted background coding agent that activates when you tag a GitHub issue with{" "}
            <InlineCode>agent</InlineCode>, works out a fix, and opens a draft PR. You only verify
            the result.
          </p>
        </div>
      </FadeIn>

      <FadeIn>
        <Video
          src={`${VISUAL_BASE}/agent-demo.mp4`}
          caption="Demo: label a GitHub issue with `agent`, the webhook fires, a fresh sandbox boots, Claude Code runs headlessly, and a draft PR shows up on the issue."
        />
      </FadeIn>

      <Visual
        src={`${VISUAL_BASE}/02-architecture.html`}
        height={620}
        title="Architecture diagram"
        fallback="A GitHub issue labeled `agent` fires a webhook to a persistent FastAPI server, which verifies the signature, acknowledges within milliseconds, and launches a background task. The task boots a disposable OpenComputer sandbox (2–3 second cold start), clones the repo, runs Claude Code headlessly with a 50-turn cap, then uses the gh CLI to push the branch and open a draft PR. The sandbox is killed at the end of the run, so idle cost is zero. Two issues labeled at once become two independent sandbox runs."
      />

      <FadeIn>
        <div className="space-y-5">
          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            <strong className="font-heading">Here's how I structured the setup:</strong>
          </p>
          <ul className="space-y-3 text-[17px] leading-[1.75] tracking-[-0.1px] pl-1">
            <li className="pl-5 relative before:content-['—'] before:absolute before:left-0 before:text-muted-foreground">
              <strong>A FastAPI server.</strong> Something to catch GitHub webhook events and
              dispatch them. FastAPI was the easy option.
            </li>
            <li className="pl-5 relative before:content-['—'] before:absolute before:left-0 before:text-muted-foreground">
              <strong>The OpenComputer API.</strong> Each tagged issue gets its own disposable
              Linux VM, booted from a base image that already ships Claude Code, git, Node, and
              Python, with the <InlineCode>gh</InlineCode> CLI added at boot (or baked into a
              snapshot, see Step 1). The VM is torn down the moment the run ends, so I pay for the
              compute only while it's working.
            </li>
            <li className="pl-5 relative before:content-['—'] before:absolute before:left-0 before:text-muted-foreground">
              <strong>Claude Code in headless mode.</strong> Inside the VM, it reads the issue,
              edits the repo, runs the tests, and commits.
            </li>
            <li className="pl-5 relative before:content-['—'] before:absolute before:left-0 before:text-muted-foreground">
              <strong>The <InlineCode>gh</InlineCode> CLI.</strong> It pushes the branch and opens
              the draft PR as the last step, using a token that the server never has to handle
              itself.
            </li>
          </ul>
          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            A typical task spends $0.20 to $0.40 on the Anthropic API, and the VM time underneath
            it is a fraction of a cent. Route the trivial tickets to a cheaper model, and a task
            runs for a couple of cents.
          </p>
        </div>
      </FadeIn>

      <Visual
        src={`${VISUAL_BASE}/03-cost-calculator.html`}
        height={520}
        title="Cost calculator"
        fallback="Interactive cost breakdown per task. Sliders control model (Haiku, Sonnet, Opus), context size (small repo to sprawling), turns used (4 to 50), and issues per month (5 to 300). A typical Sonnet run at medium context with 18 turns costs ~$0.30 per task — ~$0.29 in Anthropic API spend, ~$0.004 in VM compute. At 60 issues per month that's $18 in tokens plus an $8.76/month persistent box for the webhook server."
      />

      <FadeIn>
        <Callout>
          This recipe was inspired by{" "}
          <a
            href="https://builders.ramp.com/post/why-we-built-our-background-agent"
            target="_blank"
            rel="noreferrer"
            className="underline hover:text-foreground"
          >
            Ramp's Inspect agent
          </a>
          , where they completely own the stack top to bottom: Sentry, Datadog, LaunchDarkly, and
          Braintrust wired in, internal tools on hand, dev images refreshed every 30 minutes. The
          agent is only limited by model intelligence. What we're building is the foundation a
          background coding agent system can sit on: a VM you control, an agent inside it, and a
          trigger that wakes it up.
        </Callout>
      </FadeIn>

      <FadeIn>
        <div className="w-12 h-px bg-border my-10" />
      </FadeIn>

      {/* ====== Section: How the pieces fit ====== */}
      <FadeIn>
        <h2 id="how-the-pieces-fit" className="scroll-mt-24 font-heading text-[clamp(28px,4vw,38px)] leading-[1.35] tracking-[-0.8px] mb-6">
          How the pieces fit
        </h2>
      </FadeIn>

      <FadeIn>
        <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
          Every issue gets its own throwaway Linux VM that boots in 2 to 3 seconds, does the work,
          and gets torn down when it's done. That one property is what keeps the rest of the
          design simple. Here's how OpenComputer delivers it.
        </p>
      </FadeIn>

      <FadeIn>
        <h3 className="font-heading text-[22px] tracking-[-0.3px] mt-10 mb-4">
          The persistent box
        </h3>
      </FadeIn>

      <FadeIn>
        <div className="space-y-5">
          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            A sandbox is a full Linux VM with its own kernel, memory, disk, network namespace, and
            process table, isolated by KVM at the hardware level. You get root, you install what
            you want, and it persists between runs.
          </p>
          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            This setup works quite similarly to a Docker image with two differences: a snapshot
            captures live VM state, and it's addressed by the content hash of its definition
            instead of a tag.
          </p>
        </div>
      </FadeIn>

      <Visual
        src={`${VISUAL_BASE}/01-docker-vs-opencomputer.html`}
        height={720}
        title="Docker vs OpenComputer"
        fallback="OpenComputer sandboxes share with Docker images: declarative builds (apt_install + run_commands), reproducibility, base + layered tools, and cached rebuilds. They differ in four ways: OpenComputer ships its own KVM kernel (Docker shares the host kernel), state persists between runs (Docker containers are ephemeral by default), the image is addressed by the content hash of its definition (Docker uses mutable :tags), and isolation is at the hardware level via KVM (Docker uses namespaces and cgroups). A typical run boots a persistent server box alongside one fresh sandbox per issue — the sandboxes pop in, do the work, and tear down."
      />

      <FadeIn>
        <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
          OpenComputer has persistent sandboxes which run at $8.76/month for a 1 GB instance,
          which is similar to a VPS or a Railway instance with similar config. And the base
          version of OpenComputer's persistent sandbox is more than enough for running a FastAPI
          server.
        </p>
      </FadeIn>

      <FadeIn>
        <h3 className="font-heading text-[22px] tracking-[-0.3px] mt-10 mb-4">
          A sandbox per issue
        </h3>
      </FadeIn>

      <FadeIn>
        <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
          When an issue arrives, the server spins up a fresh sandbox for it, runs Claude Code
          inside, opens the PR, and kills the sandbox once it's done. The repo cloning, code
          edits, and testing happen on this isolated server.
        </p>
      </FadeIn>

      <FadeIn>
        <div className="my-8 p-6 rounded-xl border border-border/50 bg-[hsl(0,0%,98%)]">
          <p className="text-[15px] leading-[1.7] mb-3">
            <strong className="font-heading text-[17px]">
              Why can't we run everything in the same persistent sandbox?
            </strong>
          </p>
          <p className="text-[15px] leading-[1.7] text-muted-foreground">
            Nearly everything the agent touches is code you didn't write, running with{" "}
            <InlineCode>--dangerously-skip-permissions</InlineCode>. A poisoned README or a bad
            dependency could read the GitHub token or trash the filesystem, so you want it nowhere
            near the server. Inside a throwaway sandbox, the damage has nowhere to go: the
            sandbox dies at the end of the run, and the box keeps serving webhooks as if nothing
            happened.
          </p>
        </div>
      </FadeIn>

      <FadeIn>
        <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
          When a run fills the disk, leaks memory, or wedges in a loop, it takes its own sandbox
          down with it and leaves the server untouched, and the persistent box never accumulates
          random code. You also get concurrency without doing anything for it. Two issues labeled
          at the same moment simply run side by side.
        </p>
      </FadeIn>

      <FadeIn>
        <div className="w-12 h-px bg-border my-10" />
      </FadeIn>

      {/* ====== Section: Prerequisites ====== */}
      <FadeIn>
        <h2 id="prerequisites" className="scroll-mt-24 font-heading text-[clamp(28px,4vw,38px)] leading-[1.35] tracking-[-0.8px] mb-6">
          Prerequisites
        </h2>
      </FadeIn>

      <FadeIn>
        <ul className="space-y-2 text-[17px] leading-[1.75] tracking-[-0.1px] pl-1">
          {[
            "Python 3.10 or newer",
            "An OpenComputer account and API key from app.opencomputer.dev",
            "An Anthropic API key from console.anthropic.com with Claude Code access",
            "A GitHub Personal Access Token with `repo` scope (the agent pushes branches and opens PRs as this token's user)",
            "A GitHub repository you control with at least one bug-fix-sized issue in it",
            "A persistent OpenComputer instance to run the webhook server on",
          ].map((item, i) => (
            <li
              key={i}
              className="pl-5 relative before:content-['—'] before:absolute before:left-0 before:text-muted-foreground"
              dangerouslySetInnerHTML={{
                __html: item.replace(
                  /`([^`]+)`/g,
                  "<code class=\"font-mono-brand text-[15px] bg-[hsl(0,0%,93%)] px-1.5 py-0.5 rounded\">$1</code>",
                ),
              }}
            />
          ))}
        </ul>
      </FadeIn>

      {/* ====== Section: Environment Setup ====== */}
      <FadeIn>
        <h2 id="environment-setup" className="scroll-mt-24 font-heading text-[clamp(28px,4vw,38px)] leading-[1.35] tracking-[-0.8px] mt-12 mb-6">
          Environment setup
        </h2>
      </FadeIn>

      <FadeIn>
        <p className="text-[17px] leading-[1.75] tracking-[-0.1px] mb-4">
          Install the SDK and the rest of the dependencies:
        </p>
        <ShikiCodeBlock
          code={CODE_PIP_INSTALL}
          language="bash"
          theme="dark-plus"
          copyable
          className="my-6 border border-border/50 shadow-lg"
          bodyClassName="[&_pre]:px-6 [&_pre]:py-5 [&_pre]:text-[13.5px] [&_pre]:leading-[1.9]"
        />
        <p className="text-[17px] leading-[1.75] tracking-[-0.1px] mt-6 mb-4">
          Configure your keys in <InlineCode>.env</InlineCode>:
        </p>
        <ShikiCodeBlock
          filename=".env"
          code={CODE_ENV}
          language="bash"
          theme="dark-plus"
          copyable
          className="my-6 border border-border/50 shadow-lg"
          bodyClassName="[&_pre]:px-6 [&_pre]:py-5 [&_pre]:text-[13.5px] [&_pre]:leading-[1.9]"
        />
        <p className="text-[17px] leading-[1.75] tracking-[-0.1px] mt-6 mb-3">
          Project structure (only the files this cookbook creates):
        </p>
        <pre className="font-mono-brand text-[13.5px] leading-[1.9] bg-[hsl(0,0%,98%)] border border-border/50 rounded-lg px-6 py-5 my-6 overflow-x-auto">{`build_snapshot.py   — run once to bake the coder snapshot
agent.py            — spins up a sandbox, hands the task to Claude Code, opens the PR
server.py           — FastAPI webhook server
.env`}</pre>
      </FadeIn>

      {/* ====== Section: agent-built variant ====== */}
      <FadeIn>
        <h2 id="agent-setup" className="scroll-mt-24 font-heading text-[clamp(28px,4vw,38px)] leading-[1.35] tracking-[-0.8px] mt-12 mb-6">
          Want your coding agent to set this up for you?
        </h2>
      </FadeIn>

      <FadeIn>
        <p className="text-[17px] leading-[1.75] tracking-[-0.1px] mb-4">
          Just grab the API keys and tokens and hand this prompt over to your coding agent. It'll
          take care of the rest.
        </p>
        <ShikiCodeBlock
          code={CODE_AGENT_PROMPT}
          language="markdown"
          theme="dark-plus"
          copyable
          className="my-6 border border-border/50 shadow-lg"
          bodyClassName="[&_pre]:px-6 [&_pre]:py-5 [&_pre]:text-[13.5px] [&_pre]:leading-[1.85]"
        />
      </FadeIn>

      <FadeIn>
        <div className="w-12 h-px bg-border my-10" />
      </FadeIn>

      {/* ====== Section: Implementation ====== */}
      <FadeIn>
        <h2 id="implementation" className="scroll-mt-24 font-heading text-[clamp(28px,4vw,38px)] leading-[1.35] tracking-[-0.8px] mb-6">
          Implementation
        </h2>
      </FadeIn>

      <FadeIn>
        <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
          Three files, built in the order they run: <InlineCode>build_snapshot.py</InlineCode>{" "}
          (one-time setup), <InlineCode>agent.py</InlineCode> (handles one issue), and{" "}
          <InlineCode>server.py</InlineCode> (the webhook receiver).
        </p>
      </FadeIn>

      {/* Step 1 */}
      <FadeIn>
        <h3 className="font-heading text-[22px] tracking-[-0.3px] mt-10 mb-4">
          Step 1: Pre-install the agent's tools into a snapshot
        </h3>
        <p className="text-[17px] leading-[1.75] tracking-[-0.1px] mb-4">
          Installing Claude Code and <InlineCode>gh</InlineCode> on every run would cost ~90
          seconds per issue, waiting on npm and apt. We'll instead bake the required tools into a
          snapshot so every sandbox boots with Claude and <InlineCode>gh</InlineCode> already in{" "}
          <InlineCode>$PATH</InlineCode>.
        </p>
        <p className="text-[17px] leading-[1.75] tracking-[-0.1px] mb-4">
          Here's the snapshot file that we're using.
        </p>
        <ShikiCodeBlock
          filename="build_snapshot.py"
          code={CODE_BUILD_SNAPSHOT}
          language="python"
          theme="dark-plus"
          copyable
          className="my-6 border border-border/50 shadow-lg"
          bodyClassName="[&_pre]:px-6 [&_pre]:py-5 [&_pre]:text-[13.5px] [&_pre]:leading-[1.85]"
        />
        <p className="text-[17px] leading-[1.75] tracking-[-0.1px] mt-6 mb-4">Run it once:</p>
        <ShikiCodeBlock
          code={`python build_snapshot.py`}
          language="bash"
          theme="dark-plus"
          copyable
          className="my-6 border border-border/50 shadow-lg"
          bodyClassName="[&_pre]:px-6 [&_pre]:py-5 [&_pre]:text-[13.5px] [&_pre]:leading-[1.9]"
        />
        <p className="text-[17px] leading-[1.75] tracking-[-0.1px] mt-6">
          The build starts from OpenComputer's Ubuntu 22.04 base (Python, Node, and build tools
          already present) and layers on what the agent needs: <InlineCode>gh</InlineCode> from
          its official apt repo, Claude Code from npm, and a git identity so commits have an
          author. The first build takes 3 to 4 minutes, but after that it's nearly instant.
        </p>
      </FadeIn>

      {/* Step 2a */}
      <FadeIn>
        <h3 className="font-heading text-[22px] tracking-[-0.3px] mt-10 mb-4">
          Step 2a: Booting and prepping the sandbox
        </h3>
        <p className="text-[17px] leading-[1.75] tracking-[-0.1px] mb-4">
          With the snapshot ready, we'll work on <InlineCode>agent.py</InlineCode>. This is one
          function that takes a GitHub issue, boots a sandbox, clones the repo, hands the job to
          Claude Code, and opens a draft PR with the fix.
        </p>
        <ShikiCodeBlock
          filename="agent.py"
          code={CODE_AGENT_BOOT}
          language="python"
          theme="dark-plus"
          copyable
          className="my-6 border border-border/50 shadow-lg"
          bodyClassName="[&_pre]:px-6 [&_pre]:py-5 [&_pre]:text-[13.5px] [&_pre]:leading-[1.85]"
        />
        <p className="text-[17px] leading-[1.75] tracking-[-0.1px] mt-6">
          A fresh VM boots in 2 to 3 seconds. By default, it's OpenComputer's base image, which
          already ships Claude Code, git, Node, and Python, so{" "}
          <InlineCode>RUNTIME_PREP</InlineCode> only has to add the <InlineCode>gh</InlineCode>{" "}
          CLI; set <InlineCode>USE_SNAPSHOT=1</InlineCode> to boot the coder snapshot from Step 1
          instead and skip even that. The API key and GitHub token are handed to the commands
          that need them as environment variables rather than baked into the image, and a 30-minute
          timeout deletes the VM if a run stalls.
        </p>
      </FadeIn>

      {/* Step 2b */}
      <FadeIn>
        <h3 className="font-heading text-[22px] tracking-[-0.3px] mt-10 mb-4">
          Step 2b: Running Claude and shipping the PR
        </h3>
        <p className="text-[17px] leading-[1.75] tracking-[-0.1px] mb-4">
          This is the second half of our <InlineCode>agent.py</InlineCode> file. Here, Claude runs
          and commits the result and kills the VM so we don't have zombie instances on OpenComputer.
        </p>
        <ShikiCodeBlock
          filename="agent.py (continued)"
          code={CODE_AGENT_CLAUDE}
          language="python"
          theme="dark-plus"
          copyable
          className="my-6 border border-border/50 shadow-lg"
          bodyClassName="[&_pre]:px-6 [&_pre]:py-5 [&_pre]:text-[13.5px] [&_pre]:leading-[1.85]"
        />
        <p className="text-[17px] leading-[1.75] tracking-[-0.1px] mt-6">
          We hand the task to Claude Code in headless mode, capped to a maximum of 50 turns so it
          doesn't get stuck in a loop, and the emit is set to JSON so we can track the cost per
          task later.
        </p>
        <p className="text-[17px] leading-[1.75] tracking-[-0.1px] mt-4">
          You'll also note I'm using the <InlineCode>--dangerously-skip-permissions</InlineCode>{" "}
          flag. That's because the VM is disposable and completely isolated (the main reason why
          we didn't run the background coding agent in our persistent VM). In case a Claude run
          goes awry, there's zero risk to our environment or our codebase.
        </p>
        <p className="text-[17px] leading-[1.75] tracking-[-0.1px] mt-4">
          When Claude's done, we commit, push the branch, and open a draft PR through the{" "}
          <InlineCode>gh</InlineCode> CLI, which already has the token and prints the PR URL back
          to us.
        </p>
      </FadeIn>

      {/* Step 3 */}
      <FadeIn>
        <h3 className="font-heading text-[22px] tracking-[-0.3px] mt-10 mb-4">
          Step 3: Receive GitHub webhooks and trigger the agent
        </h3>
        <p className="text-[17px] leading-[1.75] tracking-[-0.1px] mb-4">
          Our persistent FastAPI server listens for labeled issues and reacts instantly. When an
          issue arrives tagged to an agent, the handler does three things:
        </p>
        <ul className="space-y-2 text-[17px] leading-[1.75] tracking-[-0.1px] pl-1 mb-4">
          <li className="pl-5 relative before:content-['—'] before:absolute before:left-0 before:text-muted-foreground">
            ack the webhook before GitHub's 10-second timer fires.
          </li>
          <li className="pl-5 relative before:content-['—'] before:absolute before:left-0 before:text-muted-foreground">
            Launch the agent in the background.
          </li>
          <li className="pl-5 relative before:content-['—'] before:absolute before:left-0 before:text-muted-foreground">
            Comment on the issue so you know it triggered.
          </li>
        </ul>
        <p className="text-[17px] leading-[1.75] tracking-[-0.1px] mb-4">
          Here's the <InlineCode>server.py</InlineCode> file that you can copy over.
        </p>
        <ShikiCodeBlock
          filename="server.py"
          code={CODE_SERVER}
          language="python"
          theme="dark-plus"
          copyable
          className="my-6 border border-border/50 shadow-lg"
          bodyClassName="[&_pre]:px-6 [&_pre]:py-5 [&_pre]:text-[13.5px] [&_pre]:leading-[1.85]"
        />
        <p className="text-[17px] leading-[1.75] tracking-[-0.1px] mt-6">
          You need to run this on the persistent VM solely because GitHub webhooks have a
          10-second window for your server to acknowledge the event, and for that, the server
          needs to be actively listening for those events.
        </p>
        <p className="text-[17px] leading-[1.75] tracking-[-0.1px] mt-4">
          The handler we've designed verifies the signature, checks for the{" "}
          <InlineCode>agent</InlineCode> label, schedules the work to keep running after the
          response goes out, and returns in milliseconds. Each labeled issue runs as its own
          background task with its own sandbox, so two issues labeled at once become two
          independent runs. The handler comments once when it picks up the issue, then again with
          the PR link or the error trace when the run finishes.
        </p>
      </FadeIn>

      {/* Step 4 */}
      <FadeIn>
        <h3 className="font-heading text-[22px] tracking-[-0.3px] mt-10 mb-4">
          Step 4: Point GitHub at your server
        </h3>
        <p className="text-[17px] leading-[1.75] tracking-[-0.1px] mb-4">
          Expose your server with ngrok during development or production on the persistent
          OpenComputer VM:
        </p>
        <ShikiCodeBlock
          code={`ngrok http 3000`}
          language="bash"
          theme="dark-plus"
          copyable
          className="my-6 border border-border/50 shadow-lg"
          bodyClassName="[&_pre]:px-6 [&_pre]:py-5 [&_pre]:text-[13.5px] [&_pre]:leading-[1.9]"
        />
        <p className="text-[17px] leading-[1.75] tracking-[-0.1px] mt-6">
          Then in your repo, go to Settings &rarr; Webhooks &rarr; Add webhook. Set the payload
          URL to your ngrok HTTPS URL with <InlineCode>/webhook</InlineCode> appended (something
          like <InlineCode>https://sb-abc123-p3000.workers.opencomputer.dev/webhook</InlineCode>),
          set the content type to <InlineCode>application/json</InlineCode>, paste in the same
          secret you put in <InlineCode>GITHUB_WEBHOOK_SECRET</InlineCode>, choose "Let me choose
          individual events", and check <strong>Issues</strong> only.
        </p>
        <p className="text-[17px] leading-[1.75] tracking-[-0.1px] mt-4">
          Create the label the agent listens for under Issues &rarr; Labels &rarr; New label
          &rarr; <InlineCode>agent</InlineCode>.
        </p>
      </FadeIn>

      {/* Step 5 */}
      <FadeIn>
        <h3 className="font-heading text-[22px] tracking-[-0.3px] mt-10 mb-4">
          Step 5: Run it and ship your first sleeping PR
        </h3>
        <p className="text-[17px] leading-[1.75] tracking-[-0.1px] mb-4">
          Start the server. You could also turn the server into a service to allow the script to
          run persistently.
        </p>
        <ShikiCodeBlock
          code={`python server.py`}
          language="bash"
          theme="dark-plus"
          copyable
          className="my-6 border border-border/50 shadow-lg"
          bodyClassName="[&_pre]:px-6 [&_pre]:py-5 [&_pre]:text-[13.5px] [&_pre]:leading-[1.9]"
        />
        <p className="text-[17px] leading-[1.75] tracking-[-0.1px] mt-6 mb-3">
          To test this, open an issue that's small and quick to resolve. Some good first targets:
        </p>
        <ul className="space-y-2 text-[17px] leading-[1.75] tracking-[-0.1px] pl-1 mb-4">
          <li className="pl-5 relative before:content-['—'] before:absolute before:left-0 before:text-muted-foreground">
            Add a <InlineCode>--version</InlineCode> flag to the CLI that prints the version from{" "}
            <InlineCode>pyproject.toml</InlineCode>.
          </li>
          <li className="pl-5 relative before:content-['—'] before:absolute before:left-0 before:text-muted-foreground">
            Sort the <InlineCode>/api/users</InlineCode> response by{" "}
            <InlineCode>created_at</InlineCode> descending.
          </li>
          <li className="pl-5 relative before:content-['—'] before:absolute before:left-0 before:text-muted-foreground">
            Replace bare <InlineCode>except:</InlineCode> clauses with{" "}
            <InlineCode>except Exception:</InlineCode> across <InlineCode>src/</InlineCode>.
          </li>
        </ul>
        <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
          Label the issue <InlineCode>agent</InlineCode>, come back in a couple of minutes,
          depending on repo size and how much code Claude has to read. The bot comments with the
          PR URL when it's done.
        </p>
        <p className="text-[17px] leading-[1.75] tracking-[-0.1px] mt-4">
          Read the diff, mark it ready for review if it's close, or comment with more direction
          and re-label to run it again.
        </p>
      </FadeIn>

      {/* What it actually costs */}
      <FadeIn>
        <h3 className="font-heading text-[22px] tracking-[-0.3px] mt-12 mb-4">
          What it actually costs
        </h3>
        <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
          A typical issue runs $0.20 to $0.40 in Anthropic API spend, and the VM time underneath
          it (3 to 8 minutes, then gone) comes in under a cent. To spend less, cut Claude's turns
          or route the easy stuff to Haiku, because fiddling with the VM won't move the needle.
        </p>
        <p className="text-[17px] leading-[1.75] tracking-[-0.1px] mt-4">
          The best predictor of cost is how much Claude has to read to build context.
        </p>
      </FadeIn>

      <FadeIn>
        <div className="w-12 h-px bg-border my-10" />
      </FadeIn>

      {/* ====== Section: Where it can fail ====== */}
      <FadeIn>
        <h2 id="where-it-can-fail" className="scroll-mt-24 font-heading text-[clamp(28px,4vw,38px)] leading-[1.35] tracking-[-0.8px] mb-6">
          Where your background coding agent can fail
        </h2>
      </FadeIn>

      <FadeIn>
        <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
          A handful of failure patterns showed up often enough to name.
        </p>
      </FadeIn>

      <FadeIn>
        <h3 className="font-heading text-[22px] tracking-[-0.3px] mt-10 mb-4">
          Claude refactoring files you didn't ask it to
        </h3>
        <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
          Claude opens a file, decides the indentation is wrong or a name could be clearer, and
          reformats it on the way past. The <InlineCode>TASK.md</InlineCode> line ("Keep the diff
          focused. Do not refactor unrelated files.") gets enforced maybe 70% of the time. But you
          need manual code review for the remaining 30%.
        </p>
      </FadeIn>

      <FadeIn>
        <h3 className="font-heading text-[22px] tracking-[-0.3px] mt-10 mb-4">
          The edit-test-fail loop
        </h3>
        <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
          Claude makes a change, a test fails, it tries something else, that fails too, and the
          cycle repeats for forty turns. The <InlineCode>--max-turns</InlineCode> cap stops it
          eventually, but the loop can still burn $0.50 first, and you need to figure out what
          happened to avoid wasting tokens.
        </p>
      </FadeIn>

      <Visual
        src={`${VISUAL_BASE}/04-edit-test-fail-loop.html`}
        height={460}
        title="The edit-test-fail loop"
        fallback="Claude cycles through EDIT (writes code), TEST (runs pytest or npm test), and FAIL (assertion error), then loops back to EDIT. The animation tracks the turn counter against the --max-turns cap of 50 and accumulating spend at roughly $0.01 per turn at Sonnet pricing. The loop is killed when turns reach the cap, but can burn $0.50 before that fires. The single mitigation that moves the success rate most is dropping a CLAUDE.md at the repo root with the exact test command — the headless CLI reads it on startup."
      />

      <FadeIn>
        <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
          Repos with no obvious test command make this worse, since Claude can easily go through
          the turn limits just figuring out how to run the tests.
        </p>
        <p className="text-[17px] leading-[1.75] tracking-[-0.1px] mt-4">
          Drop a <InlineCode>CLAUDE.md</InlineCode> in the repo root with the exact test command
          and your conventions. The headless CLI reads it on startup, and it's the single change
          that moves the success rate the most.
        </p>
      </FadeIn>

      <FadeIn>
        <h3 className="font-heading text-[22px] tracking-[-0.3px] mt-10 mb-4">
          GitHub PATs rate-limit at 5,000 req/hour
        </h3>
        <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
          A single run spends a few dozen REST calls (read the issue, post comments, push the
          branch, open the PR), so one PAT handles about a hundred runs an hour. Run ten agents in
          parallel off the same token, and you'll hit the ceiling, especially if that PAT also
          drives other automation. Instead, switch to a GitHub App with per-installation tokens
          once you're there, since each gets its own 5,000/hour budget.
        </p>
      </FadeIn>

      <FadeIn>
        <div className="w-12 h-px bg-border my-10" />
      </FadeIn>

      {/* ====== Section: Tradeoff ====== */}
      <FadeIn>
        <h2 id="the-tradeoff" className="scroll-mt-24 font-heading text-[clamp(28px,4vw,38px)] leading-[1.35] tracking-[-0.8px] mb-6">
          Now for the tradeoff
        </h2>
      </FadeIn>

      <FadeIn>
        <p className="text-[17px] leading-[1.75] tracking-[-0.1px] italic text-foreground/80">
          It feels awesome to have work done without lifting a finger. But it's not all A-OK.
        </p>
        <p className="text-[17px] leading-[1.75] tracking-[-0.1px] mt-4">
          I'd spend a lot of time testing and refining these workflows on low-risk repositories
          before they ever touch production.
        </p>
        <p className="text-[17px] leading-[1.75] tracking-[-0.1px] mt-4">
          That's because we have to trust Claude (or another LLM) to make judgment calls in a
          sandbox with no human review until the draft PR is opened. And considering how easily
          LLMs overengineer solutions, I would not start merging PRs blindly.
        </p>
        <p className="text-[17px] leading-[1.75] tracking-[-0.1px] mt-4">
          Apart from that, I don't see much of an issue. A well-built agent could be extremely
          helpful in getting the simpler parts of your day-to-day workflows settled.
        </p>
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

export default BackgroundCodingAgent;
