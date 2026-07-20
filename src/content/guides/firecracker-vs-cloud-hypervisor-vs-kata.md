# Firecracker vs Cloud Hypervisor vs Kata Containers (vs QEMU/KVM): an architectural breakdown for AI-agent isolation

By Utpal Nadiger

If you are deciding how to isolate untrusted AI-agent code, chances are your shortlist reads Firecracker, Cloud Hypervisor, Kata Containers. One of those is not the same kind of thing as the other two.

Firecracker and Cloud Hypervisor are hypervisors: programs that use KVM to boot a real virtual machine with its own kernel. Kata Containers sits a layer above them. It is a container runtime that gives each pod its own VM by driving one of those hypervisors underneath, and [its own docs list Firecracker, Cloud Hypervisor, and QEMU as the options](https://kata-containers.github.io/kata-containers/hypervisors/).

A three-way comparison that treats them as peers cannot settle anything, because choosing Kata still leaves you with a hypervisor to choose.

We run agent sandboxes as full QEMU/KVM virtual machines in production, and both the current QEMU stack and our retired Firecracker backend are public in our repo. This piece puts the four technologies in their actual layers and explains the kernel-sharing boundary that decides between containers and VMs.

## Are Firecracker, Cloud Hypervisor, and Kata Containers the same kind of thing?

No. Firecracker, Cloud Hypervisor, and QEMU are hypervisors, also called virtual machine monitors (VMMs): userspace programs that use KVM, the virtualization module in the Linux kernel, to boot a VM with its own guest kernel.

Kata Containers is a container runtime: the component that Kubernetes or containerd calls when it wants a container created and run. Kata answers that call by booting a VM through one of those three hypervisors and running the container inside it. Here is the stack:

![The four technologies on their actual layers: Kata Containers is a container runtime that drives one of Firecracker, Cloud Hypervisor, or QEMU; each of those VMMs uses KVM in the host kernel to boot a virtual machine with its own guest kernel](/guides/assets/firecracker-vs-cloud-hypervisor-vs-kata/layer-stack.png)

[When we fingerprinted the isolation stacks of six sandbox vendors](https://opencomputer.dev/blog/sandbox-fingerprinting), the results were Docker-based containers, gVisor, Firecracker microVMs, and Cloud Hypervisor. None of the six ran Kata as their isolation layer, and none could: Kata is not an isolation layer. It is a way of reaching one from Kubernetes.

So the real decision splits into two questions: whether untrusted code keeps sharing the host's kernel or gets its own, and which hypervisor boots that kernel if it gets one.

## What each of these is

### Firecracker

Firecracker is a hypervisor in the narrow sense: a userspace virtual machine monitor that uses KVM to boot a VM with its own guest kernel. AWS built it to run Lambda, and the design assumes Lambda's workload shape: very large numbers of short-lived VMs, packed densely, each alive for seconds or minutes.

It emulates five devices in total: virtio-net, virtio-block, virtio-vsock, a serial console, and a minimal keyboard controller whose only job is stopping the microVM. [Firecracker's headline figures](https://firecracker-microvm.github.io/): user-space code starts in under 125ms, each microVM carries less than 5MiB of memory overhead, and a host can create up to 150 microVMs per second. The codebase is roughly 50,000 lines of Rust.

### Cloud Hypervisor

Cloud Hypervisor is a VMM at the same layer as Firecracker, also written in Rust, also driving KVM. The difference is the device model, meaning the set of virtual hardware a VMM offers its guests. Cloud Hypervisor keeps the server-class features Firecracker leaves out: live migration of a running VM to another host, CPU and memory hotplug, and VFIO passthrough, which hands a physical PCI device such as a GPU directly to the guest.

The workload its design assumes is longer-lived than Firecracker's: VMs that stay up, change size while running, occasionally move between hosts, and sometimes need real hardware.

### Kata Containers

Kata Containers is not a hypervisor. It is an OCI runtime, the component that Kubernetes or containerd invokes to create and run a container (OCI is the Open Container Initiative, whose runtime spec defines that interface). The default runtime, runc, starts the container as a process in namespaces on the shared host kernel. Kata instead boots a virtual machine for the pod and runs the container inside that VM, so each pod gets its own guest kernel.

The hypervisor doing the booting is chosen in Kata's configuration; [the project's docs list QEMU, Cloud Hypervisor, and Firecracker among the supported options](https://kata-containers.github.io/kata-containers/hypervisors/) and name QEMU the best supported for GPUs and confidential computing. The workload it assumes is Kubernetes-native: pod-level VM isolation without leaving the Kubernetes control plane.

### QEMU/KVM

QEMU is the hypervisor Firecracker and Cloud Hypervisor are subsets of: a complete emulated machine, close to 2 million lines of C. Run with KVM acceleration, the guest's CPU and memory execute directly on hardware, and QEMU supplies the device model around them. The q35 machine type is QEMU's model of a modern PC chipset, with PCIe, hotplug, and the full range of virtio devices.

Its design assumes any workload, and the price of that generality is a much larger codebase to trust and more operational surface to run. This is what we run in production: QEMU q35 VMs with KVM acceleration and virtio devices, the host talking to each guest over vsock, a socket channel between host and VM.

## Why does kernel sharing decide the container-vs-VM question?

The isolation decision reduces to whether untrusted code shares a kernel with anything you care about. Plenty of engineers doubt that the distinction matters, and the doubt is reasonable.

[As one commenter put it](https://news.ycombinator.com/item?id=46503334) in a thread challenging people to demonstrate a Docker sandbox escape: "If you look at the interface contract, both containers and VMs ought to be about equally secure! Nobody is an idiot for reading about the two concepts and arriving at this conclusion."

On paper the contracts do look symmetric. A container exposes the host kernel's syscall interface, narrowed by namespaces and seccomp (a kernel facility that filters which syscalls a process may make). A VM exposes a small set of virtual devices backed by the hypervisor.

The asymmetry is in what enforces each boundary. Namespaces and seccomp are software checks inside the same kernel the untrusted code is calling into, so one exploitable kernel bug removes all of them at once. The VM boundary is enforced by the CPU's virtualization hardware; code that gains root in the guest has beaten the guest kernel, and still needs a separate bug in the hypervisor or KVM to touch the host.

That difference has been tested with a live exploit. In 2026, [a kernel zero-day called Dirty Frag was run against both models](https://news.ycombinator.com/item?id=48304227). On the container side: "Test 1 - container sandbox (Docker, seccomp on, unprivileged uid=1001, host kernel 6.8.0): unprivileged user to root in under 2 seconds."

The VM side was configured with more privilege on purpose, an unpatched guest kernel, no seccomp, started as root with full capabilities, and held: "The exploit worked inside the guest, but every attempt to reach the host failed." The author's conclusion: "What matters isn't what permissions the software grants - it's whether the kernel is shared."

![Two isolation models against the same kernel zero-day: in a container, untrusted code passes namespaces and seccomp software checks into the shared host kernel where other tenants live, and Dirty Frag went from unprivileged user to root in under 2 seconds; in a VM, the exploit wins inside its own guest kernel but every attempt to cross the CPU-enforced hardware boundary to the host failed](/guides/assets/firecracker-vs-cloud-hypervisor-vs-kata/kernel-sharing-boundary.png)

This is our stated position as well. From [our docs](https://docs.opencomputer.dev/how-it-works.md): "Containers share a kernel. A kernel exploit in one container compromises every other container on the host."

gVisor sits between the two models. It is a userspace kernel, a reimplementation of the Linux syscall interface that serves the workload's syscalls itself, so untrusted code never talks to the host kernel directly. That is a real boundary without booting a VM.

Part of the agent ecosystem runs on it; [in a thread on kernel-level agent sandboxing](https://news.ycombinator.com/item?id=45415814), the consensus was that "containers are being used as a security boundary while it's well known they are not," with VMs and gVisor treated as the table stakes.

What gVisor gives up is syscall coverage. Its reimplemented kernel does not serve every Linux syscall. A team running gVisor in production described the gap in the same thread: "gVisor has implemented a lot of them, but every few months we have an application that hits an unimplemented syscall. We tend to reach for application workarounds, and haven't yet landed a PR to add a syscall."

## Where do the VMMs actually differ?

In the device model. Once you have decided on a VM boundary, Firecracker, Cloud Hypervisor, and QEMU run guests the same way at the CPU and memory level, because KVM does that part for all three. Cloud Hypervisor keeps the server-class features Firecracker deliberately leaves out: live migration, CPU/memory/PCI hotplug, and VFIO device passthrough. QEMU q35 has all of that plus the rest of a modern PC.

Whether any of it matters depends on how long your VMs live. A sandbox that runs for ninety seconds never resizes, never moves, and never idles; [Docker's post on its microVM sandboxes](https://www.docker.com/blog/why-microvms-the-architecture-behind-docker-sandboxes/) describes agent workloads as "ephemeral, session-heavy" and designs for disposability. A session that holds state for days resizes, moves, and idles, and the three VMMs differ on exactly those operations.

RAM reclamation is the first difference. Firecracker never returns guest-allocated memory to the host. [Hocus, a dev-environment company that moved from Firecracker to QEMU and published why](https://hocus.dev/blog/qemu-vs-firecracker/), stated it directly: "once a workload inside allocates RAM, Firecracker will never return it to the host system."

[Firecracker's own ballooning doc](https://github.com/firecracker-microvm/firecracker/blob/main/docs/ballooning.md) says the balloon "operates on a best effort model" and that hosts should be prepared for the process to use all the memory it was given at boot regardless of the balloon.

Cloud Hypervisor documents memory resizing and hotplug, but publishes no statement on reclaiming guest memory back to the host. QEMU has virtio-mem, a virtio device that lets the host add and remove guest memory in blocks while the VM runs. Our production launch arguments in `internal/qemu/manager.go` show the shape of it; every sandbox boots with a lazily allocated pluggable pool so it can grow to 16GB live:

```go
// Memory layout: base memory + virtio-mem pool for hotplug scaling.
// The virtio-mem backend allocates lazily (only requested-size is committed),
// but maxmem must exceed base+pool for QEMU to accept the device.
// Pool = 16GB - base, so any sandbox can scale up to 16GB total regardless of base.
virtioMemPoolMB := alignVirtioMemBlock(16384 - memMB)
...
args := []string{
	"-machine", "q35,accel=kvm",
	"-cpu", "host",
	"-m", fmt.Sprintf("%dM,slots=1,maxmem=%dM", memMB, maxMemMB),
	// virtio-mem: pluggable memory pool. Scale via QMP qom-set requested-size.
	"-object", fmt.Sprintf("memory-backend-ram,id=vmem0,size=%dM", virtioMemPoolMB),
	"-device", "virtio-mem-pci,memdev=vmem0,id=vm0,block-size=128M,requested-size=0",
```

Live migration is the second. Firecracker does not support it. [Cloud Hypervisor does](https://github.com/cloud-hypervisor/cloud-hypervisor), though not across Cloud Hypervisor versions. QEMU does.

The reason a buyer cares is economic: long-lived VMs idle and exit unevenly, hosts end up sparse, and migration consolidates workloads onto denser machines instead of paying for mostly-empty ones.

We migrate running VMs between workers over QMP, pre-copying disks to S3 first. Idle economics sit on the same management surface: our stack pauses a VM by stopping its vCPUs and paging guest memory to a host swap tier, which drops the paused VM's footprint to its compressed working set, and hibernates by saving to disk and evicting.

Hotplug is the third difference. Cloud Hypervisor supports CPU, memory, and PCI hotplug. Firecracker shipped without any; [its main-branch README](https://github.com/firecracker-microvm/firecracker) now documents memory hotplugging as configurable and PCI device hotplug as a Developer Preview. QEMU q35 has full PCIe hotplug plus virtio-mem.

The management API is the last difference. Firecracker exposes a per-microVM RESTful HTTP API over a unix socket, covering machine config, devices, rate limiters, and the Pause/Resume/CreateSnapshot/LoadSnapshot lifecycle. Cloud Hypervisor exposes its own HTTP API. QEMU is driven over QMP, a JSON protocol on a control socket; the memory resizing, migration, and pause operations above are all QMP commands in our code.

| Axis | Firecracker | Cloud Hypervisor | QEMU q35 |
|---|---|---|---|
| RAM reclamation | No | No | Yes (virtio-mem) |
| Live migration | No | Yes, not across versions | Yes |
| CPU/memory/PCI hotplug | Memory only; PCI in preview | Yes | Yes |
| Snapshot / restore | Yes | Yes, not across versions | Yes |
| Management API | HTTP over unix socket | HTTP over unix socket | QMP JSON socket |

## How fast does each one start in production?

A VM can start two ways. A cold boot brings up a fresh guest kernel from nothing. A snapshot restore loads a saved image of an already-booted VM's memory and device state, and that is what production platforms actually do.

Both our current QEMU backend and our retired Firecracker backend start sandboxes the second way: boot a template VM once, snapshot it, and clone that golden snapshot for every new sandbox.

On snapshot starts, Firecracker restores in 5-30 milliseconds and our full QEMU q35 VMs boot from golden snapshots in [about 300 milliseconds](https://docs.opencomputer.dev/how-it-works.md). Our retired Firecracker backend did about 500. All of those sit below what a user of an agent platform ever notices.

| What | Figure |
|---|---|
| Firecracker cold boot | [<125ms to user-space code](https://firecracker-microvm.github.io/) |
| Firecracker memory overhead | <5MiB per microVM |
| Firecracker creation rate | Up to 150 microVMs/s per host |
| Firecracker snapshot restore | 5-30ms |
| Cloud Hypervisor cold boot | [~100ms](https://github.com/cloud-hypervisor/cloud-hypervisor/blob/main/docs/performance_metrics.md) |
| Cloud Hypervisor snapshot restore | No published figure |
| QEMU q35 golden-snapshot boot | [~300ms](https://docs.opencomputer.dev/how-it-works.md) |

So boot latency is not a reason to pick a VMM in 2026. Started from snapshots, all three start inside half a second of each other, and what separates them is the RAM reclamation, migration, and hotplug differences from the previous section.

## Why do we run full QEMU instead?

Our sandboxes are full QEMU/KVM q35 VMs, not Firecracker or Cloud Hypervisor. Sessions that hold state for days need elastic memory, live migration, and cheap idling, and QEMU is the only one of the three with all of them.

We ran a Firecracker backend before this one, and the QEMU stack does three things it could not:

- It resizes memory live with virtio-mem, so any sandbox grows to 16GB while the host commits only the requested pages.
- It live-migrates running VMs between workers over QMP.
- It pages an idle VM's memory to a swap tier on pause, so a paused sandbox costs its compressed working set rather than its full allocation.

None of that is in Firecracker's design, and its exclusions are deliberate, shaped for Lambda's seconds-long functions. [As Hocus put it](https://hocus.dev/blog/qemu-vs-firecracker/), "Your VM will run for hours, days, or even months without stopping, unlike the typical Firecracker VM, which runs for seconds or minutes." Agent sessions that hold state for days are the first kind of workload, and persistent full VMs are the product we ship.

On top of that isolation layer, our [sessions API](https://docs.opencomputer.dev/agent-sessions/overview) splits the agent loop (brain) from files-and-commands execution (hands): untrusted work stays in the hands sandbox, and model keys live in a secret store that never enters any sandbox. The agent itself runs inside the isolated environment, [a placement we argued for earlier](https://opencomputer.dev/blog/where-should-the-agent-live), on the condition that the sandbox is treated as untrusted and durable credentials stay outside it.

Running full QEMU has real costs. The device model is far more code to operate than either Rust VMM, and KVM needs hardware virtualization, so workers must be bare-metal or nested-virt-capable instances; this stack does not run on ordinary cloud VMs. The QEMU layer itself is cloud-neutral, with no cloud SDK imports; we run production cells on Azure and keep a complete AWS implementation ready.

If your workload is disposable, short-lived, high-density code execution, none of these costs are worth paying. That workload is what Firecracker was built for, it wins there, and you should use Firecracker.

## Which one should you pick?

For agent sessions that hold state, pick a full hypervisor, Cloud Hypervisor or QEMU q35, because in a persistent-session pattern the cold start is paid once, boot speed drops out, and the durability features (elastic memory, live migration, pause) decide everything. That is the workload we run, and it is why we run QEMU.

Other workload shapes have different answers:

| Workload shape | Pick | Why | What you give up |
|---|---|---|---|
| Disposable, short-lived, high-density code execution | Firecracker | Its design target: <5MiB overhead, up to 150 microVMs/s per host | RAM reclamation, live migration, GPUs today |
| Kubernetes-native pod isolation | Kata Containers driving your chosen VMM | Neither Firecracker nor Cloud Hypervisor integrates with Kubernetes directly; Kata is the orchestration layer | An extra layer to operate, and the hypervisor decision remains |
| Long-lived durable sessions | Cloud Hypervisor or full QEMU q35 | Live migration, hotplug, elastic memory | Bare-metal or nested-virt hosts; more device model to operate |
| GPU-bound agents | Cloud Hypervisor or QEMU q35 | Both support VFIO passthrough; Firecracker does not | Direct device access weakens the hardware boundary |

### FAQ

**Are Firecracker, Cloud Hypervisor, and Kata Containers the same kind of thing?**

No. Firecracker and Cloud Hypervisor are hypervisors (virtual machine monitors) that use KVM to boot VMs with their own kernels. Kata Containers is a container runtime that gives each pod its own VM by driving one of those hypervisors, or QEMU, underneath. Comparing Kata to Firecracker compares two layers of one stack.

**Does Kata Containers replace Firecracker or run on it?**

It runs on it. Kata's configuration names a hypervisor, and Firecracker, Cloud Hypervisor, and QEMU are among the supported options. Teams that want Firecracker under Kubernetes consume it through Kata, because Firecracker has no Kubernetes integration of its own.

**Is Firecracker overkill for AI agents?**

No; if anything the question runs the other way. For multi-tenant execution of arbitrary untrusted code, VM-level isolation is the safe default, and for disposable, short-lived, high-density tasks Firecracker is exactly the tool its designers intended. For agent sessions that hold state for days, what rules it out is missing RAM reclamation, live migration, and hotplug, not too much isolation.

**Is gVisor enough instead of a VM?**

gVisor puts a reimplemented userspace kernel between the workload and the host, which is a real boundary without booting a VM. Its operating cost is syscall coverage: teams running it report applications hitting unimplemented syscalls every few months and working around them in the application. For semi-trusted code it is widely used; for arbitrary multi-tenant code, a VM boundary is the safer default.

**Can code that gets root inside the sandbox reach the host?**

Not through the kernel it rooted, if the sandbox is a VM. In the Dirty Frag test, the microVM ran as root with no seccomp and an unpatched guest kernel, the exploit succeeded inside the guest, and every attempt to reach the host failed, while a hardened container on a shared kernel fell to the same exploit in under 2 seconds.

Root inside a guest is contained by the hardware boundary, and only a separate hypervisor or KVM bug crosses it. Root inside a container is root against the kernel your other tenants are running on.
