import { timingPresets } from "./presets";
import type { ComputedScene } from "./layout";
import type { EventDef } from "./schema";

export type PlaybackSnapshot = {
  timeMs: number;
  loopedTimeMs: number;
  activeEvents: Array<
    EventDef & {
      progress: number;
      edgePath: string;
    }
  >;
  nodeActivity: Record<string, number>;
  nodeProgress: Record<string, number>;
  nodeProgressOpacity: Record<string, number>;
  nodeStatus: Record<string, string | undefined>;
  nodeVisibility: Record<string, boolean>;
  edgeVisibility: Record<string, boolean>;
  emphasizedEdges: Record<string, number>;
};

function normalizeTime(timeMs: number, durationMs: number) {
  if (durationMs <= 0) {
    return 0;
  }

  return ((timeMs % durationMs) + durationMs) % durationMs;
}

function progressForEvent(event: EventDef, loopedTimeMs: number) {
  const endMs = event.startMs + event.durationMs;
  if (loopedTimeMs < event.startMs || loopedTimeMs > endMs) {
    return null;
  }

  return (loopedTimeMs - event.startMs) / event.durationMs;
}

function getEffectiveNodeVisibility(nodeId: string, nodeVisibility: Record<string, boolean>) {
  if (nodeId.endsWith("-core")) {
    const parentId = nodeId.slice(0, -5);
    if (parentId in nodeVisibility) {
      return nodeVisibility[parentId];
    }
  }

  return nodeVisibility[nodeId] ?? true;
}

export function getPlaybackSnapshot(scene: ComputedScene, timeMs: number): PlaybackSnapshot {
  const loopedTimeMs = normalizeTime(timeMs, scene.meta.durationMs);
  const nodeActivity: Record<string, number> = {};
  const nodeProgress: Record<string, number> = {};
  const nodeProgressOpacity: Record<string, number> = {};
  const nodeStatus: Record<string, string | undefined> = {};
  const nodeVisibility: Record<string, boolean> = Object.fromEntries(scene.nodes.map((node) => [node.id, true]));
  const edgeVisibility: Record<string, boolean> = Object.fromEntries(scene.edges.map((edge) => [edge.id, true]));
  const emphasizedEdges: Record<string, number> = {};

  for (const effect of scene.effects) {
    const isActive = loopedTimeMs >= effect.startMs && loopedTimeMs <= effect.endMs;
    if (!isActive) {
      continue;
    }

    const windowProgress = (loopedTimeMs - effect.startMs) / Math.max(1, effect.endMs - effect.startMs);
    const wave = Math.sin(windowProgress * Math.PI);
    const intensity = wave * effect.intensity;

    if (effect.kind === "nodePresence" && effect.nodeId) {
      nodeVisibility[effect.nodeId] = true;
      nodeActivity[effect.nodeId] = Math.max(nodeActivity[effect.nodeId] ?? 0, intensity);
    }

    if (effect.kind === "nodePulse" && effect.nodeId) {
      nodeActivity[effect.nodeId] = Math.max(nodeActivity[effect.nodeId] ?? 0, intensity);
    }

    if (effect.kind === "nodeProgress" && effect.nodeId) {
      nodeProgress[effect.nodeId] = Math.max(nodeProgress[effect.nodeId] ?? 0, windowProgress * effect.intensity);
      nodeProgressOpacity[effect.nodeId] = 1;
    }

    if (effect.kind === "nodeStatus" && effect.nodeId && effect.statusLabel) {
      nodeStatus[effect.nodeId] = effect.statusLabel;
    }

    if (effect.kind === "edgeEmphasis" && effect.edgeId) {
      emphasizedEdges[effect.edgeId] = Math.max(emphasizedEdges[effect.edgeId] ?? 0, intensity);
    }
  }

  for (const node of scene.nodes) {
    const presenceEffects = scene.effects.filter(
      (effect) => effect.kind === "nodePresence" && effect.nodeId === node.id,
    );
    const progressEffect = scene.effects.find(
      (effect) => effect.kind === "nodeProgress" && effect.nodeId === node.id,
    );
    const progressEffects = scene.effects.filter(
      (effect) => effect.kind === "nodeProgress" && effect.nodeId === node.id,
    );

    if (presenceEffects.length > 0) {
      nodeVisibility[node.id] = presenceEffects.some(
        (effect) => loopedTimeMs >= effect.startMs && loopedTimeMs <= effect.endMs,
      );
    }

    if (
      progressEffect &&
      presenceEffects.length > 0 &&
      loopedTimeMs > progressEffect.endMs &&
      presenceEffects.some((effect) => loopedTimeMs <= effect.endMs)
    ) {
      nodeProgress[node.id] = 1;
      nodeProgressOpacity[node.id] = 1;
    }

    if ((nodeStatus[node.id] ?? "") === "Waiting") {
      const holdWindowMs = 180;
      const fadeWindowMs = 220;
      const recentProgress = progressEffects.find(
        (effect) => loopedTimeMs > effect.endMs && loopedTimeMs <= effect.endMs + holdWindowMs + fadeWindowMs,
      );

      if (recentProgress) {
        nodeProgress[node.id] = 1;
        if (loopedTimeMs <= recentProgress.endMs + holdWindowMs) {
          nodeProgressOpacity[node.id] = 1;
        } else {
          const fadeProgress = (loopedTimeMs - recentProgress.endMs - holdWindowMs) / fadeWindowMs;
          nodeProgressOpacity[node.id] = 1 - fadeProgress;
        }
      }
    }
  }

  for (const edge of scene.edges) {
    const fromVisible = getEffectiveNodeVisibility(edge.from, nodeVisibility);
    const toVisible = getEffectiveNodeVisibility(edge.to, nodeVisibility);
    edgeVisibility[edge.id] = fromVisible && toVisible;
  }

  const activeEvents = scene.events.flatMap((event) => {
    const progress = progressForEvent(event, loopedTimeMs);
    if (progress === null) {
      return [];
    }

    const edge = scene.edgesById[event.edgeId];
    if (!edge) {
      return [];
    }

    const arrivalWindow = Math.max(160, Math.min(timingPresets.pulseWindow, event.durationMs * 0.22));
    if (loopedTimeMs >= event.startMs + event.durationMs - arrivalWindow) {
      nodeActivity[edge.to] = Math.max(
        nodeActivity[edge.to] ?? 0,
        1 - (event.startMs + event.durationMs - loopedTimeMs) / arrivalWindow,
      );
    }

    emphasizedEdges[event.edgeId] = Math.max(
      emphasizedEdges[event.edgeId] ?? 0,
      Math.sin(progress * Math.PI),
    );

    return [{ ...event, progress, edgePath: edge.path }];
  });

  return {
    timeMs,
    loopedTimeMs,
    activeEvents,
    nodeActivity,
    nodeProgress,
    nodeProgressOpacity,
    nodeStatus,
    nodeVisibility,
    edgeVisibility,
    emphasizedEdges,
  };
}
