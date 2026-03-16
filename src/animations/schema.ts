import { z } from "zod";

export const viewportSchema = z.object({
  width: z.number().positive(),
  height: z.number().positive(),
  padding: z.number().nonnegative().default(48),
});

export const nodeKindSchema = z.enum([
  "source",
  "sandbox",
  "service",
  "db",
]);

export const edgeRouteSchema = z.enum(["straight", "smooth", "elbow"]);
export const nodeIconSchema = z.enum(["user", "webhook", "agent", "controlPlane", "database"]);

export const eventStatusSchema = z.enum(["ok"]);
export const eventStyleSchema = z.enum(["message", "stream", "warm", "hybrid"]);
export const effectKindSchema = z.enum(["nodePulse", "nodePresence", "nodeProgress", "nodeStatus", "edgeEmphasis"]);

export const controlDefSchema = z.object({
  key: z.string().min(1),
  label: z.string().min(1),
  min: z.number(),
  max: z.number(),
  step: z.number().positive(),
  defaultValue: z.number(),
  unit: z.string().optional(),
  options: z
    .array(
      z.object({
        label: z.string().min(1),
        value: z.number(),
      }),
    )
    .optional(),
  ranges: z
    .array(
      z.object({
        label: z.string().min(1),
        min: z.number(),
        max: z.number(),
      }),
    )
    .optional(),
});

export const zoneDefSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1).optional(),
  x: z.number(),
  y: z.number(),
  width: z.number().positive(),
  height: z.number().positive(),
  style: z.enum(["sandbox", "external", "neutral", "hybrid"]).default("neutral"),
});

export const metricDefSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  x: z.number(),
  y: z.number(),
  tone: z.enum(["default", "positive", "warning"]).default("default"),
});

const insideOutsideComparisonSimSchema = z.object({
  kind: z.literal("insideOutsideComparison"),
  outsideNodeId: z.string().min(1),
  insideNodeId: z.string().min(1),
  outsideModelNodeId: z.string().min(1),
  insideModelNodeId: z.string().min(1),
  outsideEntryEdgeId: z.string().min(1),
  insideEntryEdgeId: z.string().min(1),
  outsideModelCallEdgeId: z.string().min(1),
  outsideModelResultEdgeId: z.string().min(1),
  insideModelCallEdgeId: z.string().min(1),
  insideModelResultEdgeId: z.string().min(1),
  outsideToolCallEdgeId: z.string().min(1),
  outsideToolResultEdgeId: z.string().min(1),
  insideToolCallEdgeId: z.string().min(1),
  insideToolResultEdgeId: z.string().min(1),
});

const singleAgentFlowSimSchema = z.object({
  kind: z.literal("singleAgentFlow"),
  mode: z.enum(["outside", "inside"]),
  agentNodeId: z.string().min(1),
  modelNodeId: z.string().min(1),
  toolsNodeId: z.string().min(1),
  entryEdgeId: z.string().min(1),
  modelCallEdgeId: z.string().min(1),
  modelResultEdgeId: z.string().min(1),
  toolCallEdgeId: z.string().min(1),
  toolResultEdgeId: z.string().min(1),
});

const hybridAgentFlowSimSchema = z.object({
  kind: z.literal("hybridAgentFlow"),
  agentNodeId: z.string().min(1),
  modelNodeId: z.string().min(1),
  safeToolsNodeId: z.string().min(1),
  riskyToolsNodeId: z.string().min(1),
  modelCallEdgeId: z.string().min(1),
  modelResultEdgeId: z.string().min(1),
  safeToolCallEdgeId: z.string().min(1),
  safeToolResultEdgeId: z.string().min(1),
  riskyToolCallEdgeId: z.string().min(1),
  riskyToolResultEdgeId: z.string().min(1),
});

export const simulationDefSchema = z.discriminatedUnion("kind", [insideOutsideComparisonSimSchema, singleAgentFlowSimSchema, hybridAgentFlowSimSchema]);

export const nodeDefSchema = z.object({
  id: z.string().min(1),
  kind: nodeKindSchema,
  x: z.number(),
  y: z.number(),
  label: z.string().min(1),
  icon: nodeIconSchema.optional(),
  hidden: z.boolean().default(false),
  fill: z.string().optional(),
  stroke: z.string().optional(),
  accent: z.string().optional(),
  showProgress: z.boolean().optional(),
  width: z.number().positive().optional(),
  height: z.number().positive().optional(),
  subtitle: z.string().optional(),
});

export const edgeDefSchema = z.object({
  id: z.string().min(1),
  from: z.string().min(1),
  to: z.string().min(1),
  route: edgeRouteSchema.default("smooth"),
  label: z.string().optional(),
});

export const eventDefSchema = z.object({
  id: z.string().min(1),
  edgeId: z.string().min(1),
  startMs: z.number().nonnegative(),
  durationMs: z.number().positive(),
  payloadType: z.string().optional(),
  status: eventStatusSchema.default("ok"),
  style: eventStyleSchema.default("message"),
  label: z.string().optional(),
});

export const effectDefSchema = z.object({
  id: z.string().min(1),
  kind: effectKindSchema,
  nodeId: z.string().optional(),
  edgeId: z.string().optional(),
  statusLabel: z.string().optional(),
  startMs: z.number().nonnegative(),
  endMs: z.number().nonnegative(),
  intensity: z.number().min(0).max(1).default(1),
});

export const sceneSchema = z.object({
  meta: z.object({
    id: z.string().min(1),
    title: z.string().min(1),
    description: z.string().min(1),
    durationMs: z.number().positive(),
    viewport: viewportSchema,
  }),
  nodes: z.array(nodeDefSchema).min(1),
  edges: z.array(edgeDefSchema).min(1),
  controls: z.array(controlDefSchema).default([]),
  zones: z.array(zoneDefSchema).default([]),
  metrics: z.array(metricDefSchema).default([]),
  simulation: simulationDefSchema.optional(),
  events: z.array(eventDefSchema).default([]),
  effects: z.array(effectDefSchema).default([]),
});

export type ViewportDef = z.infer<typeof viewportSchema>;
export type NodeKind = z.infer<typeof nodeKindSchema>;
export type EdgeRoute = z.infer<typeof edgeRouteSchema>;
export type NodeIcon = z.infer<typeof nodeIconSchema>;
export type EventStatus = z.infer<typeof eventStatusSchema>;
export type EventStyleKey = z.infer<typeof eventStyleSchema>;
export type EffectKind = z.infer<typeof effectKindSchema>;
export type ControlDef = z.infer<typeof controlDefSchema>;
export type ZoneDef = z.infer<typeof zoneDefSchema>;
export type MetricDef = z.infer<typeof metricDefSchema>;
export type SimulationDef = z.infer<typeof simulationDefSchema>;
export type NodeDef = z.infer<typeof nodeDefSchema>;
export type EdgeDef = z.infer<typeof edgeDefSchema>;
export type EventDef = z.infer<typeof eventDefSchema>;
export type EffectDef = z.infer<typeof effectDefSchema>;
export type Scene = z.infer<typeof sceneSchema>;

export function defineScene(scene: Scene): Scene {
  return sceneSchema.parse(scene);
}
