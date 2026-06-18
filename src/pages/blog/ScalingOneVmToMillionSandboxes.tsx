import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import FadeIn from "@/components/FadeIn";
import SitePageLayout from "@/components/SitePageLayout";
import SEO from "@/components/SEO";

/* ---------- Table of contents ---------- *
 * Fixed to the right margin on viewports ≥1360px. Below that, hidden.
 * IntersectionObserver tracks the topmost visible heading.
 */
type TocItem = { id: string; label: string; sub?: boolean };
const TOC_ITEMS: TocItem[] = [
  { id: "one-azure-region", label: "One Azure region" },
  { id: "behind-cloud-quotas", label: "Behind cloud quotas", sub: true },
  { id: "the-300-cpu-ceiling", label: "The 300-CPU ceiling", sub: true },
  { id: "why-migration-wouldnt-fix", label: "Why migrating wouldn't fix it", sub: true },
  { id: "single-control-plane", label: "A single control plane" },
  { id: "cells", label: "Cells as the deploy unit" },
  { id: "control-plane-one-job", label: "Control plane, one job", sub: true },
  { id: "vm-placement", label: "VM placement", sub: true },
  { id: "cell-any-cloud", label: "Same cell, any cloud", sub: true },
  { id: "edge-registry", label: "A registry at the edge" },
  { id: "request-finds-cell", label: "How a create finds a cell", sub: true },
  { id: "only-creates-cost", label: "Only creates cost time", sub: true },
  { id: "why-cloudflare", label: "Why Cloudflare + D1", sub: true },
  { id: "heartbeats", label: "Heartbeats" },
  { id: "per-second-billing", label: "Per-second billing", sub: true },
  { id: "state-changes-pushed", label: "Push, don't poll", sub: true },
  { id: "lifecycle-latencies", label: "Lifecycle latencies" },
  { id: "where-we-are-today", label: "Where we are today" },
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
                  : item.sub
                    ? "text-muted-foreground/80 hover:text-foreground"
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

/* ---------- Inline code ---------- */
const InlineCode = ({ children }: { children: React.ReactNode }) => (
  <code className="font-mono-brand text-[15px] bg-[hsl(0,0%,93%)] px-1.5 py-0.5 rounded">
    {children}
  </code>
);

/* ---------- Tweet embed ----------
 * Renders X's standalone tweet iframe (no widgets.js — that would be stripped
 * by the browser-based prerenderer at build time and lose the static fallback).
 * The sr-only figcaption keeps the tweet text indexable for crawlers + screen
 * readers; <noscript> covers users without JS.
 */
const TwitterEmbed = ({
  url,
  id,
  author,
  handle,
  date,
  text,
  height = 580,
}: {
  url: string;
  id: string;
  author: string;
  handle: string;
  date: string;
  text: string;
  height?: number;
}) => (
  <figure className="my-10 flex flex-col items-center">
    <iframe
      src={`https://platform.twitter.com/embed/Tweet.html?id=${id}&dnt=true&theme=light`}
      title={`Tweet by ${author} (@${handle}): ${text}`}
      aria-label={`Tweet by ${author} (@${handle}): ${text}`}
      loading="lazy"
      sandbox="allow-scripts allow-popups allow-same-origin allow-popups-to-escape-sandbox"
      style={{
        width: "100%",
        maxWidth: "550px",
        height: `${height}px`,
        border: 0,
        colorScheme: "light",
      }}
    />
    <figcaption className="sr-only">
      Tweet by {author} (@{handle}), {date}: &ldquo;{text}&rdquo;. View at {url}.
    </figcaption>
    <noscript>
      <blockquote className="my-4 pl-5 border-l-[3px] border-foreground/80 max-w-[550px]">
        <p className="font-heading text-[18px] leading-[1.6] italic">&ldquo;{text}&rdquo;</p>
        <cite className="font-mono-brand text-[12px] text-muted-foreground not-italic">
          &mdash; {author} (@{handle}),{" "}
          <a href={url} className="underline">{date}</a>
        </cite>
      </blockquote>
    </noscript>
  </figure>
);

/* ---------- Diagram (static image) ----------
 * Native <img> with figcaption. Lazy-loaded; alt text carries the caption so
 * crawlers and screen readers get the same information.
 */
const Diagram = ({
  src,
  caption,
  alt,
}: {
  src: string;
  caption?: string;
  alt: string;
}) => (
  <figure className="my-10 -mx-2 sm:mx-0">
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className="w-full rounded-lg border border-border/50 bg-white"
    />
    {caption && (
      <figcaption className="font-mono-brand text-[12px] text-muted-foreground mt-3 italic text-center">
        {caption}
      </figcaption>
    )}
  </figure>
);

/* ---------- Interactive visual (iframe) ----------
 * Hosts an interactive HTML illustration. The <figcaption class="sr-only">
 * + <noscript> together carry an indexable description so non-JS crawlers
 * and screen readers get the same content the iframe shows visually.
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
      className="rounded-lg border border-border/50"
    />
    <figcaption className="sr-only">{fallback}</figcaption>
    <noscript>
      <p className="font-mono-brand text-[12px] text-muted-foreground mt-2 italic">
        {title}: {fallback}
      </p>
    </noscript>
  </figure>
);

const VISUAL_BASE = "/blog-visuals/scaling-one-vm-to-million-sandboxes";

const ScalingOneVmToMillionSandboxes = () => {
  return (
    <SitePageLayout activeSection="blog" contentAs="article">
      <SEO
        title="Scaling OpenComputer from one VM to a million sandboxes"
        description="From one VM to a million sandboxes: the architecture redesign behind OpenComputer's scaling — cells, edge routing on Cloudflare Workers, and per-second billing from 10-second heartbeats."
        author="Mohamed Habib"
        path="/blog/scaling-one-vm-to-million-sandboxes"
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
          Scaling OpenComputer from one VM to a million sandboxes
        </h1>
      </FadeIn>

      <FadeIn delay={0.08}>
        <p className="font-mono-brand text-[13px] text-muted-foreground mb-10">
          Written by Mohamed Habib &middot;{" "}
          <time dateTime="2026-06-17">June 17, 2026</time>
        </p>
      </FadeIn>

      {/* ---- Intro ---- */}
      <FadeIn delay={0.12}>
        <div className="space-y-7">
          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            We started OpenComputer with a single virtual machine in one Azure region. The
            company grew quickly, but Azure couldn't raise our compute quota in that region any
            further, and we found ourselves growing against a fixed pool of CPUs.
          </p>
          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            So we had to find another way to scale.
          </p>
          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            This post covers what we did to reach a point where we can keep adding capacity more
            or less indefinitely. We'll go through how we split the system into cells, how a
            global registry at the edge decides where every sandbox lives, and how four cloud
            providers add up to a million CPUs.
          </p>
        </div>
      </FadeIn>

      <FadeIn>
        <TwitterEmbed
          url="https://twitter.com/motatoeshq/status/2063679701873492299"
          id="2063679701873492299"
          author="Mohamed Habib"
          handle="motatoeshq"
          date="June 7, 2026"
          text="How we're scaling opencomputer.dev to 1M sandboxes"
        />
      </FadeIn>

      <Visual
        src={`${VISUAL_BASE}/01-hero-interactive.html`}
        height={720}
        title="How OpenComputer scales — interactive"
        fallback="Interactive architecture diagram with four stages. Stage 1 (1–100 sandboxes): one control plane connected to one worker. Stage 2 (100–1K): the same control plane scheduling across three workers in a single region. Stage 3 (1K–10K): the control-plane-plus-workers unit becomes a cell, with two cells sitting under an edge termination layer (Cloudflare Workers + D1 registry) that routes each create to the cell with the most room and receives heartbeats back. Stage 4 (10K–100K+): four cells under the edge layer, repeating across regions and clouds. Adding capacity is now a deployment step. Click the stage buttons or type a number of sandboxes to create and the architecture animates to match."
      />

      {/* ====== H2: One Azure region ====== */}
      <FadeIn>
        <h2
          id="one-azure-region"
          className="scroll-mt-24 font-heading text-[clamp(28px,4vw,38px)] leading-[1.35] tracking-[-0.8px] mb-6"
        >
          Our entire capacity lived inside one Azure region's quota
        </h2>
      </FadeIn>

      <FadeIn>
        <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
          Sandboxes are full VMs, VMs need physical hardware, and cloud providers ration that
          hardware per region. Our problem started with the rationing, so it helps to spell out
          how it works first.
        </p>
      </FadeIn>

      <FadeIn>
        <h3
          id="behind-cloud-quotas"
          className="scroll-mt-24 font-heading text-[22px] tracking-[-0.3px] mt-10 mb-4"
        >
          Behind cloud quotas
        </h3>
      </FadeIn>

      <FadeIn>
        <div className="space-y-5">
          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            Every cloud provider bounds you by regional capacity, which is basically where the
            physical data center exists with finite hardware and a long queue of customers who
            want it.
          </p>
          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            So providers hand out capacity as a quota, measured in total CPU count. Quotas start
            small and grow only after you build usage history. The working protocol is to run
            your existing allocation at around 50% utilization for a week or two, request an
            increase, and let the usage data justify it. Request 10,000 CPUs on day one and the
            answer is no.
          </p>
        </div>
      </FadeIn>

      <FadeIn>
        <h3
          id="the-300-cpu-ceiling"
          className="scroll-mt-24 font-heading text-[22px] tracking-[-0.3px] mt-10 mb-4"
        >
          We hit the 300-CPU ceiling early
        </h3>
      </FadeIn>

      <FadeIn>
        <div className="space-y-5">
          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            Our first region was Azure US East 2, with a starting quota of about 300 CPUs. The
            plan was to consume it and request more, the way the ladder normally works.
          </p>
          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            But unfortunately we had picked one of the busiest data centers in the world, and 300
            CPUs was the ceiling there regardless of our usage history. Meanwhile new users were
            signing up against a fixed pool of compute.
          </p>
        </div>
      </FadeIn>

      <FadeIn>
        <h3
          id="why-migration-wouldnt-fix"
          className="scroll-mt-24 font-heading text-[22px] tracking-[-0.3px] mt-10 mb-4"
        >
          Why migrating to another region wouldn't have fixed the scale issue
        </h3>
      </FadeIn>

      <FadeIn>
        <div className="space-y-5">
          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            The obvious move was relocating to a quieter region or a different cloud and
            collecting a bigger quota there. We also held Azure credits we wanted to use. But the
            deeper problem is that migrating regions or cloud providers only resets the clock.
          </p>
          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            Every region has an upper limit, providers raise it gradually, but a single-region
            architecture scaling fast enough will hit the ceiling at some point.
          </p>
          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            On top of that, sandbox demand at 10K, 100K, or 1M concurrent VMs can't physically be
            served from one data center. We needed to rethink the architecture so that adding a
            region of any cloud is a deployment step rather than a migration project. And we had
            to take our existing architecture apart to make that happen.
          </p>
        </div>
      </FadeIn>

      <FadeIn>
        <div className="w-12 h-px bg-border my-10" />
      </FadeIn>

      {/* ====== H2: Single control plane ====== */}
      <FadeIn>
        <h2
          id="single-control-plane"
          className="scroll-mt-24 font-heading text-[clamp(28px,4vw,38px)] leading-[1.35] tracking-[-0.8px] mb-6"
        >
          Starting with a single control plane
        </h2>
      </FadeIn>

      <FadeIn>
        <div className="space-y-5">
          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            Our first version of OpenComputer was a single VM handling everything with a control
            plane.
          </p>
          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            The second version is where we scaled to multiple VMs in one region, coordinated by
            one control plane that did everything: the web UI, the dashboard, billing logic, and
            the actual orchestration of VMs, all in one place.
          </p>
        </div>
      </FadeIn>

      <Visual
        src={`${VISUAL_BASE}/02-single-control-plane.html`}
        height={440}
        title="Single control plane in one region"
        fallback="A single control plane (running web UI, dashboard, billing, and orchestration) connected to three workers, all inside one Azure region shown as a dashed boundary box."
      />

      <FadeIn>
        <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
          That design served roughly a thousand sandboxes comfortably. It assumed all compute
          lived in one region, and the component that orchestrates VMs can also be the component
          that runs the product around them. We had to split those two jobs apart.
        </p>
      </FadeIn>

      <FadeIn>
        <div className="w-12 h-px bg-border my-10" />
      </FadeIn>

      {/* ====== H2: Cells ====== */}
      <FadeIn>
        <h2
          id="cells"
          className="scroll-mt-24 font-heading text-[clamp(28px,4vw,38px)] leading-[1.35] tracking-[-0.8px] mb-6"
        >
          Cells made capacity a deployable unit
        </h2>
      </FadeIn>

      <FadeIn>
        <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
          We started with cutting the control plane down to a single job (orchestrating VMs),
          and we packaged it with the workers it manages into a unit that deploys into any cloud
          region. That unit is a "cell."
        </p>
      </FadeIn>

      <FadeIn>
        <h3
          id="control-plane-one-job"
          className="scroll-mt-24 font-heading text-[22px] tracking-[-0.3px] mt-10 mb-4"
        >
          The control plane shrinks to one job
        </h3>
      </FadeIn>

      <FadeIn>
        <p className="text-[17px] leading-[1.75] tracking-[-0.1px] mb-4">
          The redesign stripped the control plane down to the lifecycle of VMs in its own
          region:
        </p>
      </FadeIn>

      <Diagram
        src={`${VISUAL_BASE}/03-cell-responsibilities.png`}
        alt="A cell's control plane has four jobs: schedule a sandbox onto a worker, track every VM's state, hibernate idle VMs to S3, and migrate VMs between workers when rebalancing."
      />

      <FadeIn>
        <ol className="space-y-2 text-[17px] leading-[1.75] tracking-[-0.1px] pl-1 list-decimal list-inside">
          <li>Schedule a requested sandbox onto a specific worker.</li>
          <li>Track where every VM lives and what state it's in.</li>
          <li>Hibernate idle VMs to S3-backed storage and wake them on demand.</li>
          <li>Migrate a VM from one worker to another when a rebalance calls for it.</li>
        </ol>
      </FadeIn>

      <FadeIn>
        <div className="space-y-5 mt-6">
          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            Components inside a cell know about each other and about nothing outside the cell.
            The dashboard, billing logic, and everything user-facing moved out of the cell
            entirely.
          </p>
          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            A cell is the smallest unit of failure isolation, and its identifier encodes
            everything about what server region it lives in. Each cell owns 5 to 10 workers
            running QEMU VMs.
          </p>
        </div>
      </FadeIn>

      <FadeIn>
        <h3
          id="vm-placement"
          className="scroll-mt-24 font-heading text-[22px] tracking-[-0.3px] mt-10 mb-4"
        >
          VM placement is more than picking the least-loaded worker
        </h3>
      </FadeIn>

      <FadeIn>
        <div className="space-y-5">
          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            When a create request is sent with memory, CPU, disk, and a template, the control
            plane could pick a specific worker based on certain criteria. A simplistic control
            plane would look for the least-loaded worker and spawn a VM there.
          </p>
          <p className="text-[17px] leading-[1.75] tracking-[-0.1px] mb-3">
            A good control plane should weigh:
          </p>
          <ul className="space-y-2 text-[17px] leading-[1.75] tracking-[-0.1px] pl-1">
            <li className="pl-5 relative before:content-['—'] before:absolute before:left-0 before:text-muted-foreground">
              Resource fit so fragmentation doesn't kill capacity
            </li>
            <li className="pl-5 relative before:content-['—'] before:absolute before:left-0 before:text-muted-foreground">
              Template warmth (a worker already holding a warm golden snapshot creates in about
              200ms where a cold one takes seconds)
            </li>
            <li className="pl-5 relative before:content-['—'] before:absolute before:left-0 before:text-muted-foreground">
              Hardware differences like ARM against amd64
            </li>
            <li className="pl-5 relative before:content-['—'] before:absolute before:left-0 before:text-muted-foreground">
              Soft affinity that keeps an org's sandboxes near their caches
            </li>
            <li className="pl-5 relative before:content-['—'] before:absolute before:left-0 before:text-muted-foreground">
              Anti-affinity that keeps paid workloads away from noisy free-tier neighbors
            </li>
          </ul>
        </div>
      </FadeIn>

      <FadeIn>
        <h3
          id="cell-any-cloud"
          className="scroll-mt-24 font-heading text-[22px] tracking-[-0.3px] mt-10 mb-4"
        >
          The same cell deploys into any cloud
        </h3>
      </FadeIn>

      <Visual
        src={`${VISUAL_BASE}/04-cell-cross-cloud.html`}
        height={460}
        title="The same cell deploys into any cloud"
        fallback="One cell glyph (a control plane plus its workers) fans out into four cloud provider rows: AWS (~20 regions), Azure (~20 regions), GCP (~20 regions), and OCI (fewer regions). The same cell shape stamps unchanged into each."
      />

      <FadeIn>
        <div className="space-y-5">
          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            A cell makes no assumptions about which provider it runs on. The worker shape we use
            has an equivalent instance type in AWS, Azure, GCP, and OCI, so the same cell deploys
            into any of them unchanged.
          </p>
          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            With this, capacity stopped being "our Azure quota" and became "the sum of every cell
            we've deployed."
          </p>
        </div>
      </FadeIn>

      <FadeIn>
        <div className="w-12 h-px bg-border my-10" />
      </FadeIn>

      {/* ====== H2: Edge registry ====== */}
      <FadeIn>
        <h2
          id="edge-registry"
          className="scroll-mt-24 font-heading text-[clamp(28px,4vw,38px)] leading-[1.35] tracking-[-0.8px] mb-6"
        >
          A global registry at the edge routes every sandbox
        </h2>
      </FadeIn>

      <FadeIn>
        <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
          With multiple independent cells, something has to answer which cell gets the sandbox.
          That job sits outside every cell, at the edge.
        </p>
      </FadeIn>

      <FadeIn>
        <h3
          id="request-finds-cell"
          className="scroll-mt-24 font-heading text-[22px] tracking-[-0.3px] mt-10 mb-4"
        >
          How a create request finds its cell
        </h3>
      </FadeIn>

      <FadeIn>
        <div className="space-y-5">
          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            The edge layer is a set of Cloudflare Workers, with a D1 database holding the global
            registry and Durable Objects receiving the event stream coming back from the cells.
          </p>
          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            That registry knows every cell that exists, where it runs, and how much free
            capacity it holds. We think of it as a control plane of control planes.
          </p>
          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            A create request lands at the nearest edge location, the Worker picks the emptiest
            cell, and that cell's control plane owns the sandbox from there.
          </p>
        </div>
      </FadeIn>

      <FadeIn>
        <h3
          id="only-creates-cost"
          className="scroll-mt-24 font-heading text-[22px] tracking-[-0.3px] mt-10 mb-4"
        >
          Only creates cost time at the edge
        </h3>
      </FadeIn>

      <FadeIn>
        <div className="space-y-5">
          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            A create is rare and expensive anyway, so spending an extra 50 to 100ms at the edge
            on auth, credit checks, and cell selection is a fine trade.
          </p>
          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            Everything frequent (<InlineCode>exec</InlineCode>, file reads and writes, PTY
            traffic, <InlineCode>destroy</InlineCode>) goes straight to the cell's control plane
            over a connection authenticated by a signed JWT, with zero synchronous Cloudflare
            lookups in the path.
          </p>
          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            The edge decides where a sandbox is born, and after that the cell serves it directly.
          </p>
        </div>
      </FadeIn>

      <FadeIn>
        <h3
          id="why-cloudflare"
          className="scroll-mt-24 font-heading text-[22px] tracking-[-0.3px] mt-10 mb-4"
        >
          Why Cloudflare Workers and D1 database carry this layer
        </h3>
      </FadeIn>

      <FadeIn>
        <div className="space-y-5">
          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            The registry's workload is small and read-heavy: a row per cell, capacity counters,
            lifecycle state.
          </p>
          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            The D1 database is enough for that, and running the lookup at the edge means the
            routing decision happens close to the user with no round-trip to a home region.
          </p>
          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            The rest of the global state lives in the same stack. KV holds sessions and event
            dedup keys, R2 archives the raw event stream, and Durable Objects hold the per-org
            credit accounting and the per-sandbox routing state.
          </p>
        </div>
      </FadeIn>

      <FadeIn>
        <div className="w-12 h-px bg-border my-10" />
      </FadeIn>

      {/* ====== H2: Heartbeats ====== */}
      <FadeIn>
        <h2
          id="heartbeats"
          className="scroll-mt-24 font-heading text-[clamp(28px,4vw,38px)] leading-[1.35] tracking-[-0.8px] mb-6"
        >
          Heartbeats keep the registry and the billing current
        </h2>
      </FadeIn>

      <FadeIn>
        <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
          Routing is the downstream half of the edge. The upstream half is the event stream
          flowing from every running VM back through Durable Objects and into the registry.
        </p>
      </FadeIn>

      <FadeIn>
        <h3
          id="per-second-billing"
          className="scroll-mt-24 font-heading text-[22px] tracking-[-0.3px] mt-10 mb-4"
        >
          Per-second billing from 10-second heartbeats
        </h3>
      </FadeIn>

      <FadeIn>
        <div className="space-y-5">
          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            The most important event in that stream is the heartbeat.
          </p>
          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            Every running VM reports "still alive" every 10 seconds, and we aggregate those
            ticks into billing, which is how we charge for each second a sandbox actually runs.
          </p>
        </div>
      </FadeIn>

      <FadeIn>
        <h3
          id="state-changes-pushed"
          className="scroll-mt-24 font-heading text-[22px] tracking-[-0.3px] mt-10 mb-4"
        >
          State changes are pushed to the registry instead of waiting for a poll
        </h3>
      </FadeIn>

      <FadeIn>
        <div className="space-y-5">
          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            The same stream also carries lifecycle events. For instance, a VM hibernates, gets
            stopped, or migrates, and the registry is updated with a push so the next routing
            decision works from current capacity.
          </p>
          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            Inside a cell, workers publish events onto Redis Streams, and a forwarder batches
            them over HTTPS to a Cloudflare ingest Worker, which authenticates each batch with
            an HMAC, deduplicates on event IDs in KV, and fans out to the registry and the
            billing objects. Events are idempotent by design, and when Cloudflare is unreachable
            they buffer in Redis until the link comes back, so a cell never loses billing ticks
            to a network blip.
          </p>
          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            The registry is only as good as the events feeding it, and a stale registry keeps
            routing new sandboxes into a cell that's already full. That's the reason state
            changes push the moment they happen rather than waiting on a poll.
          </p>
        </div>
      </FadeIn>

      <FadeIn>
        <div className="w-12 h-px bg-border my-10" />
      </FadeIn>

      {/* ====== H2: Lifecycle latencies ====== */}
      <FadeIn>
        <h2
          id="lifecycle-latencies"
          className="scroll-mt-24 font-heading text-[clamp(28px,4vw,38px)] leading-[1.35] tracking-[-0.8px] mb-6"
        >
          Boot, hibernate, and wake latencies in production
        </h2>
      </FadeIn>

      <FadeIn>
        <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
          The cell design only matters if the VMs inside it are fast. And much of our
          engineering and tuning effort has gone into lifecycle latency. Our hypervisor is QEMU.
          While a stock QEMU cold boot takes around 30 seconds, we've brought sandbox boot under
          1 second at p95.
        </p>
      </FadeIn>

      <Visual
        src={`${VISUAL_BASE}/05-lifecycle-latencies.html`}
        height={420}
        title="Boot, wake, and hibernate latencies"
        fallback="Horizontal bars on a 0–30-second axis. Boot is under 1 second at p95 (shown in coral). Wake is 1–2 seconds. Hibernate is about 6 seconds. A dashed reference bar across the full axis shows a stock QEMU cold boot of around 30 seconds, for comparison."
      />

      <FadeIn>
        <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
          Hibernation creates a VM checkpoint in S3-backed storage and the process completes in
          about 6 seconds in the typical successful case. Waking the hibernated sandbox averages
          1 to 2 seconds, and the speed depends on whether the checkpoint is still warm on the
          worker or has to be pulled back from S3.
        </p>
      </FadeIn>

      <FadeIn>
        <div className="w-12 h-px bg-border my-10" />
      </FadeIn>

      {/* ====== H2: Where we are today ====== */}
      <FadeIn>
        <h2
          id="where-we-are-today"
          className="scroll-mt-24 font-heading text-[clamp(28px,4vw,38px)] leading-[1.35] tracking-[-0.8px] mb-6"
        >
          Where we are today in terms of scaling
        </h2>
      </FadeIn>

      <FadeIn>
        <div className="space-y-5">
          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            We were initially stuck at 300 CPUs because our whole system depended on a single
            region of a single cloud provider. Now the unit of deployment is a cell that owns
            its own VM lifecycle, and a region holds as many cells as we choose to put there.
          </p>
          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            The edge registry routes every sandbox creation to whichever cell has room, and the
            heartbeat stream keeps billing honest at one-second granularity.
          </p>
          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            The product promise stays unchanged through all of it. You get a full Linux VM,
            scheduled close to you, billed for the seconds it actually runs.
          </p>
        </div>
      </FadeIn>

      {/* ---- CTA ---- */}
      <FadeIn>
        <div className="my-12 p-6 rounded-xl border border-border/50 bg-[hsl(0,0%,98%)] text-center">
          <p className="font-heading text-[20px] tracking-[-0.3px] mb-3">
            <a
              href="https://opencomputer.dev"
              className="underline hover:text-foreground transition-colors"
            >
              Try it at opencomputer.dev →
            </a>
          </p>
          <p className="text-[15px] leading-[1.7] text-muted-foreground">
            The whole platform is open source at{" "}
            <a
              href="https://github.com/diggerhq/opencomputer"
              target="_blank"
              rel="noreferrer"
              className="underline hover:text-foreground transition-colors"
            >
              github.com/diggerhq/opencomputer
            </a>{" "}
            if you want to read the scheduler and the event pipeline.
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

export default ScalingOneVmToMillionSandboxes;
