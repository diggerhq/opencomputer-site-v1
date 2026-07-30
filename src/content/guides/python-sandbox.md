# Python Sandbox: Every Approach, Honestly Ranked


By Utpal Nadiger

You have to run Python you did not write and cannot fully read, and the obvious fixes fail. It might come from an AI agent, or from a user pasting into a formula field or a code interpreter.

Either way it has to run without reading your secrets or taking over the machine. Emptying the builtins stops nothing, and a container still shares the host kernel with the code trying to escape it.

This piece ranks every real approach, from the ones that contain nothing to the ones that hold a hostile program. Each one maps to the threat model it fits.

## What is a Python sandbox, and which approach do you need?

A Python sandbox is an isolation boundary around code you did not write, and your threat model sets how strong it needs to be. Build for the worst input you will realistically get, then pick the weakest boundary that still contains it.

### What is a Python sandbox?

A Python sandbox is an execution environment that runs Python while stopping it from reaching anything outside a boundary you control. That boundary is what holds the code back from:

- the host filesystem
- other processes
- the network
- the secrets in memory

The strength of a sandbox is set entirely by where that boundary sits. In-language tricks put it inside the Python interpreter, where the interpreter's own introspection can walk around it.

Real sandboxes put the boundary at the operating system or the hardware, where Python cannot reach.

The strength you need depends on your threat model. "Untrusted code" runs from a formula written by a bored user probing for fun all the way to code written by an adversary who has read the CPython source and knows how to escape a restricted namespace.

The rest of this piece assumes the harder end. If you build for the adversary you are also safe against the bored user, and the reverse is not true.

### Which approach do I need?

The approach you need is the weakest one that still contains the worst input you will realistically get. Six are worth knowing, ranked below from the ones that stop nothing to the ones that hold hostile code.

| Approach | Boundary | Stops a determined attacker? | Native code / pip installs | Network & FS control | Startup |
|---|---|---|---|---|---|
| `exec`/`eval` with restricted builtins | Inside the interpreter | No | Yes | None | Instant |
| RestrictedPython | Inside the interpreter | No (not its job) | Yes | None | Instant |
| PyPy sandbox / seccomp jails | Process syscalls | Partly, if maintained | Partial | Manual, per-syscall | Fast |
| WASM (Pyodide, wasmtime) | The WASM runtime | Yes, for pure compute | Only Emscripten-built wheels | No sockets by default | ~1s |
| Containers (Docker, gVisor) | Shared host kernel | Container yes; gVisor mostly | Yes | Full (namespaces) | ~100ms–1s |
| microVMs / full VMs | Hardware virtualization | Yes | Yes | Full | 125ms+ |

## Which Python sandboxing approaches actually work?

These six are ordered weakest to strongest. The in-process tricks fail on a stock interpreter, so the boundary only becomes real once it moves to the operating system or the hardware.

### Why can't I just restrict `exec` and `eval`?

Because Python's introspection lets any object reach back to the machinery you removed, so emptying the namespace only adds a step to the escape.

This is old ground. Python once shipped its own restricted-execution modules, `rexec` and `Bastion`, meant to run untrusted code inside the interpreter.

The core team [disabled them in Python 2.3](https://docs.python.org/2/library/rexec.html) after security researchers, the Zope crowd among them, kept finding ways out, and removed them entirely in Python 3. So you cannot safely sandbox Python from inside Python, and that still holds today.

The naive version ignores that history. You call `exec` or `eval` with an empty `__builtins__`, figuring that with `open` and `__import__` out of scope the code can't do anything dangerous.

It can, because Python's object model hands it a way back in. Every value carries a reference to its type and every type chains up to `object`, so `object.__subclasses__()` enumerates every class currently loaded in the process, including ones whose module still holds a normal set of builtins.

Here is that escape, the gadget Ned Batchelder walked through in ["Eval really is dangerous"](https://nedbatchelder.com/blog/201206/eval_really_is_dangerous.html) in 2012 and the one the pyjail CTF genre is built on. It runs on a stock CPython, and the payload never once names `import` or `open`.

```python
# The "sandbox": no builtins at all, so no open(), no __import__, no eval.
SAFE = {"__builtins__": {}}

# The string a user submits. Nothing dangerous is named anywhere in it.
payload = (
    "[c for c in ().__class__.__base__.__subclasses__() "
    "if c.__name__ == 'FileLoader'][0]"
    ".__init__.__globals__['__builtins__']['__import__']('os')"
    ".system('id')"
)

eval(payload, SAFE)   # runs `id` in a shell: arbitrary command execution
```

![Terminal running the restricted-builtins escape, showing id output](/guides/assets/python-sandbox/escape-terminal.png)

Walk it left to right:

- `()` is an empty tuple
- `.__class__` is `tuple`
- `.__base__` is `object`
- `.__subclasses__()` hands back every loaded class

From there the code picks a class whose module kept a normal `__builtins__`, here `FileLoader`. It reaches through `__init__.__globals__` to grab `__import__`, then imports `os` and calls `system` on it.

The exact class name does not matter. The famous version uses `warnings.catch_warnings`, which isn't always in the list, so this payload uses another class that is.

Any class whose module kept its builtins works, and there are always several.

This is why the maintainers of RestrictedPython, the best-known tool here, state flatly that it ["is not a sandbox system or a secured environment"](https://github.com/zopefoundation/RestrictedPython).

RestrictedPython rewrites the AST to compile a restricted subset of Python, blocking name access and dunder attributes at compile time, and the Zope Foundation actively maintains it. Its real and narrow job is letting semi-trusted users write formulas or templates inside an app you control, where you want to stop accidents and casual mischief.

It was never designed to hold a hostile expression, so treating it as a security boundary against untrusted code is a misuse.

CPython is not built to run untrusted code inside its own process. Audit hooks and resource limits each close one hole, but the introspection surface is too large to close hole by hole.

So the boundary has to move out of the interpreter.

### Do PyPy's sandbox and seccomp jails work?

They move the boundary to the operating system, which is the right direction, but the catch is maintenance. You run the Python process normally, then use the kernel to deny it dangerous system calls.

A seccomp-BPF filter tells the kernel to kill or reject the process the moment it tries a syscall outside an allowlist. So even a fully escaped interpreter can't `open` a file or `connect` a socket the filter forbids.

PyPy historically shipped its own sandbox on a different mechanism. A special build ran as a subprocess whose input and output were [serialized to a pipe](https://doc.pypy.org/en/latest/sandbox.html), with an outer trusted controller deciding which operations to allow.

It is a clean design that PyPy's own docs now call unmaintained, with a rewrite in progress on the `sandbox-2` branches. So building a product on it today means reading the current state of those branches first.

Hand-rolled seccomp jails do work and run in production, but they are not a drop-in. You write and audit a syscall allowlist for a CPython process that links a lot of C, which is a broad and fiddly surface.

Get the list slightly wrong and you either break legitimate code or leave a hole. It is a real tool if you have kernel expertise and a narrow, well-understood workload, but it is not the answer for "run whatever the model generates."

### Is WASM (Pyodide) a real sandbox?

Yes, for pure computation it is one of the strongest boundaries you can get without a VM, and it is the one to reach for when the workload fits. WebAssembly runs code inside a runtime that has no ambient access to the host.

It can't touch the filesystem or open a socket unless you hand it that capability explicitly. Pyodide is CPython compiled to WASM, so Python runs entirely inside that box.

The isolation holds because it is capability-based rather than permission-based. A WASM module starts with zero host access and gets only what the embedder passes in, so there is nothing to escape to.

That is the inverse of the container model, where you start with everything and take capabilities away.

The limits are clear, and you design around them. Three matter:

- **Native extensions.** You can't just `pip install` anything. A package with C or Rust extensions has to be [built for Emscripten](https://pyodide.org/en/stable/usage/wasm-constraints.html) to load. Pyodide ships pre-built wheels for the big scientific stack, NumPy and pandas among them, and `micropip` installs pure-Python wheels straight from PyPI. An arbitrary extension module that nobody has ported will not load.
- **No real networking.** [Sockets are not available](https://pyodide.org/en/stable/usage/wasm-constraints.html), and HTTP goes through browser-style fetch with CORS restrictions. If your code needs to reach a database or any other host, WASM alone won't do it.
- **No real filesystem.** You get an in-memory virtual filesystem, not the host's, which is good for isolation and a constraint if the code expects real paths.

So Pyodide is excellent for running a model's data-analysis code or a self-contained algorithm. It is the wrong tool the moment the code needs to install an arbitrary native package or talk to the network.

### Are Docker containers enough?

Often yes, and the single caveat is that a container shares the host kernel. Docker uses Linux namespaces and cgroups to give a process its own view of the filesystem and network, plus a resource budget.

That is a strong operational boundary, and it is what code-execution products run on. Three tweaks harden it enough to stop the overwhelming majority of attacks:

- a seccomp profile
- dropped capabilities
- a read-only rootfs

Now the caveat. Every container on a host talks to the same kernel, so a kernel-level exploit in the untrusted code becomes a host compromise.

Containers are a namespace boundary, not a hardware one. For code you wrote, or from users you broadly trust, that is a fine trade.

For adversarial code, a kernel bug is enough to take the host. Docker's [isolation model](https://opencomputer.dev/blog/sandbox-fingerprinting) is a shared-kernel boundary, so running code in Docker contains everything except a kernel-level escape.

gVisor tightens that boundary. It puts a user-space kernel called the Sentry between the container and the host, and the Sentry [intercepts application syscalls and acts as the guest kernel](https://gvisor.dev/docs/) instead of passing them straight through.

That shrinks the host kernel's attack surface, which is why several managed sandbox services run on it. The cost is compatibility and per-syscall overhead, since gVisor doesn't implement every Linux syscall or `/proc` file, and some workloads hit those holes.

It is stronger than a plain container and still not a full VM.

### When do I need a microVM or full VM?

When the code is adversarial and you cannot accept a shared kernel, you want hardware virtualization, and the cost is startup time and operational weight. A VM runs its own guest kernel on virtualized hardware, so an escape has to defeat the hypervisor, a far smaller and more scrutinized boundary than the Linux syscall table.

This is the strongest isolation on the list.

Firecracker made this practical for short-lived workloads. It is a KVM-based microVM that boots a minimal guest with its own kernel, and Amazon built it for Lambda and Fargate.

It goes from the start API call to guest user-space in [as little as 125 ms and creates up to 150 microVMs per second per host](https://firecracker-microvm.github.io/), which is why the "give every execution its own VM" model is viable at all. A full traditional VM gives you the same hardware boundary with more startup cost and more to manage.

The tradeoff is the operational work of running a VM fleet:

- images
- networking
- snapshots and teardown
- billing

For an agent that runs arbitrary generated code with network access, that is the correct threat model and the operational work is worth it. For a formula evaluator, it is enormous overkill.

## Which managed sandbox service should I use?

If you would rather buy the strong tiers than build them, several services sell sandboxed execution as an API. They differ mostly on isolation depth and whether state survives.

Buying one means buying someone else's boundary, so what you are choosing between is a shared kernel or hardware. Four are worth knowing:

- **E2B** runs code in Firecracker microVMs. The [Pro tier is $150/mo](https://e2b.dev/pricing) with a 24-hour max session, and the free tier caps sessions at 1 hour. The largest sandbox is 8 vCPU / 8,192 MiB, and because CPU and RAM are fixed at template-build time you can't resize a running one. State survives through pause and resume rather than staying live.
- **Modal** offers GPUs in the same box, with H100-class hardware and no quota requests. Its isolation is gVisor, so it is a shared-kernel boundary, and sandboxes are ephemeral.
- **Daytona** optimizes for cold start, advertising sub-100ms starts. Its default is a container, so the default boundary is a shared kernel, with stronger isolation available as an opt-in.
- **OpenComputer** runs every sandbox as a [KVM VM with its own kernel](https://opencomputer.dev/blog/sandbox-fingerprinting), so the boundary is hardware rather than a shared kernel, and it is [open source](https://github.com/diggerhq/opencomputer) for self-hosting. It is priced flat at [$0.24/hr](https://opencomputer.dev) for 4GB and 1 vCPU, with RAM adjustable from 1 to 16GB and a 20GB disk. CPU and RAM resize on a running VM without a restart, and it stays always-on with no timeouts, so a sandbox can hibernate and wake to the exact state it left. It is the newest option here and runs in a single region today.

![E2B pricing page showing Pro tier at $150 per month and session limits](/guides/assets/python-sandbox/pricing-e2b.png)

For short, stateless snippets, a Firecracker-backed service like E2B or a WASM runtime is simpler and cheaper. A persistent VM is worth it when the agent is long-lived.

A coding agent that clones a repo and works across hours wants its filesystem and memory to still be there, which is what [ephemeral sandboxes make awkward](https://opencomputer.dev/blog/stop-treating-sandboxes-as-cattle).

## So which Python sandbox should I default to?

If you are running untrusted code and want one default, run it in a Firecracker-backed microVM. It gives you a hardware kernel boundary at a startup cost low enough to spin one up per execution, and E2B is the easiest way to buy that without operating a fleet.

Drop to a container only when you broadly trust the code and want the speed. Reach for WASM instead when the workload is pure computation, since it starts with zero host access and neither native extensions nor sockets are in play.

Where the default is more than the workload needs, match the approach to what you are running.

| What you're doing | Right approach |
|---|---|
| Evaluating a user-submitted formula or template | RestrictedPython or a WASM runtime, no VM needed |
| Running a model's pure-Python or NumPy/pandas computation | Pyodide / WASM |
| Executing arbitrary generated code, no network, short-lived | Container + seccomp, or a Firecracker service (E2B) |
| Agent running arbitrary code with network access | microVM / VM boundary: E2B, or a real VM |
| Long-lived agent that needs state across hours | Persistent VM (OpenComputer) |
| Need GPUs in the sandbox | Modal |

The in-process approaches are off the table for untrusted code. The escape above works on a stock interpreter, and RestrictedPython's own maintainers will tell you it isn't a security boundary.

Use those tools for accident-prevention among semi-trusted users, and move the boundary to the OS or the hardware for everything else.

OpenComputer fits the case where the session has to stay alive and hold state. It is a real VM that self-hosts and resizes while it runs, so where the [agent lives long enough to accumulate state](https://opencomputer.dev/blog/where-should-the-agent-live) it keeps its filesystem and memory across hours.

A repo you cloned and the dependencies you installed are still there when you return. If you need a GPU, OpenComputer is not the one.

## FAQ

### Can I safely run untrusted Python with `exec` and restricted builtins?

No. Emptying `__builtins__` does not remove Python's introspection, and `().__class__.__base__.__subclasses__()` walks from any object to a class whose module still holds `__import__`.

From there the code imports `os` and runs shell commands without ever naming anything dangerous. So CPython cannot sandbox untrusted code inside its own process, and the boundary has to move to the operating system or the hardware.

### Is RestrictedPython a sandbox?

Not in the security sense, and its maintainers say so directly. RestrictedPython rewrites the AST to restrict a subset of Python, which is useful for letting semi-trusted users write formulas or templates in an app you control.

It stops accidents and casual mischief, but it does not hold code written by someone actively trying to escape. For that you need OS-level or hardware-level isolation.

### Does Pyodide provide real isolation?

Yes, for pure computation Pyodide is strong isolation, because WebAssembly has no ambient access to the host and gets only the capabilities you grant. Three limits come with it:

- native-extension packages must be built for Emscripten
- sockets are not available
- there is no real filesystem

It is excellent for running data-analysis or algorithmic code, and wrong for code that needs arbitrary pip installs or network access.

### Are Docker containers secure enough for untrusted code?

For code you broadly trust, yes, especially with a seccomp profile and a read-only rootfs. The caveat is that containers share the host kernel, so a kernel-level exploit escapes the container.

For adversarial code, use a microVM or VM so an escape has to defeat the hypervisor instead of a kernel bug. gVisor sits in between by intercepting syscalls in a user-space kernel.

### What is the difference between a container and a microVM for sandboxing?

A container isolates a process with Linux namespaces and cgroups but shares the host kernel, while a microVM runs its own guest kernel on virtualized hardware. The microVM boundary is stronger because an escape must beat the hypervisor rather than exploit a shared kernel.

Firecracker made microVMs practical by booting to user-space in around 125 ms, close enough to container speed that per-execution VMs became viable.

### Which sandbox is best for an AI agent running generated code?

Use a microVM boundary, since generated code plus network access is the adversarial threat model. E2B is the common managed choice on Firecracker.

A persistent VM service like OpenComputer fits when the agent is long-lived and needs its state to survive across a session. Pick a container or WASM only when the code is short-lived and either trusted or restricted to pure computation.
