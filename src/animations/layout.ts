import { path as createPath } from "d3-path";
import { nodePresets } from "./presets";
import type { EdgeDef, NodeDef, Scene } from "./schema";

export type NodeGeometry = NodeDef & {
  width: number;
  height: number;
  left: number;
  right: number;
  top: number;
  bottom: number;
  cx: number;
  cy: number;
};

export type ComputedEdge = EdgeDef & {
  path: string;
  length: number;
  start: { x: number; y: number };
  end: { x: number; y: number };
  pointAt: (progress: number) => { x: number; y: number };
};

export type ComputedScene = {
  meta: Scene["meta"];
  events: Scene["events"];
  effects: Scene["effects"];
  nodeMap: Record<string, NodeGeometry>;
  nodes: NodeGeometry[];
  edges: ComputedEdge[];
  edgesById: Record<string, ComputedEdge>;
};

function withGeometry(node: NodeDef): NodeGeometry {
  const preset = nodePresets[node.kind];
  const width = node.width ?? preset.width;
  const height = node.height ?? preset.height;

  return {
    ...node,
    width,
    height,
    left: node.x - width / 2,
    right: node.x + width / 2,
    top: node.y - height / 2,
    bottom: node.y + height / 2,
    cx: node.x,
    cy: node.y,
  };
}

function sampleQuadraticLength(
  start: { x: number; y: number },
  control: { x: number; y: number },
  end: { x: number; y: number },
  samples = 28,
): number {
  let length = 0;
  let previous = start;

  for (let index = 1; index <= samples; index += 1) {
    const t = index / samples;
    const point = {
      x: (1 - t) * (1 - t) * start.x + 2 * (1 - t) * t * control.x + t * t * end.x,
      y: (1 - t) * (1 - t) * start.y + 2 * (1 - t) * t * control.y + t * t * end.y,
    };
    length += Math.hypot(point.x - previous.x, point.y - previous.y);
    previous = point;
  }

  return length;
}

function resolveAnchors(from: NodeGeometry, to: NodeGeometry) {
  if (from.hidden || to.hidden) {
    return {
      start: from.hidden ? { x: from.cx, y: from.cy } : resolveAnchors(from, { ...to, hidden: false }).start,
      end: to.hidden ? { x: to.cx, y: to.cy } : resolveAnchors({ ...from, hidden: false }, to).end,
    };
  }

  const dx = to.cx - from.cx;
  const dy = to.cy - from.cy;

  if (Math.abs(dx) >= Math.abs(dy)) {
    return dx >= 0
      ? { start: { x: from.right, y: from.cy }, end: { x: to.left, y: to.cy } }
      : { start: { x: from.left, y: from.cy }, end: { x: to.right, y: to.cy } };
  }

  return dy >= 0
    ? { start: { x: from.cx, y: from.bottom }, end: { x: to.cx, y: to.top } }
    : { start: { x: from.cx, y: from.top }, end: { x: to.cx, y: to.bottom } };
}

function buildEdge(edge: EdgeDef, from: NodeGeometry, to: NodeGeometry): ComputedEdge {
  const anchors = resolveAnchors(from, to);
  const drawing = createPath();
  drawing.moveTo(anchors.start.x, anchors.start.y);

  let length = 0;

  if (edge.route === "straight") {
    drawing.lineTo(anchors.end.x, anchors.end.y);
    length = Math.hypot(anchors.end.x - anchors.start.x, anchors.end.y - anchors.start.y);

    const pointAt = (progress: number) => ({
      x: anchors.start.x + (anchors.end.x - anchors.start.x) * progress,
      y: anchors.start.y + (anchors.end.y - anchors.start.y) * progress,
    });

    return {
      ...edge,
      start: anchors.start,
      end: anchors.end,
      path: drawing.toString(),
      length,
      pointAt,
    };
  } else if (edge.route === "elbow") {
    const midX = anchors.start.x + (anchors.end.x - anchors.start.x) * 0.5;
    drawing.lineTo(midX, anchors.start.y);
    drawing.lineTo(midX, anchors.end.y);
    drawing.lineTo(anchors.end.x, anchors.end.y);
    length =
      Math.abs(midX - anchors.start.x) +
      Math.abs(anchors.end.y - anchors.start.y) +
      Math.abs(anchors.end.x - midX);

    const first = Math.abs(midX - anchors.start.x);
    const second = Math.abs(anchors.end.y - anchors.start.y);
    const pointAt = (progress: number) => {
      const distance = length * progress;
      if (distance <= first) {
        return { x: anchors.start.x + Math.sign(midX - anchors.start.x || 1) * distance, y: anchors.start.y };
      }

      if (distance <= first + second) {
        return {
          x: midX,
          y: anchors.start.y + Math.sign(anchors.end.y - anchors.start.y || 1) * (distance - first),
        };
      }

      return {
        x: midX + Math.sign(anchors.end.x - midX || 1) * (distance - first - second),
        y: anchors.end.y,
      };
    };

    return {
      ...edge,
      start: anchors.start,
      end: anchors.end,
      path: drawing.toString(),
      length,
      pointAt,
    };
  } else {
    const dx = anchors.end.x - anchors.start.x;
    const dy = anchors.end.y - anchors.start.y;
    const control = {
      x: anchors.start.x + dx * 0.5,
      y: anchors.start.y + dy * 0.5 - Math.sign(dy || 1) * Math.min(90, Math.abs(dx) * 0.15),
    };
    drawing.quadraticCurveTo(control.x, control.y, anchors.end.x, anchors.end.y);
    length = sampleQuadraticLength(anchors.start, control, anchors.end);

    const pointAt = (progress: number) => {
      const t = Math.max(0, Math.min(1, progress));
      return {
        x: (1 - t) * (1 - t) * anchors.start.x + 2 * (1 - t) * t * control.x + t * t * anchors.end.x,
        y: (1 - t) * (1 - t) * anchors.start.y + 2 * (1 - t) * t * control.y + t * t * anchors.end.y,
      };
    };

    return {
      ...edge,
      start: anchors.start,
      end: anchors.end,
      path: drawing.toString(),
      length,
      pointAt,
    };
  }
}

export function computeScene(scene: Scene): ComputedScene {
  const nodes = scene.nodes.map(withGeometry);
  const nodeMap = Object.fromEntries(nodes.map((node) => [node.id, node]));
  const edges = scene.edges.map((edge) => buildEdge(edge, nodeMap[edge.from], nodeMap[edge.to]));

  return {
    meta: scene.meta,
    events: scene.events,
    effects: scene.effects,
    nodes,
    nodeMap,
    edges,
    edgesById: Object.fromEntries(edges.map((edge) => [edge.id, edge])),
  };
}
