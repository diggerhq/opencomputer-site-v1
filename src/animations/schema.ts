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
export const eventStyleSchema = z.enum(["message", "stream", "warm"]);
export const effectKindSchema = z.enum(["nodePulse", "nodePresence", "nodeProgress", "nodeStatus", "edgeEmphasis"]);

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
export type NodeDef = z.infer<typeof nodeDefSchema>;
export type EdgeDef = z.infer<typeof edgeDefSchema>;
export type EventDef = z.infer<typeof eventDefSchema>;
export type EffectDef = z.infer<typeof effectDefSchema>;
export type Scene = z.infer<typeof sceneSchema>;

export function defineScene(scene: Scene): Scene {
  return sceneSchema.parse(scene);
}
