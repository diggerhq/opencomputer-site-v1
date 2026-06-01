---
title: "Build a background coding agent that works while you sleep"
description: "A 250-line self-hosted background coding agent. Label a GitHub issue with `agent`, wake up to a draft PR. ~$0.30/task. The snapshot, the agent loop, the webhook server, and the dead ends to skip."
author: "Naman @ Manicule"
author_url: "https://manicule.dev"
date_published: "2026-06-01"
canonical_url: "https://opencomputer.dev/blog/background-coding-agent"
demo_video: "https://opencomputer.dev/blog-visuals/background-coding-agent/agent-demo.mp4"
---

# Build a background coding agent that works while you sleep

> Written by [Naman @ Manicule](https://manicule.dev) · June 1, 2026

I have a backlog of issues I'd rather not touch. Stuff like missing CLI flags, typos, flaky tests, and the list goes on. Out of equal parts curiosity and laziness, I wanted to hand these issues to one of these background coding agents and see if they could handle the work without me having to do it.

After testing hosted options such as Devin, I decided to control the entire stack.

I'll walk you through building your own background coding agent using OpenComputer's VMs and sandboxes in about 250 lines of Python, at roughly $0.30 per task at Claude's current pricing.

Know the basics? Jump to the implementation of the recipe or just grab the [full working code](https://github.com/ninadpathak/opencomputer-demo).

## What you'll build

A self-hosted background coding agent that activates when you tag a GitHub issue with `agent`, works out a fix, and opens a draft PR. You only verify the result.

**Demo video:** <https://opencomputer.dev/blog-visuals/background-coding-agent/agent-demo.mp4>

The architecture, end-to-end: a GitHub issue labeled `agent` fires a webhook to a persistent FastAPI server, which verifies the signature, acknowledges within milliseconds, and launches a background task. The task boots a disposable OpenComputer sandbox (2–3 second cold start), clones the repo, runs Claude Code headlessly with a 50-turn cap, then uses the `gh` CLI to push the branch and open a draft PR. The sandbox is killed at the end of the run, so idle cost is zero. Two issues labeled at once become two independent sandbox runs.

Here's how I structured the setup:

- **A FastAPI server.** Something to catch GitHub webhook events and dispatch them. FastAPI was the easy option.
- **The OpenComputer API.** Each tagged issue gets its own disposable Linux VM, booted from a base image that already ships Claude Code, git, Node, and Python, with the `gh` CLI added at boot (or baked into a snapshot, see Step 1). The VM is torn down the moment the run ends, so I pay for the compute only while it's working.
- **Claude Code in headless mode.** Inside the VM, it reads the issue, edits the repo, runs the tests, and commits.
- **The `gh` CLI.** It pushes the branch and opens the draft PR as the last step, using a token that the server never has to handle itself.

A typical task spends $0.20 to $0.40 on the Anthropic API, and the VM time underneath it is a fraction of a cent. Route the trivial tickets to a cheaper model, and a task runs for a couple of cents.

**Interactive cost breakdown:** at <https://opencomputer.dev/blog-visuals/background-coding-agent/03-cost-calculator.html>. A typical Sonnet run at medium context with 18 turns costs ~$0.30 per task — ~$0.29 in Anthropic API spend, ~$0.004 in VM compute. At 60 issues per month that's $18 in tokens plus an $8.76/month persistent box for the webhook server.

> This recipe was inspired by [Ramp's Inspect agent](https://builders.ramp.com/post/why-we-built-our-background-agent), where they completely own the stack top to bottom: Sentry, Datadog, LaunchDarkly, and Braintrust wired in, internal tools on hand, dev images refreshed every 30 minutes. The agent is only limited by model intelligence. What we're building is the foundation a background coding agent system can sit on: a VM you control, an agent inside it, and a trigger that wakes it up.

---

## How the pieces fit

Every issue gets its own throwaway Linux VM that boots in 2 to 3 seconds, does the work, and gets torn down when it's done. That one property is what keeps the rest of the design simple. Here's how OpenComputer delivers it.

### The persistent box

A sandbox is a full Linux VM with its own kernel, memory, disk, network namespace, and process table, isolated by KVM at the hardware level. You get root, you install what you want, and it persists between runs.

This setup works quite similarly to a Docker image with two differences: a snapshot captures live VM state, and it's addressed by the content hash of its definition instead of a tag.

**Comparison — Docker image vs OpenComputer sandbox.** They share: declarative builds (`apt_install` + `run_commands`), reproducibility, base + layered tools, and cached rebuilds. They differ in four ways:

| | Docker image | OpenComputer sandbox |
|---|---|---|
| Kernel | Shares host kernel | Own KVM kernel |
| State | Ephemeral by default | Persists between runs |
| Addressing | Mutable `:tag` you assign | Content-hashed by definition |
| Isolation | Namespaces & cgroups | Hardware-level (KVM) |

OpenComputer has persistent sandboxes which run at $8.76/month for a 1 GB instance, which is similar to a VPS or a Railway instance with similar config. And the base version of OpenComputer's persistent sandbox is more than enough for running a FastAPI server.

### A sandbox per issue

When an issue arrives, the server spins up a fresh sandbox for it, runs Claude Code inside, opens the PR, and kills the sandbox once it's done. The repo cloning, code edits, and testing happen on this isolated server.

**Why can't we run everything in the same persistent sandbox?** Nearly everything the agent touches is code you didn't write, running with `--dangerously-skip-permissions`. A poisoned README or a bad dependency could read the GitHub token or trash the filesystem, so you want it nowhere near the server. Inside a throwaway sandbox, the damage has nowhere to go: the sandbox dies at the end of the run, and the box keeps serving webhooks as if nothing happened.

When a run fills the disk, leaks memory, or wedges in a loop, it takes its own sandbox down with it and leaves the server untouched, and the persistent box never accumulates random code. You also get concurrency without doing anything for it. Two issues labeled at the same moment simply run side by side.

---

## Prerequisites

- Python 3.10 or newer
- An OpenComputer account and API key from app.opencomputer.dev
- An Anthropic API key from console.anthropic.com with Claude Code access
- A GitHub Personal Access Token with `repo` scope (the agent pushes branches and opens PRs as this token's user)
- A GitHub repository you control with at least one bug-fix-sized issue in it
- A persistent OpenComputer instance to run the webhook server on

## Environment setup

Install the SDK and the rest of the dependencies:

```sh
pip install opencomputer-sdk fastapi "uvicorn[standard]" httpx python-dotenv
```

Configure your keys in `.env`:

```env
OPENCOMPUTER_API_KEY=osb_...        # app.opencomputer.dev — API Keys
ANTHROPIC_API_KEY=sk-ant-...        # console.anthropic.com — API Keys
GITHUB_TOKEN=ghp_...                # github.com/settings/tokens — repo scope
GITHUB_WEBHOOK_SECRET=letmein       # any random string, paste the same one into GitHub
PORT=3000
```

Project structure (only the files this cookbook creates):

```
build_snapshot.py   — run once to bake the coder snapshot
agent.py            — spins up a sandbox, hands the task to Claude Code, opens the PR
server.py           — FastAPI webhook server
.env
```

## Want your coding agent to set this up for you?

Just grab the API keys and tokens and hand this prompt over to your coding agent. It'll take care of the rest.

```
Build the self-hosted background coding agent described in this post: https://opencomputer.dev/blog/background-coding-agent. Read it and follow it as the source of truth for the code and setup.

What it is: a FastAPI webhook server that, when a GitHub issue is labeled `agent`, spins up a disposable OpenComputer sandbox, runs Claude Code headless on the issue, and opens a draft PR.

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

Ask me for: the four values above, the target GitHub repo, and confirmation once I've created the `agent` label and pointed a webhook (Issues events) at the server.
```

---

## Implementation

Three files, built in the order they run: `build_snapshot.py` (one-time setup), `agent.py` (handles one issue), and `server.py` (the webhook receiver).

### Step 1: Pre-install the agent's tools into a snapshot

Installing Claude Code and `gh` on every run would cost ~90 seconds per issue, waiting on npm and apt. We'll instead bake the required tools into a snapshot so every sandbox boots with Claude and `gh` already in `$PATH`.

```python
# build_snapshot.py
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
    print(f"\nSnapshot ready: {snap['name']} ({snap['id']})")


if __name__ == "__main__":
    asyncio.run(main())
```

Run it once:

```sh
python build_snapshot.py
```

The build starts from OpenComputer's Ubuntu 22.04 base (Python, Node, and build tools already present) and layers on what the agent needs: `gh` from its official apt repo, Claude Code from npm, and a git identity so commits have an author. The first build takes 3 to 4 minutes, but after that it's nearly instant.

### Step 2a: Booting and prepping the sandbox

With the snapshot ready, we'll work on `agent.py`. This is one function that takes a GitHub issue, boots a sandbox, clones the repo, hands the job to Claude Code, and opens a draft PR with the fix.

```python
# agent.py
import asyncio
import os
from dataclasses import dataclass
import httpx
from opencomputer import Sandbox
from opencomputer.exec import ProcessResult

USE_SNAPSHOT = os.environ.get("USE_SNAPSHOT", "0") == "1"
MODEL = os.environ.get("CLAUDE_MODEL", "claude-sonnet-4-6")

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
        raise RuntimeError(f"`{cmd[:60]}...` exited {r.exit_code}: {r.stderr[:500]}")
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
        sandbox = await Sandbox.create(snapshot="coder", timeout=1800, metadata=metadata)
    else:
        sandbox = await Sandbox.create(template="base", timeout=1800, metadata=metadata)

    sandbox._client._timeout = httpx.Timeout(1700.0)

    try:
        if not USE_SNAPSHOT:
            await _exec(sandbox, RUNTIME_PREP, timeout=300)

        await _exec(
            sandbox,
            f"git clone https://x-access-token:{token}@github.com/{task.repo}.git repo",
            cwd="/workspace",
            timeout=120,
        )

        branch = f"agent/issue-{task.issue_number}"

        await sandbox.files.write(
            "/workspace/repo/TASK.md",
            "\n".join([
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
        # ... continues in Step 2b
```

A fresh VM boots in 2 to 3 seconds. By default, it's OpenComputer's base image, which already ships Claude Code, git, Node, and Python, so `RUNTIME_PREP` only has to add the `gh` CLI; set `USE_SNAPSHOT=1` to boot the coder snapshot from Step 1 instead and skip even that. The API key and GitHub token are handed to the commands that need them as environment variables rather than baked into the image, and a 30-minute timeout deletes the VM if a run stalls.

### Step 2b: Running Claude and shipping the PR

This is the second half of `agent.py`. Claude runs, commits the result, and the VM is killed so we don't have zombie instances on OpenComputer.

```python
        # Hand it to Claude. --dangerously-skip-permissions is safe here because
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

        safe_title = task.title.replace('"', '\\"')

        # Commit and push. Claude often commits its own work, so only commit when
        # something is actually staged, then always push.
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
            f'--body "Closes #{task.issue_number}\n\n'
            '_Drafted by sleep-agent. Review the diff before merging._"',
            cwd="/workspace/repo",
            env=secret_env,
            timeout=60,
        )

        return pr.stdout.strip()
    finally:
        await sandbox.kill()
```

We hand the task to Claude Code in headless mode, capped to a maximum of 50 turns so it doesn't get stuck in a loop, and the emit is set to JSON so we can track the cost per task later.

The `--dangerously-skip-permissions` flag is safe here because the VM is disposable and completely isolated (the main reason we didn't run the agent in our persistent VM). In case a Claude run goes awry, there's zero risk to our environment or our codebase.

When Claude's done, we commit, push the branch, and open a draft PR through the `gh` CLI, which already has the token and prints the PR URL back to us.

### Step 3: Receive GitHub webhooks and trigger the agent

Our persistent FastAPI server listens for labeled issues and reacts instantly. When an issue arrives tagged `agent`, the handler does three things:

- ack the webhook before GitHub's 10-second timer fires
- launch the agent in the background
- comment on the issue so you know it triggered

```python
# server.py
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
            f"❌ sleep-agent failed:\n\n```\n{exc}\n```",
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
    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("PORT", "3000")))
```

You run this on the persistent VM because GitHub webhooks have a 10-second acknowledge window. The handler verifies the signature, checks for the `agent` label, schedules the work, and returns in milliseconds. Each labeled issue runs as its own background task with its own sandbox, so two issues labeled at once become two independent runs.

### Step 4: Point GitHub at your server

Expose your server with ngrok during development, or run it on the persistent OpenComputer VM:

```sh
ngrok http 3000
```

Then in your repo, Settings → Webhooks → Add webhook. Payload URL: your ngrok HTTPS URL with `/webhook` appended (e.g. `https://sb-abc123-p3000.workers.opencomputer.dev/webhook`). Content type: `application/json`. Paste in the same secret you put in `GITHUB_WEBHOOK_SECRET`. Choose "Let me choose individual events", check **Issues** only.

Create the label the agent listens for: Issues → Labels → New label → `agent`.

### Step 5: Run it and ship your first sleeping PR

```sh
python server.py
```

Open a small issue. Good first targets:

- Add a `--version` flag to the CLI that prints the version from `pyproject.toml`.
- Sort the `/api/users` response by `created_at` descending.
- Replace bare `except:` clauses with `except Exception:` across `src/`.

Label the issue `agent`. The bot comments with the PR URL when it's done.

### What it actually costs

A typical issue runs $0.20 to $0.40 in Anthropic API spend; the VM time underneath it (3 to 8 minutes, then gone) comes in under a cent. The best predictor of cost is how much Claude has to read to build context. To spend less, cut turns or route easy tickets to Haiku — fiddling with the VM won't move the needle.

---

## Where your background coding agent can fail

### Claude refactoring files you didn't ask it to

Claude opens a file, decides the indentation is wrong or a name could be clearer, and reformats it on the way past. The TASK.md line ("Keep the diff focused. Do not refactor unrelated files.") gets enforced maybe 70% of the time. You need manual code review for the remaining 30%.

### The edit-test-fail loop

Claude makes a change, a test fails, it tries something else, that fails too, and the cycle repeats for forty turns. The `--max-turns` cap stops it eventually, but the loop can still burn $0.50 first.

Repos with no obvious test command make this worse — Claude can go through the turn limits just figuring out how to run the tests.

**Mitigation:** drop a `CLAUDE.md` in the repo root with the exact test command and your conventions. The headless CLI reads it on startup, and it's the single change that moves the success rate the most.

### GitHub PATs rate-limit at 5,000 req/hour

A single run spends a few dozen REST calls (read the issue, post comments, push the branch, open the PR), so one PAT handles about 100 runs an hour. Run ten agents in parallel off the same token, and you'll hit the ceiling, especially if that PAT also drives other automation. Switch to a GitHub App with per-installation tokens — each gets its own 5,000/hour budget.

---

## The tradeoff

It feels awesome to have work done without lifting a finger. But it's not all A-OK.

I'd spend a lot of time testing and refining these workflows on low-risk repositories before they ever touch production. We have to trust Claude (or another LLM) to make judgment calls in a sandbox with no human review until the draft PR is opened. And considering how easily LLMs overengineer solutions, I would not start merging PRs blindly.

Apart from that, I don't see much of an issue. A well-built agent could be extremely helpful in getting the simpler parts of your day-to-day workflows settled.

---

**Read this post in HTML:** <https://opencomputer.dev/blog/background-coding-agent>
**Full working code:** <https://github.com/ninadpathak/opencomputer-demo>
