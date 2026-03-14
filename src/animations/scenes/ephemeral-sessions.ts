import { defineScene } from "../schema";

export const ephemeralSessionsScene = defineScene({
  meta: {
    id: "ephemeral-sessions",
    title: "Ephemeral Sessions",
    description:
      "Events arrive from multiple sources, trigger disposable agent sandboxes, show in-flight work, and disappear after completion.",
    durationMs: 7600,
    viewport: { width: 1280, height: 720, padding: 56 },
  },
  nodes: [
    { id: "user-source", kind: "source", x: 230, y: 230, width: 244, height: 96, label: "User Input", subtitle: "Prompt or task", icon: "user" },
    { id: "api-source", kind: "source", x: 230, y: 450, width: 244, height: 96, label: "System Events", subtitle: "Automated triggers", icon: "webhook" },
    { id: "control-plane", kind: "service", x: 555, y: 340, width: 232, height: 112, label: "Control Plane", subtitle: "Routes work", icon: "controlPlane" },
    { id: "sandbox-a", kind: "sandbox", x: 885, y: 230, width: 232, height: 112, label: "Sandbox A", icon: "agent" },
    { id: "sandbox-b", kind: "sandbox", x: 885, y: 450, width: 232, height: 112, label: "Sandbox B", icon: "agent" },
    { id: "control-plane-core", kind: "service", x: 555, y: 340, width: 2, height: 2, label: "Control Plane Core", hidden: true },
    { id: "sandbox-a-core", kind: "sandbox", x: 885, y: 230, width: 2, height: 2, label: "Sandbox A Core", hidden: true },
    { id: "sandbox-b-core", kind: "sandbox", x: 885, y: 450, width: 2, height: 2, label: "Sandbox B Core", hidden: true },
  ],
  edges: [
    { id: "user-to-control", from: "user-source", to: "control-plane-core", route: "smooth" },
    { id: "api-to-control", from: "api-source", to: "control-plane-core", route: "smooth" },
    { id: "control-to-a", from: "control-plane", to: "sandbox-a-core", route: "smooth" },
    { id: "control-to-b", from: "control-plane", to: "sandbox-b-core", route: "smooth" },
  ],
  events: [
    { id: "task-1", edgeId: "user-to-control", startMs: 0, durationMs: 760, style: "message", status: "ok" },
    { id: "spawn-a", edgeId: "control-to-a", startMs: 1620, durationMs: 620, style: "message", status: "ok" },
    { id: "task-2", edgeId: "api-to-control", startMs: 1450, durationMs: 820, style: "message", status: "ok" },
    { id: "spawn-b", edgeId: "control-to-b", startMs: 3130, durationMs: 620, style: "message", status: "ok" },
  ],
  effects: [
    { id: "control-intake-user", kind: "edgeEmphasis", edgeId: "user-to-control", startMs: 0, endMs: 920, intensity: 0.8 },
    { id: "control-intake-api", kind: "edgeEmphasis", edgeId: "api-to-control", startMs: 1450, endMs: 2360, intensity: 0.8 },
    { id: "control-pulse-a", kind: "nodePulse", nodeId: "control-plane", startMs: 640, endMs: 1240, intensity: 0.55 },
    { id: "control-pulse-b", kind: "nodePulse", nodeId: "control-plane", startMs: 2090, endMs: 2710, intensity: 0.55 },
    { id: "sandbox-a-presence", kind: "nodePresence", nodeId: "sandbox-a", startMs: 1320, endMs: 3740, intensity: 0.95 },
    { id: "sandbox-a-status-initializing", kind: "nodeStatus", nodeId: "sandbox-a", statusLabel: "Initializing", startMs: 1320, endMs: 2060, intensity: 1 },
    { id: "sandbox-a-status-processing", kind: "nodeStatus", nodeId: "sandbox-a", statusLabel: "Processing", startMs: 2060, endMs: 3380, intensity: 1 },
    { id: "sandbox-a-status-complete", kind: "nodeStatus", nodeId: "sandbox-a", statusLabel: "Complete", startMs: 3380, endMs: 3740, intensity: 1 },
    { id: "sandbox-a-progress", kind: "nodeProgress", nodeId: "sandbox-a", startMs: 2060, endMs: 3380, intensity: 1 },
    { id: "sandbox-b-presence", kind: "nodePresence", nodeId: "sandbox-b", startMs: 2830, endMs: 5260, intensity: 0.95 },
    { id: "sandbox-b-status-initializing", kind: "nodeStatus", nodeId: "sandbox-b", statusLabel: "Initializing", startMs: 2830, endMs: 3570, intensity: 1 },
    { id: "sandbox-b-status-processing", kind: "nodeStatus", nodeId: "sandbox-b", statusLabel: "Processing", startMs: 3570, endMs: 4900, intensity: 1 },
    { id: "sandbox-b-status-complete", kind: "nodeStatus", nodeId: "sandbox-b", statusLabel: "Complete", startMs: 4900, endMs: 5260, intensity: 1 },
    { id: "sandbox-b-progress", kind: "nodeProgress", nodeId: "sandbox-b", startMs: 3570, endMs: 4900, intensity: 1 },
  ],
});
