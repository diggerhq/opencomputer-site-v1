# Claude Agent SDK: Where Does the Agent Actually Run?


By Utpal Nadiger

The Claude Agent SDK gives you the agent loop and the built-in tools. It does not give you the computer they run on.

Deploying an agent means settling two things the SDK leaves open. One is which machine the agent runs on, and the other is what happens to its state between turns.

This piece works through the six questions that decide the machine, then the five places a Claude Agent SDK agent can run, from a local machine to a persistent VM.

## What does the Claude Agent SDK actually give you?

The Claude Agent SDK is a library that runs Claude Code's agent loop inside your own process, in Python or TypeScript, with the same built-in tools that power the CLI. You call `query()` and the SDK [spawns and supervises a `claude` CLI subprocess](https://code.claude.com/docs/en/agent-sdk/hosting), so you never write the tool-execution loop yourself.

That subprocess owns a shell and a working directory, and it keeps the session transcript on disk. The tools come in the box:

- Read and Write for files
- Edit for changing them
- Bash for shell commands
- Glob and Grep for search
- WebSearch and WebFetch for the web
- a handful more on top

What the SDK does not give you is the environment those tools act on. The Bash tool runs generated code against whatever machine the subprocess lives on, so a `rm` or a `git push` hits that machine for real.

Anthropic's hosting docs warn that "Hosting it is not like hosting a stateless API wrapper. Every running agent is a long-lived process tied to local state."

That warning inverts the sixth rule of the 12-factor app from 2011, which says a process stays stateless and share-nothing.

A 12-factor process never counts on local-disk state surviving to the next request, but an agent counts on the opposite. Everything it knows sits on the container's filesystem:

- session transcripts
- `CLAUDE.md` memory
- working-directory files

In Anthropic's words, "none of them survive a container restart, a scale-down, or a move to a different node."

### Does Claude Code have a built-in sandbox?

It does, but the sandbox is narrower than the word suggests. Claude Code ships a [sandboxed Bash tool](https://code.claude.com/docs/en/sandboxing) you turn on with `/sandbox`, which uses the operating system's own primitives, Seatbelt on macOS and bubblewrap on Linux and WSL2.

Writes are confined to the working directory and the session temp dir. Network access goes through a proxy that prompts you the first time a command reaches a new domain.

The sandbox constrains Bash commands and their child processes, and nothing else. Everything else still runs directly on the host:

- the built-in file tools
- MCP servers
- hooks

Anthropic says the per-command sandbox "is not sufficient for fully unattended runs," and the [sandbox environments guide](https://code.claude.com/docs/en/sandbox-environments) points unattended agents at wrapping the whole process in a container or a VM, not at `/sandbox` alone. The reason is that the sandbox shares the host kernel, so it "reduces risk but is not a complete isolation boundary."

## What actually decides where the agent runs?

Six questions decide it, and each one shows up as a failure mode in production. The table below scores the five places you can run a Claude Agent SDK agent against all six.

| Where it runs | Survives a disconnect | State between turns | Isolation from host | Idle cost | Concurrency | Best for |
|---|---|---|---|---|---|---|
| Local machine | No | On your disk | None | Free (your hardware) | 1, realistically | Interactive dev |
| Docker container you manage | Only if you keep it up | Container filesystem | Shared kernel | Free / your box | Bounded by one host's RAM | Solo dev, single tenant |
| VPS / EC2 box | Yes, if always-on | Persistent disk | Shared kernel (VM from host) | Pay 24/7 | One box, you shard | Few long-lived agents |
| Ephemeral sandbox (E2B, Daytona, Modal) | No (task-scoped) | Snapshot or gone | microVM or gVisor | Per-second while up | Hundreds+ | Bursty one-off tasks |
| Persistent VM (OpenComputer) | Yes | Kept, always-on | Real KVM VM, own kernel | Pay only while running | Thousands | Long-lived, idle-heavy agents |

Each column comes down to one of these questions:

- **Does the agent survive a disconnect?** An agent that dies when the WebSocket drops or the box redeploys loses whatever it was doing.
- **What happens to state between turns?** The SDK writes transcripts to local disk, so if that disk is gone next turn the agent starts from nothing.
- **How do you handle the credentials the agent needs?** The Bash tool runs generated code with whatever secrets are in its environment.
- **How isolated is the host when the agent runs generated code?** A shared-kernel container contains a bad command less than a real VM does.
- **What does it cost while the agent idles?** An agent blocked on a human approval or a slow API is still a running process, and billing that meters uptime charges for that wait.
- **How do you run many at once?** One session is one subprocess, so a hundred users means a hundred subprocesses that all have to live somewhere.

Placement interacts with isolation and credential design more than the other questions do, and OpenComputer's writeup on [where the agent should live](https://opencomputer.dev/blog/where-should-the-agent-live) works through those tradeoffs together.

## Where can you run a Claude Agent SDK agent?

You have five options, ordered here by how much of the operating work the platform absorbs. Each one covers a different subset of the six questions.

### When is running it locally the right call?

Running locally is the right call while you are building and iterating, with one person watching the run. The agent edits real files and feedback is instant, so nothing sits between the run and the result.

Transcripts land in `~/.claude/projects/`, keyed by working directory, which is why `resume` picks up full context on the next run. That makes the laptop the best fit for the build-and-iterate loop.

Running it for anyone other than you breaks the setup, because generated code runs with your credentials on your real filesystem. Nothing survives the laptop closing, and one machine serves exactly one user.

### Is a Docker container on your own machine enough?

It is enough when the agent is single-tenant, say a side project where the box and the blast radius both belong to you. A [Docker container](https://code.claude.com/docs/en/agent-sdk/secure-deployment#containers) gives you a reproducible environment with process isolation and an ephemeral filesystem, and Anthropic's hosting cookbook ships a deployable Dockerfile for it.

Mounting the project and dropping Linux capabilities already runs the agent with far less risk than bare on the host. Anthropic's hardened recipe goes further and adds:

- `--cap-drop ALL`
- `--read-only`
- a `tmpfs` workspace
- `--network none`, with a Unix socket to a proxy that injects credentials

The agent makes the call and the proxy adds the token, so the agent "never sees the credential itself." That means a prompt-injected agent has nothing to steal.

The container's limits are isolation strength and scale. It shares the host kernel, which OpenComputer's [sandbox fingerprinting writeup](https://opencomputer.dev/blog/sandbox-fingerprinting) compares against microVMs and hypervisors, so a kernel exploit in generated code reaches the host instead of staying contained.

Persistence is not built in either, so transcripts need a `SessionStore` adapter and the rest needs a mounted volume. If you are building a multi-tenant product, per-tenant container cost and shared-kernel exposure are the two things the container model does not remove.

### What about a plain VPS or EC2 box?

A rented box fits one or a few long-lived agents you operate by hand, where always-on matters more than elastic scale. A VPS or an EC2 instance keeps the agent up between turns and through a client disconnect.

The box has a persistent disk, so session transcripts and working files are still there tomorrow. You install the runtime and run the SDK as a long-lived process, and it keeps its state as long as the box stays up.

The tradeoff is that the box bills around the clock whether the agent works or idles, and an agent that waits on human approvals spends most of its wall-clock time idle. Isolation stays shared-kernel between tenants unless each one gets its own VM, and scaling past one box means you build the routing and per-tenant separation by hand.

### When do ephemeral sandbox providers win?

They win when the work is bursty and one-off, the kind of task that starts fast and runs to completion. Per-second billing and high concurrency suit that shape, and this tier is also where GPU work lands.

Each provider gives you a fresh isolated environment per task through an API and destroys it when the task is done. This is Anthropic's [ephemeral session pattern](https://code.claude.com/docs/en/agent-sdk/hosting#ephemeral-sessions), which spins up a container per user task with a one-shot entrypoint and tears it down at the end.

For a bug-fix or document-extraction job that fires and exits, the fit is clean and concurrency is high. Three providers are worth knowing:

- **E2B** runs each sandbox in a [Firecracker microVM](https://e2b.dev/), which is kernel-level isolation rather than a shared-kernel container.
- **Daytona** is built for speed and advertises sub-90ms cold starts.
- **Modal** puts GPUs in the box with no quota dance.

On E2B, the Hobby tier is free with a $100 credit but caps sessions at one hour. Pro is $150/mo and lifts the cap to 24 hours, with concurrency starting at 100 sandboxes and expandable to 1,100.

![E2B pricing showing 1-hour and 24-hour session limits](/guides/assets/claude-agent-sdk-sandbox/pricing-e2b.png)

The catch on E2B for long-lived work is that session ceiling, plus CPU and RAM being [fixed at template-build time](https://e2b.dev/docs/sandbox-template/customize-cpu-ram) rather than resizable on a running sandbox. To change size you rebuild the template and launch a new sandbox.

Daytona bills per second on usage and starts you with a $200 free credit. Its default sandbox is a container sharing the host kernel, so Kata is the opt-in if you want stronger isolation.

Modal's sandbox tier runs on gVisor, a userspace kernel that is strong isolation but not a full VM, and its sandbox rate is higher than base compute at roughly $0.142 per core-hour and $0.024 per GiB-hour. An H100 comes in near $3.95/hour.

All three share the same weak spot, which is that they are built to run a task and stop. Persistence and idle cost both follow from that.

E2B can pause and resume a sandbox, saving filesystem and memory, but that is a bolt-on to an ephemeral model rather than a machine that stays alive. So an agent idle for an hour waiting on a human is either paying for a running sandbox or managing a pause and resume dance.

OpenComputer's writeup on [treating sandboxes as pets rather than cattle](https://opencomputer.dev/blog/stop-treating-sandboxes-as-cattle) argues this is the wrong model for an agent that must stay alive.

### Where do persistent agent VMs fit?

A persistent agent VM is a real virtual machine, with its own OS and kernel, that stays up across turns and hibernates instead of being destroyed. It fits an agent that needs all of this at once:

- surviving disconnects
- idling for long stretches waiting on humans or APIs
- running untrusted generated code
- scaling to many concurrent instances without dedicated server operations

OpenComputer is one example. Each agent gets a [real KVM virtual machine with its own kernel](https://opencomputer.dev/blog/sandbox-fingerprinting) and hardware-level isolation, a stronger boundary than a shared-kernel container or gVisor.

When the Bash tool runs generated code, an exploit is contained to that VM rather than reaching a shared host kernel. That closes the isolation question the container left open.

Persistence maps back to the SDK's own problem, because the subprocess writes transcripts and working files to local disk that dies with the container by default. An always-on VM sidesteps that, so the state is there next turn and you skip every workaround:

- no `SessionStore` adapter
- no volume sync
- no cold rebuild

VMs "stay on until you explicitly stop or delete them," and you can [hibernate and wake to the exact state](https://opencomputer.dev/) in one to two seconds.

That hibernation changes the idle math, because OpenComputer bills "pay only while running" and hibernation stops the compute clock. While a VM sleeps, only disk above the included 20GB is metered, at $0.0000001 per GB-second.

The flat rate is $0.004/min, or $0.24/hour for the 4GB/1vCPU default, with RAM adjustable from 1 to 16GB. OpenComputer also lets you [resize memory and CPU on a running VM](https://opencomputer.dev/) without a restart, so an agent that suddenly needs more room gets it mid-session, which none of the ephemeral providers here offer.

![OpenComputer homepage showing pay-only-while-running and live resize](/guides/assets/claude-agent-sdk-sandbox/pricing-opencomputer.png)

OpenComputer makes that case in its writeup on [what elastic compute means for agents](https://opencomputer.dev/blog/what-elastic-compute-means), and the platform scales to thousands of concurrent VMs. If you need a GPU, though, OpenComputer is not the one, since it is CPU-only and single-region today, so vision or training work still goes to Modal and an agent pinned inside your own AWS account still points at a self-operated container.

For a long-lived CPU-bound agent, the model lines up with how the SDK stores state. The disk the subprocess writes to stays alive, and the compute charge stops while the agent waits.

## So which one should you use?

For a single-tenant agent on hardware you own, a Docker container is the least infrastructure that adds isolation and reproducibility. Everything else exists to handle something the container does not:

- An agent that only runs while you watch it fits the **local** machine.
- A handful of always-on agents, operated by hand, fit a **VPS or EC2 box**, the least clever thing that works.
- Bursty one-off tasks at high concurrency fit an **ephemeral provider** such as E2B or Daytona, with Modal covering the GPU case.
- A long-lived agent that idles a lot and runs untrusted generated code maps to a **persistent VM** such as OpenComputer, which also scales without dedicated servers. That one choice settles the disconnect and idle-cost questions, and it upgrades isolation to a real VM at the same time.

The SDK is deliberately silent on all of this. It ships the agent loop and the tools, and the computer underneath is a separate decision that turns on which of the six questions your workload hits first.

## FAQ

### Does the Claude Agent SDK come with a sandbox?

It ships a sandboxed Bash tool you enable with `/sandbox`, which uses Seatbelt on macOS and bubblewrap on Linux to restrict the filesystem and network access of Bash commands. It does not sandbox the whole agent, though, and everything outside Bash still runs on the host:

- the built-in file tools
- MCP servers
- hooks

The sandbox also shares the host kernel, which is why Anthropic says it is not sufficient for fully unattended runs. For those, wrap the whole process in a container or VM.

### Can I run the Claude Agent SDK in Docker?

Yes, and it is the path Anthropic's docs describe for a single-tenant agent. Anthropic's hosting cookbook ships a deployable Dockerfile, and the recipe runs the SDK inside a container with:

- the project mounted
- Linux capabilities dropped
- outbound traffic routed through a proxy that injects credentials, so the agent never sees them

Docker leaves two things unsolved. Persistence across restarts needs a `SessionStore` adapter and a volume, and kernel-level isolation is out of reach because a container shares the host kernel.

### What happens to agent state between turns?

The SDK writes session transcripts to local disk, under `~/.claude/projects/` keyed by working directory. By default they do not survive:

- a container restart
- a scale-down
- a move to another node

To resume on a different host, you move the transcript file to the matching path or mirror it to shared storage with a `SessionStore` adapter. Memory files and working-directory artifacts need their own volume, while an always-on VM avoids the problem by keeping the disk alive.

### How do I keep the agent from seeing my credentials?

Run a proxy outside the agent's boundary that injects credentials into outgoing requests, so the agent makes the call without ever holding the secret. Anthropic recommends this for containers using `--network none` plus a Unix socket to a host proxy, and for the Anthropic API you can set `ANTHROPIC_BASE_URL` to route sampling through a proxy that attaches the credential.

This matters most for multi-tenant deployments and agents processing untrusted content, where prompt injection could otherwise turn a credential into an exfiltration path.

### How much does it cost to run an agent while it sits idle?

The billing model decides it. Anthropic notes that token cost dominates and that a minimally provisioned container runs about $0.05/hour.

But an agent waiting on a human approval or a slow API is idle most of that wall-clock time, and a VPS or an always-running sandbox bills for the wait. Ephemeral providers bill per-second while up, where pausing stops the clock but is manual.

OpenComputer bills only while the VM runs, and it stops the compute charge when the VM hibernates.

### Which sandbox is best for running many Claude agents at once?

Short tasks and long-lived agents point at different platforms. One SDK session is one subprocess, and concurrency on a single host is bounded by how much RAM its subprocesses need, so a single box caps out quickly.

For bursty short tasks, ephemeral providers scale to hundreds of concurrent sandboxes with per-second billing. For long-lived agents that idle and must survive disconnects, a persistent-VM platform that scales to thousands and bills only running time fits better, since idle capacity is not billed and state is not rebuilt on every wake.
