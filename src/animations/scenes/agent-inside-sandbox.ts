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
  { key: "playbackSpeed", label: "Playback speed", min: 0.5, max: 4, step: 0.5, defaultValue: 1, unit: "x" },
];

export const agentInsideSandboxScene = defineScene({
  meta: {
    id: "agent-inside-sandbox",
    title: "Agent Inside Sandbox",
    description: "The agent, tools, and filesystem all live in the same sandbox, so tool calls stay local and only model requests cross the network boundary.",
    durationMs: 12000,
    viewport: { width: 770, height: 480, padding: 28 },
  },
  controls: [...controls],
  zones: [{ id: "inside-sandbox-zone", label: "Sandbox boundary", x: 30, y: 40, width: 400, height: 410, style: "external" }],
  metrics: [],
  simulation: {
    kind: "singleAgentFlow",
    mode: "inside",
    agentNodeId: "agent",
    modelNodeId: "model-api",
    toolsNodeId: "tools",
    entryEdgeId: "agent-to-model",
    modelCallEdgeId: "agent-to-model",
    modelResultEdgeId: "model-to-agent",
    toolCallEdgeId: "agent-to-tools",
    toolResultEdgeId: "tools-to-agent",
  },
  nodes: [
    { id: "agent", kind: "sandbox", x: 230, y: 155, width: 320, height: 132, label: "🤖 Agent (Inside Sandbox)", fill: "#eefbf3", stroke: "#3f7d5e", accent: "#61b184", showProgress: false },
    { id: "model-api", kind: "service", x: 605, y: 155, width: 260, height: 110, label: "Model Provider API", subtitle: "" },
    { id: "tools", kind: "service", x: 230, y: 355, width: 210, height: 120, label: "Tools + FS", subtitle: "" },
  ],
  edges: [
    { id: "agent-to-model", from: "agent", to: "model-api", route: "straight" },
    { id: "model-to-agent", from: "model-api", to: "agent", route: "straight" },
    { id: "agent-to-tools", from: "agent", to: "tools", route: "straight" },
    { id: "tools-to-agent", from: "tools", to: "agent", route: "straight" },
  ],
  events: [],
  effects: [],
});
