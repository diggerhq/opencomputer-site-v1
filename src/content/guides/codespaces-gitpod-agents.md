# GitHub Codespaces vs Gitpod for Autonomous AI Agents


By Utpal Nadiger

GitHub Codespaces and Gitpod (now Ona) are cloud development environments, machines you rent to write code on from a browser. They were built for a human who opens a session and later closes the laptop.

So they stop a machine that looks idle and cap how long a session can run. The machine size is also fixed when you create it.

An autonomous agent needs the opposite, because it runs unattended for hours and its memory needs can spike mid-run. This piece compares the options on the three things that decide whether your agent survives a long run:

- idle behavior
- session limits
- whether you can resize a running machine

## Why do cloud dev environments get in an agent's way?

A cloud development environment (CDE) is built on four assumptions that don't hold for an agent, so each default that helps a human gets in your agent's way. The [agentic workload](https://opencomputer.dev/blog/the-agentic-workload) is a different kind of job from interactive code editing, and no configuration setting changes that.

The four assumptions:

- **Someone is watching.** CDEs shut down an idle machine to stop the billing. An agent that goes quiet for two minutes while it thinks looks idle, and nothing restarts the machine.
- **Sessions are short and interactive.** The session model assumes an hour of work followed by a shutdown. An agent runs unattended for hours and must survive a dropped client connection.
- **The machine size is picked once, up front.** The size picker assumes RAM needs are known before the session starts. An agent's needs spike unpredictably. It can run fine for an hour and then fork a build that eats 12GB.
- **The work is worth pre-warming.** Prebuilds cache a repo so the first session boots in seconds. An agent gains little from a fast first boot, because its problem is being stopped mid-run.

None of this makes Codespaces or Gitpod bad. For the job they were built for, interactive development on a big repo with a fast first boot, they are excellent.

## How do the options compare for an unattended agent?

The tools split into three groups:

- human CDEs (Codespaces and Coder)
- the platform Gitpod became (Ona)
- purpose-built agent VMs (OpenComputer)

Devcontainers is a spec rather than a runtime, so it is not in the table.

| | Built for | Idle behavior | Stopped-state retention | Resize a running machine | Isolation | Price (small box) |
|---|---|---|---|---|---|---|
| **GitHub Codespaces** | Human devs on a repo | Auto-stops after 30 min idle (max 4h) | Auto-deleted after up to 30 days | No, stop and restart required | Container | $0.18/hr (2-core) |
| **Gitpod / Ona** | AI agent orchestration | Environments auto-delete after 7 days inactive | 7 days | No live runtime resize | Container + VPC policy | From $20/mo, OCU credits |
| **Coder** | Self-hosted human devs | You define it (your infra) | You define it | Depends on your infra | Whatever you provision | Free OSS / per-user Premium |
| **OpenComputer** | Autonomous agents | Always-on, no timeout | Persists until you delete it | Yes, CPU and RAM at runtime | Real KVM VM, own kernel | $0.24/hr flat |

The rest of this piece takes each option in turn, covering what it does best and where your agent runs into a limit.

### What is GitHub Codespaces best for?

Codespaces is best at onboarding you onto a large or fiddly repository in seconds instead of a morning. A codespace is a container-based dev environment GitHub spins up from a repo and a `devcontainer.json` config, reachable from the browser or VS Code.

The standout feature is [prebuilds](https://docs.github.com/en/codespaces/prebuilding-your-codespaces/about-github-codespaces-prebuilds). A GitHub Actions workflow builds a snapshot of the repo with dependencies and extensions already installed and refreshes it on every push, so a new codespace for a slow repo starts in seconds instead of minutes.

The defaults underneath it are all tuned for an interactive session, though. A codespace [stops after a period of inactivity](https://docs.github.com/en/codespaces/setting-your-user-preferences/setting-your-timeout-period-for-github-codespaces), 30 minutes by default, and the ceiling can be raised only to 240 minutes, four hours.

The timeout exists so an idle machine doesn't keep billing. For your agent, four hours is a hard ceiling, and the timeout tracks human-style activity rather than the running process.

The other limit is the machine size, chosen when the codespace is created. Sizes run from a 2-core box with 8GB RAM and 32GB storage up to 32 cores and 128GB.

[Changing the machine type](https://docs.github.com/en/codespaces/customizing-your-codespace/changing-the-machine-type-for-your-codespace) mid-session requires stopping and restarting the codespace, and a change in storage size stops a running codespace automatically. So if your agent needs 16GB mid-run, it cannot get the memory without losing the process it was running.

Pricing is per compute-hour on top of a free monthly allowance:

- $0.18/hr for the 2-core box
- $2.88/hr for 32 cores
- $0.07 per GB-month of storage

### What happened to Gitpod, and is it now Ona?

Gitpod rebranded to Ona in late 2025 and rebuilt itself around AI agents, and the old Gitpod Classic pay-as-you-go product was [sunset on October 15th, 2025](https://ona.com/stories/gitpod-classic-payg-sunset). Comparisons written before the rebrand describe a product that no longer exists in that form.

Gitpod was one of the companies that defined the human cloud development environment. Others in that category were absorbed or shut down: Cloud9 was folded into AWS in 2016, and Nitrous.io closed its cloud IDE in November of the same year.

Gitpod took a third path and rebuilt the whole company around agents. [Ona](https://ona.com/) now markets itself as "the platform for background agents," where you hand an agent a task and it "executes end-to-end in the background" and opens a pull request.

In June 2026 OpenAI announced it was [acquiring Ona](https://openai.com/index/openai-to-acquire-ona/) so that Codex agents can keep working for hours unattended after the developer closes the laptop.

![Ona homepage describing the platform for background agents](/guides/assets/codespaces-gitpod-agents/homepage-ona.png)

Ona fits when you want all three of these from one vendor:

- managed agent orchestration
- GPU access
- a VPC deployment with kernel-level policy enforcement

The Core plan starts at $20/month and bills in OCUs (Ona Compute Units), with GPU included and machines up to 32 cores and 128GB RAM.

[Ona environments auto-delete after 7 days of inactivity](https://ona.com/docs/ona/environments/archive-auto-delete), a default carried over from Gitpod. Seven days is far more generous than a four-hour idle stop, but the environment is still deleted on a timer built for a person who might come back to it.

### Where does Coder fit?

Coder is for teams whose compliance or data-residency rules require development environments on self-managed infrastructure. It is self-hosted, so it [provisions governed environments on infrastructure you control](https://coder.com/pricing) rather than renting them from a vendor's cloud.

The Community Edition is free and open source. Premium is priced per user per year and adds:

- audit logging
- high availability
- SSO controls

Because Coder runs on your infrastructure, your Terraform templates and the cluster underneath decide the agent-relevant behavior:

- idle handling
- persistence
- whether a running workspace can grow

That flexibility is the selling point, and it leaves the agent-friendly behavior for you to build. Coder provides the framework for it, but it does not ship an always-on, live-resizable machine out of the box.

### What is a devcontainer, and does it solve the agent problem?

A devcontainer is a portable definition of a development environment, and it solves reproducibility rather than lifecycle. It is the format meant to retire "works on my machine."

The [Development Containers specification](https://containers.dev/) is an open, Microsoft-backed spec, a `devcontainer.json` file that describes what a project needs to run. The same file produces the same environment in every runtime that supports it:

- Codespaces
- Ona
- VS Code locally
- CI

The file carries over unchanged to whichever of those runtimes your agent lands on. Ona's own migration guidance is to move off the old `.gitpod.yml` format onto `devcontainer.json`.

But the spec describes what goes *inside* the box, and it says nothing about the box's lifecycle:

- how long it lives
- whether it stops when idle
- whether it survives a disconnect
- whether it can grow while running

An unattended agent depends on all four, and the runtime decides them, not the config file.

## What does an agent need from its compute?

Your agent needs a machine that stays up on its own for hours and survives a dropped client connection. The machine also needs to grow while the job is still running.

That combination separates the tools above from purpose-built agent VMs like [OpenComputer](https://opencomputer.dev/), which is open source at `github.com/diggerhq/opencomputer`. OpenComputer differs in three ways.

### What happens to an agent VM when it goes idle?

Nothing happens, because OpenComputer VMs are always-on. There are none of the timers the other tools have:

- no 30-minute idle stop
- no 4-hour session ceiling like the one Codespaces has
- no 7-day delete like the one Ona has

When your agent goes quiet to think, nothing treats that as idleness. When it finishes, the VM hibernates and wakes to the exact prior state, so a run that pauses overnight resumes where it stopped instead of from a cold rebuild.

The case for keeping the environment persistent instead of ephemeral is in [stop treating sandboxes as cattle](https://opencomputer.dev/blog/stop-treating-sandboxes-as-cattle).

### Can you resize an agent VM while it runs?

Yes, and without a restart. When your agent hits a memory-hungry step mid-run, OpenComputer changes the CPU and RAM of the live VM, with RAM going from 1GB up to 16GB.

None of the other tools in the table ship this. Codespaces requires a stop and restart to change machine type, Ona has no live runtime resize, and Coder leaves it to whatever your own infrastructure supports.

[What elastic compute means](https://opencomputer.dev/blog/what-elastic-compute-means) covers why a size fixed at creation is the wrong model for agent jobs.

### How is an agent VM isolated?

Each agent gets a full KVM virtual machine with its own kernel, so the isolation is enforced at the hardware level rather than by container namespaces sharing the host kernel. That boundary matters when you run model-written code that no one has reviewed.

[Sandbox fingerprinting](https://opencomputer.dev/blog/sandbox-fingerprinting) breaks down the isolation models across sandbox vendors.

Pricing is a flat $0.004/min, which works out to $0.24/hr. The default box gives you 1 vCPU and 4GB RAM, with 20GB of disk included.

That is more per hour than the small Codespaces box, but the price buys a full VM with its own kernel rather than a container slot, and the VM has no timeout or auto-delete.

OpenComputer does not offer a GPU, a bring-your-own-cloud deployment, or multi-region placement. A job that needs an H100 or has to run inside your own AWS account fits Ona or Coder better.

![OpenComputer pricing and persistence model](/guides/assets/codespaces-gitpod-agents/pricing-opencomputer.png)

## So which should I use?

For fast onboarding onto a big repo, GitHub Codespaces with prebuilds is the tool built for exactly that job. Beyond that job, the tools split by constraint:

- **Ona**, Gitpod's successor, fits enterprise agent orchestration with GPU inside a VPC, and it is being acquired by OpenAI. The 7-day environment cleanup is the tradeoff.
- **Coder** fits dev environments on self-managed infrastructure. Full governance comes with it, and you build the agent-friendly behavior on top rather than getting it in the box.
- **OpenComputer** fits an agent that runs unattended for hours and needs to resize mid-run. Ona orchestrates agents; OpenComputer is the only one of the four whose compute itself is built for that job, with no idle timer and a live resize.

A cloud development environment optimizes for a human who closes the laptop when the work is done, and an agent never does. When your agent hits an idle timeout or a restart-to-resize rule, the tool is working as designed.

OpenComputer starts from the opposite default. The VM stays up until the work is done, and it can grow while the work is running.

## FAQ

### What is the maximum idle timeout for a GitHub Codespace?

The maximum is 240 minutes, or four hours, and the default is 30 minutes. The setting accepts any value [between 5 and 240 minutes](https://docs.github.com/en/codespaces/setting-your-user-preferences/setting-your-timeout-period-for-github-codespaces).

A codespace stops after that period of inactivity to avoid billing for an idle machine. An agent job that runs longer than four hours without human-style interaction gets stopped, and the ceiling cannot be raised.

### How long does GitHub keep a stopped codespace before deleting it?

By default a stopped codespace is [automatically deleted after 30 days of inactivity](https://docs.github.com/en/codespaces/setting-your-user-preferences/configuring-automatic-deletion-of-your-codespaces), and 30 days is also the maximum retention you can configure. You can set a shorter window, but not a longer one.

So a stopped codespace is never a permanent home for state. After 30 days of inactivity it is deleted along with everything on its disk.

### Can I change a Codespace's machine type without restarting?

No. [Changing the machine type](https://docs.github.com/en/codespaces/customizing-your-codespace/changing-the-machine-type-for-your-codespace) requires stopping and restarting the codespace, and if the new machine has a different storage size, GitHub stops the running codespace automatically.

There is no way to add CPU or RAM to a live, running codespace. So an agent that needs more memory mid-run loses its running process to get it.

### Is Gitpod still available, and what is Ona?

Gitpod rebranded to Ona in late 2025 and rebuilt around AI agents, and Gitpod Classic's pay-as-you-go product [sunset on October 15th, 2025](https://ona.com/stories/gitpod-classic-payg-sunset). Ona positions itself as a platform for background agents that take a task and open a pull request.

OpenAI announced in June 2026 that it was acquiring Ona to run Codex agents unattended. A Gitpod vs Codespaces comparison from before the rebrand describes a product that no longer exists in that form.

### Do I still need a devcontainer if I'm running agents?

Yes, it helps, but it doesn't solve the problems that come with running agents. A [devcontainer](https://containers.dev/) makes an environment reproducible in every runtime that supports the spec, so the same file works wherever your agent lands.

But the spec only describes what's inside the machine, and the runtime decides the rest:

- whether it stays up unattended
- whether it survives a disconnect
- whether it can resize while running

An unattended agent depends on all three, so the runtime choice still matters.

### What's the difference between a cloud development environment and an agent sandbox?

A cloud development environment is optimized for a human, so it is sized once up front and stops when idle. It expects a person to close it when they finish working.

An agent sandbox is optimized for an unattended process, so it stays up without supervision and keeps going when the connection drops. It can also resize while the process runs.

The two categories look similar because both rent you a Linux box in the cloud. Their default lifecycles are built for opposite users, though.
