// Guides collection — single source of truth for the /guides/ section.
//
// Guides are markdown-rendered (src/content/guides/<slug>.md), unlike blog
// posts which are hardcoded components. The markdown files are the reviewed
// finals from the deepdive pipeline and must not be hand-edited here; edits
// happen in the review repo and get re-copied.
//
// Consumed by:
// - src/pages/guides/GuidePost.tsx / GuidesIndex.tsx (runtime rendering)
// - vite-plugin-blog-meta.ts (per-slug HTML shells, JSON-LD, sitemap, md twins)
// - scripts/prerender.ts (route list)
// - src/content/guides/guides.test.ts (regression suite)

export interface GuideMeta {
  slug: string;
  // Search-targeted <title> tag. May be shorter than the markdown H1 (which
  // renders as the on-page title).
  title: string;
  description: string;
  author: string;
  // ISO 8601 — feeds Article JSON-LD datePublished and the sitemap lastmod.
  datePublished: string;
  image?: string;
}

export const guidePosts: GuideMeta[] = [
  {
    slug: "codesandbox-alternatives",
    title: "CodeSandbox Alternatives for AI Agents (2026)",
    description:
      "CodeSandbox CI and Repos shut down in 2026. Seven alternatives for AI-agent workloads, compared on session durability, failure contract, credential architecture, and control plane.",
    author: "Utpal Nadiger",
    datePublished: "2026-07-20",
    image: "/guides/assets/codesandbox-alternatives/commodity-line.png",
  },
  {
    slug: "qemu-vs-kvm",
    title: "QEMU vs KVM for AI Agent Sandboxes",
    description:
      "KVM is a Linux kernel module; QEMU is the userspace VMM that uses it. They are two parts of one stack, not competing options. The real decision is QEMU vs Firecracker vs Cloud Hypervisor, evaluated from a production QEMU-on-KVM fleet.",
    author: "Utpal Nadiger",
    datePublished: "2026-07-20",
    image: "/guides/assets/qemu-vs-kvm/qemu-kvm-split.png",
  },
  {
    slug: "firecracker-vs-cloud-hypervisor-vs-kata",
    title: "Firecracker vs Cloud Hypervisor vs Kata Containers",
    description:
      "Firecracker and Cloud Hypervisor are hypervisors; Kata Containers is a container runtime that drives one of them. The actual layers, the kernel-sharing boundary, and the feature differences that decide the pick for AI-agent isolation.",
    author: "Utpal Nadiger",
    datePublished: "2026-07-20",
    image:
      "/guides/assets/firecracker-vs-cloud-hypervisor-vs-kata/layer-stack.png",
  },
  {
    slug: "e2b-alternatives",
    title: "E2B Alternatives for AI Agent Sandboxes (2026)",
    description:
      "E2B alternatives for AI agent sandboxes compared: Daytona, Modal, Vercel, Morph, Runloop, Cloudflare, and OpenComputer, on live CPU/RAM resize, persistence, isolation, and price.",
    author: "Utpal Nadiger",
    datePublished: "2026-07-20",
    image: "/guides/assets/e2b-alternatives/pricing-opencomputer.png",
  },
  {
    slug: "codespaces-gitpod-agents",
    title: "GitHub Codespaces vs Gitpod for Autonomous AI Agents",
    description:
      "Cloud development environments were built for a human who closes the laptop. How Codespaces, Gitpod (now Ona), Coder, and agent VMs handle an unattended agent, on idle behavior, session limits, and live resize.",
    author: "Utpal Nadiger",
    datePublished: "2026-07-20",
    image: "/guides/assets/codespaces-gitpod-agents/homepage-ona.png",
  },
  {
    slug: "claude-agent-sdk-sandbox",
    title: "Claude Agent SDK: Where Does the Agent Actually Run?",
    description:
      "The Claude Agent SDK gives you the agent loop and tools, not the computer. Compare local, Docker, VPS, ephemeral sandboxes, and persistent VMs for running it in production.",
    author: "Utpal Nadiger",
    datePublished: "2026-07-20",
    image: "/guides/assets/claude-agent-sdk-sandbox/pricing-opencomputer.png",
  },
  {
    slug: "podman-vs-docker-untrusted-code",
    title: "Podman vs Docker for Running Untrusted Code",
    description:
      "Rootless and daemonless both shrink the blast radius, but Podman and Docker share the host kernel. Here is where that stops mattering, walked up the isolation ladder to a VM with its own kernel.",
    author: "Utpal Nadiger",
    datePublished: "2026-07-20",
    image:
      "/guides/assets/podman-vs-docker-untrusted-code/cve-2024-21626-nvd.png",
  },
  {
    slug: "python-sandbox",
    title: "Python Sandbox: Every Approach, Honestly Ranked",
    description:
      "Which Python sandbox actually contains untrusted code? A ranked walkthrough from in-process tricks that fail to microVMs that work, with a working escape you can run.",
    author: "Utpal Nadiger",
    datePublished: "2026-07-20",
    image: "/guides/assets/python-sandbox/escape-terminal.png",
  },
];

// Intrinsic pixel sizes for every image referenced by guide markdown.
// width/height attributes prevent layout shift (CLS); the test suite fails
// when a referenced image is missing from this map or from public/.
export const guideImageDimensions: Record<
  string,
  { width: number; height: number }
> = {
  "/guides/assets/codesandbox-alternatives/commodity-line.png": { width: 2176, height: 1008 },
  "/guides/assets/codesandbox-alternatives/credential-architecture.png": { width: 1622, height: 1136 },
  "/guides/assets/codesandbox-alternatives/homepage-blaxel.png": { width: 2880, height: 1800 },
  "/guides/assets/codesandbox-alternatives/homepage-daytona.png": { width: 2880, height: 1800 },
  "/guides/assets/codesandbox-alternatives/homepage-e2b.png": { width: 2880, height: 1800 },
  "/guides/assets/codesandbox-alternatives/homepage-microsandbox.png": { width: 2880, height: 1800 },
  "/guides/assets/codesandbox-alternatives/homepage-modal.png": { width: 2880, height: 1800 },
  "/guides/assets/codesandbox-alternatives/homepage-opencomputer.png": { width: 2880, height: 1800 },
  "/guides/assets/codesandbox-alternatives/homepage-together-code-sandbox.png": { width: 2880, height: 1800 },
  "/guides/assets/codesandbox-alternatives/loop-pattern-to-platform.png": { width: 1776, height: 1244 },
  "/guides/assets/firecracker-vs-cloud-hypervisor-vs-kata/kernel-sharing-boundary.png": { width: 1856, height: 1111 },
  "/guides/assets/firecracker-vs-cloud-hypervisor-vs-kata/layer-stack.png": { width: 1837, height: 888 },
  "/guides/assets/qemu-vs-kvm/qemu-kvm-split.png": { width: 1536, height: 1196 },
  "/guides/assets/qemu-vs-kvm/vmm-seat.png": { width: 2156, height: 983 },
  "/guides/assets/e2b-alternatives/pricing-e2b.png": { width: 5056, height: 1880 },
  "/guides/assets/e2b-alternatives/pricing-modal.png": { width: 1600, height: 1400 },
  "/guides/assets/e2b-alternatives/pricing-opencomputer.png": { width: 4160, height: 2240 },
  "/guides/assets/codespaces-gitpod-agents/homepage-ona.png": { width: 3040, height: 1360 },
  "/guides/assets/codespaces-gitpod-agents/pricing-opencomputer.png": { width: 4160, height: 2240 },
  "/guides/assets/claude-agent-sdk-sandbox/pricing-e2b.png": { width: 5056, height: 1880 },
  "/guides/assets/claude-agent-sdk-sandbox/pricing-opencomputer.png": { width: 4160, height: 2240 },
  "/guides/assets/podman-vs-docker-untrusted-code/cve-2024-21626-nvd.png": { width: 4000, height: 2880 },
  "/guides/assets/podman-vs-docker-untrusted-code/pricing-opencomputer.png": { width: 4160, height: 2240 },
  "/guides/assets/python-sandbox/escape-terminal.png": { width: 2100, height: 1280 },
  "/guides/assets/python-sandbox/pricing-e2b.png": { width: 5056, height: 1880 },
};

// ---------------------------------------------------------------------------
// FAQ extraction — parses the post's own FAQ section so FAQPage JSON-LD can
// never drift from the published answers. Supports both shapes the posts use:
//   ## FAQ  followed by  ### Question?     (codesandbox, qemu)
//   ### FAQ followed by  **Question?**     (firecracker)
// Answers are flattened to plain text (links become their anchor text).

export interface FaqEntry {
  question: string;
  answer: string;
}

const stripInline = (s: string): string =>
  s
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // links -> anchor text
    .replace(/\*\*([^*]*)\*\*/g, "$1")
    .replace(/\*([^*]*)\*/g, "$1")
    .replace(/`([^`]*)`/g, "$1")
    .trim();

export function extractFaq(markdown: string): FaqEntry[] {
  const lines = markdown.split("\n");
  const faqStart = lines.findIndex((l) => /^#{2,3}\s+FAQ\s*$/.test(l.trim()));
  if (faqStart === -1) return [];
  const faqHeadingLevel = (lines[faqStart].match(/^#+/) ?? ["##"])[0].length;

  const entries: FaqEntry[] = [];
  let question: string | null = null;
  let answerLines: string[] = [];

  const flush = () => {
    if (question) {
      const answer = stripInline(
        answerLines.join("\n").replace(/\n{2,}/g, " ").replace(/\n/g, " "),
      );
      if (answer) entries.push({ question, answer });
    }
    question = null;
    answerLines = [];
  };

  for (let i = faqStart + 1; i < lines.length; i++) {
    const line = lines[i];
    const headingMatch = line.match(/^(#+)\s+(.*)$/);
    if (headingMatch) {
      // A heading at or above the FAQ's own level ends the section.
      if (headingMatch[1].length <= faqHeadingLevel) break;
      flush();
      question = stripInline(headingMatch[2]);
      continue;
    }
    const boldQ = line.trim().match(/^\*\*(.+\?)\*\*$/);
    if (boldQ) {
      flush();
      question = stripInline(boldQ[1]);
      continue;
    }
    if (question) answerLines.push(line);
  }
  flush();
  return entries;
}
