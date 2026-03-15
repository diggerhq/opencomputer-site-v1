import { defineScene } from "../schema";

/* ── Agent event flow: outside vs inside sandbox (combined) ──────────────
   Left half: outside sandbox — 14 direct hops on the host.
   Right half: inside sandbox — 22 hops, every external call crosses the
   sandbox boundary twice, adding latency and policy evaluation.

   Controls let users adjust latencies and see how the flows diverge.
────────────────────────────────────────────────────────────────────────── */

export const agentEventFlowScene = defineScene({
  meta: {
    id: "agent-event-flow",
    title: "Agent Event Flow — Outside vs Inside",
    description:
      "Side-by-side comparison of how events flow through a coding agent with and without a sandbox. Outside: 14 direct hops. Inside: 22 hops with every external call crossing the sandbox boundary.",
    durationMs: 12000,
    viewport: { width: 1280, height: 720, padding: 56 },
  },

  controls: [
    { key: "sandboxBoundaryLatencyMs", label: "Sandbox boundary", min: 20, max: 500, step: 10, defaultValue: 160, unit: "ms" },
    { key: "modelApiLatencyMs", label: "Model API latency", min: 20, max: 500, step: 10, defaultValue: 120, unit: "ms" },
    { key: "modelResponseMs", label: "Model response", min: 300, max: 4000, step: 100, defaultValue: 1400, unit: "ms" },
    { key: "toolExecutionMs", label: "Tool execution", min: 100, max: 2000, step: 50, defaultValue: 650, unit: "ms" },
    { key: "networkLatencyMs", label: "Network latency", min: 50, max: 1000, step: 10, defaultValue: 200, unit: "ms" },
    { key: "playbackSpeed", label: "Playback speed", min: 0.5, max: 4, step: 0.5, defaultValue: 1, unit: "x" },
  ],

  zones: [
    { id: "inside-sandbox-zone", label: "Sandbox boundary", x: 720, y: 158, width: 400, height: 370, style: "sandbox" },
  ],

  metrics: [
    { id: "outsideTotal", label: "Outside total", x: 74, y: 76, tone: "warning" },
    { id: "insideTotal", label: "Inside total", x: 74, y: 142, tone: "positive" },
    { id: "boundaryOverhead", label: "Boundary cost", x: 74, y: 540, tone: "warning" },
    { id: "overheadPct", label: "Overhead", x: 74, y: 606, tone: "warning" },
  ],

  simulation: {
    kind: "agentEventFlow",
    outsideAgentNodeId: "agent-out",
    insideAgentNodeId: "agent-in",
    insideSandboxNodeId: "sandbox",
    // Outside edges (5 bidirectional paths)
    outsideUserAgentEdgeId: "e-user-agent-out",
    outsideAgentLlmEdgeId: "e-agent-out-llm",
    outsideAgentFsEdgeId: "e-agent-out-fs",
    outsideAgentShellEdgeId: "e-agent-out-shell",
    outsideShellNetEdgeId: "e-shell-out-net",
    // Inside edges (7 bidirectional paths)
    insideUserSandboxEdgeId: "e-user-sandbox",
    insideSandboxAgentEdgeId: "e-sandbox-agent-in",
    insideSandboxLlmEdgeId: "e-sandbox-llm",
    insideAgentOfsEdgeId: "e-agent-in-ofs",
    insideAgentShellEdgeId: "e-agent-in-shell",
    insideShellSandboxEdgeId: "e-shell-in-sandbox",
    insideSandboxNetEdgeId: "e-sandbox-net",
  },

  /* ── Nodes ─────────────────────────────────────────────────────────── */
  nodes: [
    // Shared
    { id: "user", kind: "source", x: 100, y: 370, width: 180, height: 78, label: "User / CLI", subtitle: "Task requester", icon: "user" },
    { id: "model-api", kind: "service", x: 640, y: 96, width: 200, height: 78, label: "LLM API", subtitle: "Model provider", icon: "controlPlane",
      fill: "#edf3ff", stroke: "#4667b4", accent: "#6f8fe1" },

    // Outside flow (left half)
    { id: "agent-out", kind: "sandbox", x: 340, y: 280, width: 210, height: 92, label: "Agent (outside)", subtitle: "Direct host access", icon: "agent",
      fill: "#f6efe7", stroke: "#8a6745", accent: "#c39b6c", showProgress: true },
    { id: "shell-out", kind: "service", x: 260, y: 490, width: 160, height: 72, label: "Shell / proc", subtitle: "Host process",
      fill: "#f6ede9", stroke: "#855544", accent: "#c17a61" },
    { id: "fs-out", kind: "db", x: 460, y: 490, width: 150, height: 72, label: "Filesystem", subtitle: "Host FS", icon: "database" },
    { id: "net-out", kind: "service", x: 340, y: 620, width: 150, height: 64, label: "Network", subtitle: "Host TCP",
      fill: "#eefbf3", stroke: "#3f7d5e", accent: "#61b184" },

    // Inside flow (right half, inside sandbox zone)
    { id: "sandbox", kind: "sandbox", x: 660, y: 370, width: 160, height: 78, label: "Sandbox", subtitle: "Container boundary",
      fill: "#fff4eb", stroke: "#b45e1f", accent: "#e0873e" },
    { id: "agent-in", kind: "sandbox", x: 880, y: 260, width: 210, height: 92, label: "Agent (inside)", subtitle: "Sandboxed access", icon: "agent",
      fill: "#edf3ff", stroke: "#4667b4", accent: "#6f8fe1", showProgress: true },
    { id: "shell-in", kind: "service", x: 800, y: 460, width: 160, height: 72, label: "Shell / proc", subtitle: "Sandboxed proc",
      fill: "#f6ede9", stroke: "#855544", accent: "#c17a61" },
    { id: "ofs-in", kind: "db", x: 1010, y: 460, width: 160, height: 72, label: "Overlay FS", subtitle: "Copy-on-write", icon: "database" },
    { id: "net-in", kind: "service", x: 1160, y: 370, width: 150, height: 64, label: "Network", subtitle: "External",
      fill: "#eefbf3", stroke: "#3f7d5e", accent: "#61b184" },

    // Hidden routing cores
    { id: "user-core", kind: "source", x: 190, y: 370, width: 2, height: 2, label: "c", hidden: true },
    { id: "model-api-core", kind: "service", x: 640, y: 96, width: 2, height: 2, label: "c", hidden: true },
    { id: "agent-out-core", kind: "sandbox", x: 340, y: 280, width: 2, height: 2, label: "c", hidden: true },
    { id: "shell-out-core", kind: "service", x: 260, y: 490, width: 2, height: 2, label: "c", hidden: true },
    { id: "fs-out-core", kind: "db", x: 460, y: 490, width: 2, height: 2, label: "c", hidden: true },
    { id: "net-out-core", kind: "service", x: 340, y: 620, width: 2, height: 2, label: "c", hidden: true },
    { id: "sandbox-core", kind: "sandbox", x: 660, y: 370, width: 2, height: 2, label: "c", hidden: true },
    { id: "agent-in-core", kind: "sandbox", x: 880, y: 260, width: 2, height: 2, label: "c", hidden: true },
    { id: "shell-in-core", kind: "service", x: 800, y: 460, width: 2, height: 2, label: "c", hidden: true },
    { id: "ofs-in-core", kind: "db", x: 1010, y: 460, width: 2, height: 2, label: "c", hidden: true },
    { id: "net-in-core", kind: "service", x: 1160, y: 370, width: 2, height: 2, label: "c", hidden: true },
  ],

  /* ── Edges (bidirectional via progress inversion in simulation) ──── */
  edges: [
    // Outside flow
    { id: "e-user-agent-out", from: "user", to: "agent-out-core", route: "smooth" },
    { id: "e-agent-out-llm", from: "agent-out", to: "model-api-core", route: "smooth" },
    { id: "e-agent-out-fs", from: "agent-out", to: "fs-out-core", route: "smooth" },
    { id: "e-agent-out-shell", from: "agent-out", to: "shell-out-core", route: "straight" },
    { id: "e-shell-out-net", from: "shell-out", to: "net-out-core", route: "straight" },
    // Inside flow
    { id: "e-user-sandbox", from: "user", to: "sandbox-core", route: "smooth" },
    { id: "e-sandbox-agent-in", from: "sandbox", to: "agent-in-core", route: "smooth" },
    { id: "e-sandbox-llm", from: "sandbox", to: "model-api-core", route: "smooth" },
    { id: "e-agent-in-ofs", from: "agent-in", to: "ofs-in-core", route: "smooth" },
    { id: "e-agent-in-shell", from: "agent-in", to: "shell-in-core", route: "straight" },
    { id: "e-shell-in-sandbox", from: "shell-in", to: "sandbox-core", route: "smooth" },
    { id: "e-sandbox-net", from: "sandbox", to: "net-in-core", route: "smooth" },
  ],

  // Events and effects are generated dynamically by the simulation
  events: [],
  effects: [],
});
