import { defineScene } from "../schema";

const controls = [
  { key: "sandboxBoundaryLatencyMs", label: "Sandbox boundary", min: 20, max: 500, step: 10, defaultValue: 160, unit: "ms" },
  { key: "modelApiLatencyMs", label: "Model API latency", min: 20, max: 500, step: 10, defaultValue: 120, unit: "ms" },
  { key: "modelResponseMs", label: "Model response", min: 300, max: 4000, step: 100, defaultValue: 1400, unit: "ms" },
  { key: "toolExecutionMs", label: "Tool execution", min: 100, max: 2000, step: 50, defaultValue: 650, unit: "ms" },
  {
    key: "taskDifficulty",
    label: "Tool calls per task",
    min: 5,
    max: 300,
    step: 5,
    defaultValue: 30,
    ranges: [
      { label: "Easy", min: 5, max: 15 },
      { label: "Medium", min: 15, max: 40 },
      { label: "Difficult", min: 40, max: 100 },
      { label: "Very difficult", min: 100, max: 300 },
    ],
  },
  { key: "safeToolPercent", label: "Safe tool calls (%)", min: 0, max: 100, step: 10, defaultValue: 60, unit: "%" },
  { key: "playbackSpeed", label: "Playback speed", min: 0.5, max: 4, step: 0.5, defaultValue: 1, unit: "x" },
];

export const agentHybridSandboxScene = defineScene({
  meta: {
    id: "agent-hybrid-sandbox",
    title: "Agent Hybrid Sandbox",
    description:
      "Safe tool calls stay local with the agent, while risky tool calls are routed into the sandbox for isolated execution.",
    durationMs: 12000,
    viewport: { width: 770, height: 480, padding: 28 },
  },
  controls: [...controls],
  zones: [
    { id: "safe-zone", label: "Agent environment", x: 30, y: 40, width: 400, height: 410, style: "hybrid" },
    { id: "risky-zone", label: "Sandbox boundary", x: 465, y: 250, width: 280, height: 200, style: "sandbox" },
  ],
  metrics: [],
  simulation: {
    kind: "hybridAgentFlow",
    agentNodeId: "agent",
    modelNodeId: "model-api",
    safeToolsNodeId: "safe-tools",
    riskyToolsNodeId: "risky-tools",
    modelCallEdgeId: "agent-to-model",
    modelResultEdgeId: "model-to-agent",
    safeToolCallEdgeId: "agent-to-safe-tools",
    safeToolResultEdgeId: "safe-tools-to-agent",
    riskyToolCallEdgeId: "agent-to-risky-tools",
    riskyToolResultEdgeId: "risky-tools-to-agent",
  },
  nodes: [
    { id: "agent", kind: "sandbox", x: 230, y: 155, width: 320, height: 132, label: "🤖 Agent (Hybrid)", fill: "#f5f0ff", stroke: "#7c3aed", accent: "#a78bfa", showProgress: false },
    { id: "model-api", kind: "service", x: 605, y: 155, width: 260, height: 110, label: "Model Provider API", subtitle: "" },
    { id: "safe-tools", kind: "service", x: 230, y: 355, width: 210, height: 120, label: "\"Safe\" Tools + FS", subtitle: "" },
    { id: "risky-tools", kind: "service", x: 605, y: 355, width: 210, height: 120, label: "\"Risky\" Tools + FS", subtitle: "" },
  ],
  edges: [
    { id: "agent-to-model", from: "agent", to: "model-api", route: "straight" },
    { id: "model-to-agent", from: "model-api", to: "agent", route: "straight" },
    { id: "agent-to-safe-tools", from: "agent", to: "safe-tools", route: "straight" },
    { id: "safe-tools-to-agent", from: "safe-tools", to: "agent", route: "straight" },
    { id: "agent-to-risky-tools", from: "agent", to: "risky-tools", route: "straight" },
    { id: "risky-tools-to-agent", from: "risky-tools", to: "agent", route: "straight" },
  ],
  events: [],
  effects: [],
});
