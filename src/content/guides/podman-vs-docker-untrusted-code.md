# Podman vs Docker for Running Untrusted Code


By Utpal Nadiger

For running untrusted, agent-generated code, picking Docker or Podman changes almost nothing. Both are shared-kernel containers, so a kernel exploit escapes either one and neither is a security boundary on its own.

What decides whether hostile code stays contained is where the isolation boundary sits. This piece walks through the options in order, from a plain container up to a VM with its own kernel, with the CVEs that show containers failing in practice.

## How do Docker and Podman differ for running untrusted code?

They differ in one place, the daemon, and for untrusted code the daemon is close to irrelevant. Both drive the same OCI runtime underneath, so a runtime escape works the same whichever one launched the container.

### What is the real difference between Docker and Podman?

Docker runs a long-lived root daemon. Podman runs each container as a direct child process with no daemon at all, and that is the whole architectural difference between them.

Docker's `dockerd` is a background service that traditionally runs as root, and the `docker` CLI talks to it so the daemon can spawn the container. [Podman is daemonless](https://docs.podman.io/en/latest/markdown/podman.1.html), which means `podman run` forks and execs the container as a child of your shell session, monitored by a small `conmon` process and using the same OCI runtime (`runc` or `crun`) Docker uses.

For untrusted code, the fork-exec model gives you two advantages. There is no shared root daemon for a compromise to pivot through, and actions show up in the audit log under your user instead of under `dockerd`.

Neither advantage decides whether adversarial code stays contained.

| | Docker | Podman |
|---|---|---|
| Runtime model | Root daemon (`dockerd`) | Daemonless fork-exec + `conmon` |
| Rootless support | Yes, added later | Yes, designed rootless-first |
| OCI runtime | `runc` (default) | `crun` or `runc` |
| Container escape lands you as | Host root (rootful) or unprivileged user (rootless) | Same |
| Shares the host kernel | Yes | Yes |

The last row is the one that matters for untrusted code, and it reads the same for both.

### Does rootless mode make it safe to run untrusted code?

Rootless mode makes a container escape much less catastrophic, but it does not make untrusted code safe to run. It changes what privileges escaped code lands with, not whether the escape is possible.

Rootless means the container runs under a normal, unprivileged host user, which works through [user namespaces](https://docs.docker.com/engine/security/rootless/). UID 0 inside the container maps to some ordinary UID on the host, drawn from the ranges in `/etc/subuid` and `/etc/subgid`.

Podman was built this way from the start. Docker's rootless mode arrived later and lets you run "the Docker daemon and containers as a non-root user."

If the code inside escapes the container through a runtime bug, it lands as that unprivileged user instead of host root, so it cannot immediately read every other tenant's files or reconfigure the host. That is a large reduction in blast radius, and for semi-trusted workloads it can be enough on its own.

Rootless Docker also drops features, and its own [known limitations](https://docs.docker.com/engine/security/rootless/troubleshoot/#known-limitations) page lists the ones that matter for untrusted code:

- AppArmor is not supported, which removes one of the mandatory-access-control layers you would use to harden an untrusted container
- checkpoint and overlay networking are not supported either
- cgroup resource limits work only under cgroup v2 with systemd
- binding ports below 1024 needs extra setup

Podman's rootless-first design tends to have fewer of these gaps. That is a point in its favor.

Rootless does not touch the kernel. The escaped process still talks to the same Linux kernel as every other process on the host, and reducing the privileges it starts with does not change the attack surface it can reach through that kernel.

### Where do rootless and daemonless both stop helping?

Rootless and daemonless both stop helping at the kernel. A container is a process on the host kernel, so a kernel exploit is a full host compromise no matter which runtime launched it.

A container is not a small machine. It is one or more normal Linux processes with three things wrapped around them:

- namespaces, which give the processes a private view of things like PIDs and mount points
- cgroups, which cap the resources they can consume
- a seccomp filter, plus an optional AppArmor or SELinux policy, which limits the syscalls they can make

All of that is enforced by one host kernel, and the untrusted code calls straight into it.

The shared-kernel problem is older than Docker, and Unix has been narrowing a process's view of the machine for decades:

- chroot in 1979, which gave a process a private view of the filesystem and little else, with escape techniques surfacing for years afterward
- FreeBSD jails in 2000, which hardened the chroot idea into real confinement
- Solaris Zones in 2004, which did the same on Solaris

Every one of those designs still ran on one shared kernel. That kernel is what the standard caution "containers are not a security boundary" refers to.

That boundary has failed in public more than once, and the same failures hit Docker and Podman alike:

- [CVE-2019-5736](https://nvd.nist.gov/vuln/detail/CVE-2019-5736) (CVSS 8.6), disclosed in February 2019, was a flaw in `runc` that let code inside a container overwrite the host `runc` binary through `/proc/self/exe` and gain host root, and both Docker and Podman used the affected `runc`
- [CVE-2024-21626](https://nvd.nist.gov/vuln/detail/CVE-2024-21626) (CVSS 8.6), one of the "Leaky Vessels" bugs, was a file-descriptor leak in `runc` 1.1.11 and earlier that allowed a container escape to the host filesystem, fixed in 1.1.12
- [CVE-2022-0847](https://nvd.nist.gov/vuln/detail/CVE-2022-0847) (CVSS 7.8), "Dirty Pipe", was a bug in the kernel's own pipe handling on 5.8 through 5.16.x that let an unprivileged local user overwrite read-only files and escalate, so every shared-kernel container on a vulnerable host was exposed regardless of runtime

![CVE-2024-21626 runc container escape on NVD](/guides/assets/podman-vs-docker-untrusted-code/cve-2024-21626-nvd.png)

The first two are runtime bugs, so a patched runtime fixes them. The third is a kernel bug, and no runtime patch helps, because the Linux kernel is millions of lines of C reachable through hundreds of syscalls.

Seccomp trims that surface but cannot remove it, so a single memory-safety bug in a reachable path is a host compromise. Rootless raises the cost of a pivot after an escape and daemonless removes the shared daemon, but neither reduces the kernel's attack surface.

The shared kernel is an acceptable risk for some of what you run:

- first-party code you wrote
- dependencies you trust
- CI jobs
- semi-trusted tenants under contract

For that bucket, a rootless container with a tight seccomp profile and an AppArmor policy is a reasonable boundary, and a VM would be overkill. That boundary stops being enough for arbitrary adversarial code with a motive to escape. Code an AI agent generated on an open-ended task is in that category, because you cannot predict what it will attempt.

## What does each isolation tier buy you?

Each isolation tier puts more distance between untrusted code and the host kernel, and costs more to run. From weakest boundary to strongest:

| Isolation tier | What runs the workload | Host kernel exposure | Main cost |
|---|---|---|---|
| Plain container | Process + namespaces + cgroups | Full host kernel, all reachable syscalls | None, but weakest boundary |
| Hardened container | Above + tight seccomp, AppArmor/SELinux | Reduced syscall surface, same kernel | Policy tuning; breaks some workloads |
| gVisor | User-space kernel intercepts syscalls | Sentry mediates; small host surface | Syscall and I/O performance |
| microVM (Firecracker, Kata) | Guest kernel in a KVM VM | Hypervisor boundary, not host kernel | Boot time, memory per VM |
| Full VM (KVM, own kernel) | Complete guest OS and kernel | Hardware-virtualized, no shared kernel | Highest overhead, slowest to start |

The first two tiers are the same shared kernel with the syscall surface progressively narrowed. That is real defense in depth and worth doing, but a hardened container is still one kernel bug away from an escape. The threat model changes when the workload leaves the shared kernel, which starts at gVisor and ends at a full VM.

### How does gVisor isolate untrusted code, and what does it cost?

[gVisor](https://gvisor.dev/docs/architecture_guide/security/) puts a user-space kernel called the Sentry between the container and the host, so no application syscall is passed straight through. Every supported call has its own implementation inside the Sentry, and the Sentry itself is allowed only a narrow set of interactions with the host kernel.

That means untrusted code is attacking the Sentry rather than the full host syscall table, which is a smaller target.

Syscalls cross [extra layers of software](https://gvisor.dev/docs/architecture_guide/performance/), so workloads that make many syscalls pay a measurable penalty. Heavy filesystem and network work falls in that category, and static web serving and small-operation Redis are poor fits. CPU-bound work like TensorFlow sees minimal overhead, because gVisor does not interfere with raw instruction execution.

### What is a microVM, and why is it faster than a VM?

A microVM runs the workload inside a real KVM virtual machine with its own guest kernel, but strips the virtual hardware down to almost nothing so it boots like a container. [Firecracker](https://github.com/firecracker-microvm/firecracker/blob/main/SPECIFICATION.md) is the clearest example. It holds VM-manager memory overhead to 5 MiB or less per microVM, boots to the guest's `/sbin/init` in 125 ms or less, and runs each microVM behind a jailer that drops privileges and applies seccomp.

[Kata Containers](https://katacontainers.io/) does the same for OCI and Kubernetes workloads, giving each container or pod its own lightweight VM and kernel. It can use Firecracker or QEMU underneath.

Untrusted code is now talking to a guest kernel, not the host's. To reach the host it has to break out of the guest and then defeat the hardware-enforced KVM boundary, so a guest-kernel bug like Dirty Pipe compromises the guest and not the host.

Versus a container, you pay some boot time and some memory per VM. Modern microVMs keep both small.

### When do you want a full VM with its own kernel?

A full VM is the top tier, a complete guest OS with its own kernel on a hardware-virtualized KVM boundary. There is no shared kernel to exploit, so a kernel-level escape inside the VM stays inside the VM.

OpenComputer's [breakdown of sandbox vendors](https://opencomputer.dev/blog/sandbox-fingerprinting) puts this tier at the top of the stack, above containers and microVMs. It is the tier that matches open-ended agent workloads.

[OpenComputer](https://opencomputer.dev) sits on this tier. Every sandbox is a real KVM VM with its own kernel and hardware-level isolation, not a shared-kernel container.

The default box is 4 GB and 1 vCPU, and you can resize CPU and RAM on a running VM without restarting it. The VM stays always on, using hibernate-and-wake rather than pause-resume, so your agent's session and state survive idle time.

It is open source at `github.com/diggerhq/opencomputer`, so you can self-host it. Pricing is flat at $0.004 per minute, or $0.24 an hour.

Once each agent has its own VM, where that VM should run and where its credentials should sit become design questions of their own, which [where the agent actually lives](https://opencomputer.dev/blog/where-should-the-agent-live) works through.

A full VM is the heaviest tier, slower to start and using more memory than a container or a microVM, and it has the strongest isolation of the five. OpenComputer today has no GPUs and is hosted in a single region, so it does not fit GPU inference or agents that must live inside a particular cloud account. For the ordinary run-code-and-browse work agents do, a full VM that hibernates and wakes covers it.

## Which should you use for untrusted code?

Untrusted code belongs in a VM with its own kernel. The Podman-versus-Docker choice is secondary, because neither changes what a kernel exploit does. The tier to pick follows your threat model:

- For semi-trusted code, a rootless container with seccomp and an AppArmor profile is fine, and here Podman's daemonless, rootless-first design is the cleaner pick over Docker.
- For multi-tenant code that is mostly trusted but needs a real second layer, gVisor or a microVM fits. gVisor costs I/O performance and a microVM costs a little boot time and memory.
- For arbitrary adversarial code, including open-ended AI-agent output, a microVM or a full VM with its own kernel is the answer, because a kernel bug inside the box is not a host compromise.

Isolation is not the only reason to give each agent its own VM. An always-on VM also keeps the agent's credentials and state in one place instead of spread across ephemeral sandboxes, which [OpenComputer argues at length](https://opencomputer.dev/blog/stop-treating-sandboxes-as-cattle).

![OpenComputer pricing and isolation model](/guides/assets/podman-vs-docker-untrusted-code/pricing-opencomputer.png)

## FAQ

### Is Podman more secure than Docker?

Podman has a smaller default attack surface because it is daemonless and was designed rootless-first, so there is no long-lived root daemon to pivot through and container actions show up in the audit log under your user. That is a real edge over rootful Docker.

Rootless Docker narrows that edge. Against untrusted code neither is a strong boundary, because both are shared-kernel containers using the same `runc` or `crun` runtime.

### Can I safely run untrusted code in a Docker container?

For semi-trusted code, yes, if you run it rootless with a tight seccomp profile and an AppArmor or SELinux policy. For adversarial code, a container is not a sufficient boundary on its own, because the code shares the host kernel and a single kernel exploit escapes any container.

Published `runc` escapes like CVE-2019-5736 and CVE-2024-21626 show the runtime failing in practice, and the Dirty Pipe kernel bug shows the kernel itself failing. Adversarial code belongs in a microVM or a VM with its own kernel.

### What is the difference between a container and a VM?

A container is a set of host processes running against the single shared host kernel, which isolates them with:

- namespaces
- cgroups
- a seccomp filter

A VM runs a complete guest operating system with its own kernel on top of a hypervisor, isolated by hardware virtualization. The practical consequence for untrusted code is that a kernel-level exploit escapes a container to the host but stays trapped inside a VM, because the VM is not sharing the host's kernel.

### Does gVisor make containers as safe as VMs?

Not quite, but it gets most of the way there at a lower cost. gVisor intercepts syscalls in a user-space kernel so untrusted code never calls the host kernel directly, which is a large isolation gain over a plain container.

It stops short of a VM's hardware-enforced boundary and does not defend against hardware side channels, and it costs performance on syscall-heavy work, which includes filesystem and network I/O. It is a strong middle option between a hardened container and a microVM.

### Do rootless containers protect against a kernel exploit?

No, because rootless mode changes privileges and not the kernel. Container root maps to an unprivileged host user, so an escape lands you as that user instead of host root, which meaningfully reduces the blast radius.

A kernel exploit reachable from inside the container still runs against the host kernel whether the container is rootless or not. That is why rootless is a mitigation and not a boundary for untrusted code.
