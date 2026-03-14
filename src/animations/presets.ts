import type { EventStyleKey, NodeKind } from "./schema";

export const nodePresets: Record<
  NodeKind,
  {
    width: number;
    height: number;
    fill: string;
    stroke: string;
    accent: string;
    shape: "rect" | "pill" | "cylinder" | "hex";
  }
> = {
  source: { width: 180, height: 78, fill: "#fff8ec", stroke: "#9d7340", accent: "#d8a35a", shape: "pill" },
  sandbox: { width: 184, height: 92, fill: "#eefbf3", stroke: "#3f7d5e", accent: "#61b184", shape: "rect" },
  service: { width: 164, height: 72, fill: "#f7f3ed", stroke: "#6a6050", accent: "#9d8f75", shape: "rect" },
  db: { width: 160, height: 82, fill: "#f6ede9", stroke: "#855544", accent: "#c17a61", shape: "cylinder" },
};

export const eventStyles: Record<
  EventStyleKey,
  {
    radius: number;
    fill: string;
    stroke: string;
    shape: "circle" | "diamond";
  }
> = {
  message: { radius: 6, fill: "#2d8cff", stroke: "#dbeafe", shape: "circle" },
  stream: { radius: 6, fill: "#3bb273", stroke: "#dcfce7", shape: "circle" },
  warm: { radius: 6, fill: "#c0884a", stroke: "#f6e5cf", shape: "circle" },
};

export const timingPresets = {
  pulseWindow: 380,
};
