import { Link } from "react-router-dom";
import FadeIn from "@/components/FadeIn";
import SitePageLayout from "@/components/SitePageLayout";

/* ---------- Reusable components ---------- */

const Callout = ({ children }: { children: React.ReactNode }) => (
  <div className="my-8 pl-5 border-l-[3px] border-foreground/80 py-1">
    <p className="font-heading text-[19px] leading-[1.65] tracking-[-0.2px] italic text-foreground/85">
      {children}
    </p>
  </div>
);

const SpecTable = ({
  rows,
}: {
  rows: { label: string; value: string }[];
}) => (
  <div className="my-6 overflow-x-auto rounded-lg border border-border/50">
    <table className="w-full text-left text-[14px]">
      <tbody>
        {rows.map((row, i) => (
          <tr
            key={row.label}
            className={i < rows.length - 1 ? "border-b border-border/50" : ""}
          >
            <td className="px-5 py-3 font-medium w-[180px] bg-[hsl(0,0%,97%)]">
              {row.label}
            </td>
            <td className="px-5 py-3">{row.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

/* ---------- Isolation badge ---------- */
const IsolationBadge = ({
  type,
  color,
}: {
  type: string;
  color: string;
}) => (
  <span
    className={`inline-block font-mono-brand text-[11px] px-2.5 py-1 rounded-full ${color}`}
  >
    {type}
  </span>
);

/* ---------- Provider card for the visual overview ---------- */
const ProviderCard = ({
  name,
  hosting,
  cpu,
  isolation,
  isolationLevel,
  badgeColor,
}: {
  name: string;
  hosting: string;
  cpu: string;
  isolation: string;
  isolationLevel: string;
  badgeColor: string;
}) => (
  <div className="p-5 rounded-lg border border-border/50 bg-[hsl(0,0%,98%)] hover:border-foreground/20 transition-colors duration-150">
    <div className="flex items-center justify-between mb-3">
      <p className="font-heading text-[20px] tracking-[-0.3px]">{name}</p>
      <IsolationBadge type={isolationLevel} color={badgeColor} />
    </div>
    <div className="space-y-1.5 font-mono-brand text-[12px] text-muted-foreground">
      <p>
        <span className="text-foreground font-medium">Host:</span> {hosting}
      </p>
      <p>
        <span className="text-foreground font-medium">CPU:</span> {cpu}
      </p>
      <p>
        <span className="text-foreground font-medium">Isolation:</span>{" "}
        {isolation}
      </p>
    </div>
  </div>
);

const SandboxFingerprinting = () => {
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
          I Asked Opus 4.6 to Fingerprint Sandbox Vendors
        </h1>
      </FadeIn>

      <FadeIn delay={0.08}>
        <p className="font-mono-brand text-[13px] text-muted-foreground mb-3">
          Mohamed Habib &middot; March 17, 2026
        </p>
        <p className="text-[14px] leading-[1.65] text-muted-foreground italic mb-10">
          Disclaimer: All fingerprinting was performed by Claude. There may be inaccuracies &mdash; this is not intended to be a thorough or definitive audit, but rather a curiosity-driven exploration.
        </p>
      </FadeIn>

      <FadeIn delay={0.12}>
        <div className="space-y-7">
          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            I've been very curious about the types of isolation, hardware and
            machines that power all the available sandbox providers. It seems
            that there is no one solution but a series of tradeoffs which govern
            startup time, security isolation levels and general platform
            scalability. There is an excellent overview of the types of
            isolation{" "}
            <a
              href="https://github.com/restyler/awesome-sandbox"
              target="_blank"
              className="underline hover:text-muted-foreground transition-colors"
            >
              here
            </a>
            .
          </p>
          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            What I was more interested in is what the agent that launches a VM
            sees from the inside. What does it look like and what can we learn
            about the platform based on what we see inside the sandbox VM. With
            the help of claude I wrote some fingerprinting code to inspect each
            platform:{" "}
            <a
              href="https://github.com/diggerhq/sandbox-fingerprinting"
              target="_blank"
              className="underline hover:text-muted-foreground transition-colors"
            >
              github.com/diggerhq/sandbox-fingerprinting
            </a>
            . I also tried to fact check this information based on what each
            provider has made publicly available. I hope to be corrected if there
            is any incorrect information in the results. Without further ado lets
            dive into the results.
          </p>
        </div>
      </FadeIn>

      <FadeIn>
        <div className="w-12 h-px bg-border my-10" />
      </FadeIn>

      {/* ====== Executive Summary ====== */}
      <FadeIn>
        <h2 className="font-heading text-[clamp(28px,4vw,38px)] leading-[1.35] tracking-[-0.8px] mb-6">
          Executive summary
        </h2>
      </FadeIn>

      <FadeIn>
        <p className="text-[17px] leading-[1.75] tracking-[-0.1px] mb-8">
          Without going into too much of the details, here are the overview of
          where each platform is hosted, what the host machines of the sandboxes
          look like and the types of isolation provided.
        </p>
      </FadeIn>

      {/* ── Visual: Provider cards grid ── */}
      <FadeIn>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 my-8">
          <ProviderCard
            name="E2B"
            hosting="GCP"
            cpu="Intel Xeon @ 2.60GHz"
            isolation="Firecracker microVM"
            isolationLevel="Hardware (KVM)"
            badgeColor="bg-green-100 text-green-700"
          />
          <ProviderCard
            name="Daytona"
            hosting="Hetzner bare-metal"
            cpu="AMD EPYC 9254 24C/48T"
            isolation="Docker + Sysbox"
            isolationLevel="Container (cgroup v2)"
            badgeColor="bg-amber-100 text-amber-700"
          />
          <ProviderCard
            name="Modal"
            hosting="Azure"
            cpu="AMD EPYC"
            isolation="gVisor (on Azure VM)"
            isolationLevel="Kernel (syscall)"
            badgeColor="bg-blue-100 text-blue-700"
          />
          <ProviderCard
            name="Blaxel"
            hosting="AWS"
            cpu="Intel Xeon @ 2.90GHz (Ice Lake)"
            isolation="Firecracker + Unikraft"
            isolationLevel="Hardware (KVM)"
            badgeColor="bg-green-100 text-green-700"
          />
          <ProviderCard
            name="Sprites"
            hosting="Fly.io"
            cpu="AMD EPYC"
            isolation="Firecracker microVM"
            isolationLevel="Hardware (KVM)"
            badgeColor="bg-green-100 text-green-700"
          />
          <ProviderCard
            name="exe.dev"
            hosting="Latitude.sh bare-metal"
            cpu="AMD EPYC 9554P 64C"
            isolation="Cloud Hypervisor VM"
            isolationLevel="Hardware (KVM)"
            badgeColor="bg-green-100 text-green-700"
          />
        </div>
      </FadeIn>

      {/* ── Visual: Isolation spectrum ── */}
      <FadeIn>
        <div className="my-12 p-8 rounded-xl border border-border/50 bg-[hsl(0,0%,98.5%)]">
          <p className="font-mono-brand text-[11px] uppercase tracking-[0.15em] text-muted-foreground mb-6">
            Isolation spectrum
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 p-5 rounded-lg border border-dashed border-amber-400 bg-amber-50/50">
              <p className="font-mono-brand text-[12px] font-medium text-amber-700 mb-3">
                Container
              </p>
              <p className="font-mono-brand text-[11px] text-muted-foreground mb-2">
                Shared host kernel, lightweight
              </p>
              <div className="space-y-1.5">
                <p className="font-mono-brand text-[13px] font-medium">
                  Daytona{" "}
                  <span className="text-[11px] text-muted-foreground font-normal">
                    Sysbox
                  </span>
                </p>
                <p className="font-mono-brand text-[13px] font-medium">
                  Modal{" "}
                  <span className="text-[11px] text-muted-foreground font-normal">
                    gVisor
                  </span>
                </p>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <span className="font-mono-brand text-[18px] text-muted-foreground select-none hidden sm:block">
                {"\u2192"}
              </span>
            </div>
            <div className="flex-1 p-5 rounded-lg border border-dashed border-green-500 bg-green-50/50">
              <p className="font-mono-brand text-[12px] font-medium text-green-700 mb-3">
                microVM
              </p>
              <p className="font-mono-brand text-[11px] text-muted-foreground mb-2">
                KVM-backed, minimal overhead
              </p>
              <div className="space-y-1.5">
                <p className="font-mono-brand text-[13px] font-medium">
                  E2B{" "}
                  <span className="text-[11px] text-muted-foreground font-normal">
                    Firecracker
                  </span>
                </p>
                <p className="font-mono-brand text-[13px] font-medium">
                  Blaxel{" "}
                  <span className="text-[11px] text-muted-foreground font-normal">
                    Firecracker + Unikraft
                  </span>
                </p>
                <p className="font-mono-brand text-[13px] font-medium">
                  Sprites{" "}
                  <span className="text-[11px] text-muted-foreground font-normal">
                    Firecracker
                  </span>
                </p>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <span className="font-mono-brand text-[18px] text-muted-foreground select-none hidden sm:block">
                {"\u2192"}
              </span>
            </div>
            <div className="flex-1 p-5 rounded-lg border-2 border-foreground/60 bg-white">
              <p className="font-mono-brand text-[12px] font-medium text-foreground mb-3">
                Full Hypervisor
              </p>
              <p className="font-mono-brand text-[11px] text-muted-foreground mb-2">
                EC2-like, highest isolation
              </p>
              <div className="space-y-1.5">
                <p className="font-mono-brand text-[13px] font-medium">
                  exe.dev{" "}
                  <span className="text-[11px] text-muted-foreground font-normal">
                    Cloud Hypervisor
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* ====== Isolation categories ====== */}
      <FadeIn>
        <h2 className="font-heading text-[clamp(28px,4vw,38px)] leading-[1.35] tracking-[-0.8px] mb-6">
          Isolation categories
        </h2>
      </FadeIn>

      <FadeIn>
        <div className="space-y-7">
          <div>
            <h3 className="font-heading text-[22px] tracking-[-0.3px] mb-3">
              Container level isolation
            </h3>
            <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
              Both Modal and Daytona are relying on container-based isolation
              with different takes. Sysbox is a project to make containers
              behave more like VMs. gVisor adds an additional layer for
              containers so that they are not vulnerable to escape attacks to
              the host kernel. Since containers in general share the host
              kernel this is important to offer an additional level of
              isolation when running fully untrusted code. The advantage of
              container isolation is that it is super lightweight and already
              widely used from the k8s world.
            </p>
          </div>

          <div>
            <h3 className="font-heading text-[22px] tracking-[-0.3px] mb-3">
              microVM level isolation
            </h3>
            <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
              Firecracker seems to be a common choice amongst providers and
              wisely so. It is a battle tested solution already powering
              projects like AWS Lambda. E2B, Blaxel and Sprites are relying on
              this tech. Of interest it seems that Blaxel is layering unikernels
              on top of Firecracker VMs, which makes me curious on the reason
              behind that. Perhaps it is to further reduce the startup time of
              the sandbox providers.
            </p>
          </div>

          <div>
            <h3 className="font-heading text-[22px] tracking-[-0.3px] mb-3">
              Hypervisor isolation
            </h3>
            <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
              Offering a full hypervisor means the sandboxes offer highest
              level of isolation and matching EC2-like behaviour. But it comes
              with its own penalties of course around startup time and memory
              overhead for the platform host machine. Only{" "}
              <a
                href="https://exe.dev"
                target="_blank"
                className="underline hover:text-muted-foreground transition-colors"
              >
                exe.dev
              </a>{" "}
              seems to be taking this path so far, relying on Cloud Hypervisors
              for their platform. Excited to see more platforms based on
              hypervisors.
            </p>
          </div>
        </div>
      </FadeIn>

      <FadeIn>
        <Callout>
          There is no one-size-fits-all. The choice between container, microVM,
          and full hypervisor isolation is a tradeoff between startup time,
          security guarantees, and platform complexity.
        </Callout>
      </FadeIn>

      <FadeIn>
        <div className="w-12 h-px bg-border my-10" />
      </FadeIn>

      {/* ====== Detailed fingerprints ====== */}
      <FadeIn>
        <h2 className="font-heading text-[clamp(28px,4vw,38px)] leading-[1.35] tracking-[-0.8px] mb-6">
          Detailed fingerprints
        </h2>
        <p className="text-[17px] leading-[1.75] tracking-[-0.1px] mb-8">
          In case you are curious about more of the details here are some more
          detailed fingerprint reports from each platform. Since I was testing
          it from SF the region mentioned is likely based on proximity to my
          location.
        </p>
      </FadeIn>

      {/* ── E2B ── */}
      <FadeIn>
        <div className="my-10">
          <div className="flex items-center gap-3 mb-4">
            <h3 className="font-heading text-[26px] tracking-[-0.3px]">E2B</h3>
            <IsolationBadge
              type="Firecracker"
              color="bg-green-100 text-green-700"
            />
          </div>
          <p className="font-mono-brand text-[11px] uppercase tracking-[0.15em] text-muted-foreground mb-3">
            Infrastructure
          </p>
          <SpecTable
            rows={[
              { label: "Hypervisor", value: "Firecracker (confirmed by ACPI OEM ID FIRECK)" },
              { label: "KVM backend", value: "Yes" },
              { label: "Host CPU", value: "Intel Xeon @ 2.60GHz (Cascade Lake/Ice Lake, AVX-512)" },
              { label: "Hosting", value: "Google Cloud Platform" },
              { label: "ASN", value: "AS396982 Google LLC" },
              { label: "Location", value: "The Dalles, Oregon" },
            ]}
          />
          <p className="font-mono-brand text-[11px] uppercase tracking-[0.15em] text-muted-foreground mb-3 mt-6">
            VM Specs
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "2", sub: "vCPUs" },
              { label: "482 MiB", sub: "RAM" },
              { label: "22.9 GiB", sub: "disk (ext4)" },
              { label: "None", sub: "swap" },
            ].map((s) => (
              <div
                key={s.sub}
                className="p-4 rounded-lg border border-border/50 bg-white text-center"
              >
                <p className="font-heading text-[20px] tracking-[-0.3px]">
                  {s.label}
                </p>
                <p className="font-mono-brand text-[11px] text-muted-foreground mt-1">
                  {s.sub}
                </p>
              </div>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* ── Daytona ── */}
      <FadeIn>
        <div className="my-10">
          <div className="flex items-center gap-3 mb-4">
            <h3 className="font-heading text-[26px] tracking-[-0.3px]">
              Daytona
            </h3>
            <IsolationBadge
              type="Docker + Sysbox"
              color="bg-amber-100 text-amber-700"
            />
          </div>
          <p className="font-mono-brand text-[11px] uppercase tracking-[0.15em] text-muted-foreground mb-3">
            Infrastructure
          </p>
          <SpecTable
            rows={[
              { label: "Hosting", value: "Hetzner (AX-series dedicated)" },
              { label: "CPU", value: "AMD EPYC 9254 24-Core / 48 threads \u2014 bare metal" },
              { label: "RAM", value: "384 GiB (377 GiB visible)" },
              { label: "Storage", value: "Software RAID \u2014 439 GB ext4 + 3.5 TB XFS" },
              { label: "Host OS", value: "Ubuntu 24.04 LTS, kernel 6.8.0-94-generic" },
              { label: "Runtime", value: "Docker Engine + Sysbox (Nestybox)" },
              { label: "cgroup", value: "v2 unified hierarchy" },
            ]}
          />
          <p className="font-mono-brand text-[11px] uppercase tracking-[0.15em] text-muted-foreground mb-3 mt-6">
            VM Specs
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "1", sub: "CPU core" },
              { label: "1 GiB", sub: "RAM (cgroup)" },
              { label: "3 GiB", sub: "root overlay" },
              { label: "172.20.x", sub: "Docker bridge" },
            ].map((s) => (
              <div
                key={s.sub}
                className="p-4 rounded-lg border border-border/50 bg-white text-center"
              >
                <p className="font-heading text-[20px] tracking-[-0.3px]">
                  {s.label}
                </p>
                <p className="font-mono-brand text-[11px] text-muted-foreground mt-1">
                  {s.sub}
                </p>
              </div>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* ── Modal ── */}
      <FadeIn>
        <div className="my-10">
          <div className="flex items-center gap-3 mb-4">
            <h3 className="font-heading text-[26px] tracking-[-0.3px]">
              Modal
            </h3>
            <IsolationBadge
              type="gVisor"
              color="bg-blue-100 text-blue-700"
            />
          </div>
          <p className="font-mono-brand text-[11px] uppercase tracking-[0.15em] text-muted-foreground mb-3">
            Infrastructure
          </p>
          <SpecTable
            rows={[
              { label: "Isolation", value: "gVisor (confirmed by kernel cmdline, dmesg, env var)" },
              { label: "Host kernel", value: 'Hidden; gVisor presents fake "4.4.0"' },
              { label: "Host CPU", value: "AMD EPYC (AMD-specific flags: sse4a, misalignsse, topoext)" },
              { label: "Cloud", value: "Microsoft Azure" },
              { label: "Region", value: "eastus" },
              { label: "Public IP", value: "Not accessible (no outbound internet)" },
            ]}
          />

          <FadeIn>
            <Callout>
              Modal's gVisor leaks the host's full 448 GiB memory through /proc/meminfo
              &mdash; a known gVisor behaviour, not the actual container allocation.
            </Callout>
          </FadeIn>

          <p className="font-mono-brand text-[11px] uppercase tracking-[0.15em] text-muted-foreground mb-3 mt-6">
            VM Specs
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "1", sub: "vCPU (default)" },
              { label: "~448 GiB", sub: "visible RAM *" },
              { label: "512 GiB", sub: "root (9p mount)" },
              { label: "16 GiB", sub: "/dev/shm" },
            ].map((s) => (
              <div
                key={s.sub}
                className="p-4 rounded-lg border border-border/50 bg-white text-center"
              >
                <p className="font-heading text-[20px] tracking-[-0.3px]">
                  {s.label}
                </p>
                <p className="font-mono-brand text-[11px] text-muted-foreground mt-1">
                  {s.sub}
                </p>
              </div>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* ── Blaxel ── */}
      <FadeIn>
        <div className="my-10">
          <div className="flex items-center gap-3 mb-4">
            <h3 className="font-heading text-[26px] tracking-[-0.3px]">
              Blaxel
            </h3>
            <IsolationBadge
              type="Firecracker + Unikraft"
              color="bg-green-100 text-green-700"
            />
          </div>
          <p className="font-mono-brand text-[11px] uppercase tracking-[0.15em] text-muted-foreground mb-3">
            Infrastructure
          </p>
          <SpecTable
            rows={[
              { label: "Hypervisor", value: "Firecracker (confirmed by MPTABLE: OEM ID: FC)" },
              { label: "Unikernel", value: "Unikraft (unikraft in kernel cmdline, ukp-fuse mount)" },
              { label: "Host CPU", value: "Intel Xeon @ 2.90GHz (Ice Lake \u2014 AVX-512 VNNI, VBMI2)" },
              { label: "Hosting", value: "AWS us-west-2 (Portland, Oregon)" },
              { label: "Instance", value: "Likely c6i or m6i (Xeon Platinum 8375C)" },
            ]}
          />

          {/* Unikraft signals */}
          <p className="font-mono-brand text-[11px] uppercase tracking-[0.15em] text-muted-foreground mb-3 mt-6">
            Unikraft signals detected
          </p>
          <div className="my-4 overflow-hidden rounded-lg border border-border/50">
            <div className="divide-y divide-border/50">
              {[
                { signal: "unikraft in kernel cmdline", meaning: "Unikraft framework driving the boot" },
                { signal: "ukp_initrd block device (~203 MiB)", meaning: "Compressed base filesystem image" },
                { signal: "ukp-fuse on /uk/libukp", meaning: "Unikraft platform library via FUSE" },
                { signal: "PID 1: /init unikraft /bin/metamorph-wrapper", meaning: "Custom init chain" },
              ].map((row, i) => (
                <div key={i} className="flex items-start gap-4 px-5 py-3 bg-white">
                  <code className="font-mono-brand text-[12px] text-foreground flex-shrink-0 w-[280px]">
                    {row.signal}
                  </code>
                  <p className="text-[13px] text-muted-foreground">{row.meaning}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="font-mono-brand text-[11px] uppercase tracking-[0.15em] text-muted-foreground mb-3 mt-6">
            VM Specs
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "2", sub: "vCPUs" },
              { label: "3.8 GiB", sub: "RAM" },
              { label: "1.9 GiB", sub: "ramfs (no disk!)" },
              { label: "None", sub: "swap" },
            ].map((s) => (
              <div
                key={s.sub}
                className="p-4 rounded-lg border border-border/50 bg-white text-center"
              >
                <p className="font-heading text-[20px] tracking-[-0.3px]">
                  {s.label}
                </p>
                <p className="font-mono-brand text-[11px] text-muted-foreground mt-1">
                  {s.sub}
                </p>
              </div>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* ── Sprites ── */}
      <FadeIn>
        <div className="my-10">
          <div className="flex items-center gap-3 mb-4">
            <h3 className="font-heading text-[26px] tracking-[-0.3px]">
              Sprites
            </h3>
            <IsolationBadge
              type="Firecracker"
              color="bg-green-100 text-green-700"
            />
          </div>
          <SpecTable
            rows={[
              { label: "Hypervisor", value: "Firecracker (kernel cmdline, MPTABLE OEM ID)" },
              { label: "KVM backend", value: "Yes" },
              { label: "Host CPU", value: "AMD EPYC (model masked by Firecracker)" },
              { label: "Hosting", value: "Fly.io own infrastructure" },
              { label: "IPv4 exit", value: "CacheFly transit (AS30081), Los Angeles" },
              { label: "IPv6", value: "Fly.io allocation (AS40509)" },
            ]}
          />
        </div>
      </FadeIn>

      {/* ── exe.dev ── */}
      <FadeIn>
        <div className="my-10">
          <div className="flex items-center gap-3 mb-4">
            <h3 className="font-heading text-[26px] tracking-[-0.3px]">
              exe.dev
            </h3>
            <IsolationBadge
              type="Cloud Hypervisor"
              color="bg-foreground/10 text-foreground"
            />
          </div>
          <p className="font-mono-brand text-[11px] uppercase tracking-[0.15em] text-muted-foreground mb-3">
            Infrastructure
          </p>
          <SpecTable
            rows={[
              { label: "Hypervisor", value: "Cloud Hypervisor (Intel/open-source, not Firecracker or QEMU)" },
              { label: "KVM backend", value: "Yes" },
              { label: "Host CPU", value: "AMD EPYC 9554P 64-Core (single-socket, Zen 4 Genoa)" },
              { label: "Hosting", value: "Latitude.sh bare metal (AS396356, Los Angeles)" },
              { label: "Metadata", value: 'Custom JSON at 169.254.169.254 \u2014 NOT AWS/GCP/Hetzner format' },
            ]}
          />
          <p className="font-mono-brand text-[11px] uppercase tracking-[0.15em] text-muted-foreground mb-3 mt-6">
            VM Specs
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "2", sub: "vCPUs (no SMT)" },
              { label: "7.2 GiB", sub: "RAM (dedicated)" },
              { label: "18.6 GiB", sub: "virtio-blk ext4" },
              { label: "None", sub: "cgroup limits" },
            ].map((s) => (
              <div
                key={s.sub}
                className="p-4 rounded-lg border border-border/50 bg-white text-center"
              >
                <p className="font-heading text-[20px] tracking-[-0.3px]">
                  {s.label}
                </p>
                <p className="font-mono-brand text-[11px] text-muted-foreground mt-1">
                  {s.sub}
                </p>
              </div>
            ))}
          </div>
        </div>
      </FadeIn>

      <FadeIn>
        <div className="w-12 h-px bg-border my-10" />
      </FadeIn>

      <FadeIn>
        <div className="space-y-7">
          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            The fingerprinting code and full raw results are available on{" "}
            <a
              href="https://github.com/diggerhq/sandbox-fingerprinting"
              target="_blank"
              className="underline hover:text-muted-foreground transition-colors"
            >
              GitHub
            </a>
            . If you spot any inaccuracies or have additional data points,
            please open an issue or PR.
          </p>
        </div>
      </FadeIn>
    </SitePageLayout>
  );
};

export default SandboxFingerprinting;
