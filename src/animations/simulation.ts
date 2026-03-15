import type { EventDef, Scene, SimulationDef } from "./schema";

type InsideOutsideSimulation = {
  kind: "insideOutsideComparison";
  outsideNodeId: string;
  insideNodeId: string;
  outsideModelNodeId: string;
  insideModelNodeId: string;
  outsideEntryEdgeId: string;
  insideEntryEdgeId: string;
  outsideModelCallEdgeId: string;
  outsideModelResultEdgeId: string;
  insideModelCallEdgeId: string;
  insideModelResultEdgeId: string;
  outsideToolCallEdgeId: string;
  outsideToolResultEdgeId: string;
  insideToolCallEdgeId: string;
  insideToolResultEdgeId: string;
};

export type SimulationControls = Record<string, number>;

export type SimulationSnapshot = {
  durationMs: number;
  loopedTimeMs: number;
  metrics: Record<string, string>;
  nodeProgress: Record<string, number>;
  nodeProgressOpacity: Record<string, number>;
  nodeStatus: Record<string, string | undefined>;
  nodeActivity: Record<string, number>;
  nodeResidency: Record<
    string,
    | {
        style: EventDef["style"];
        label?: string;
        slot?: "left" | "right" | "center";
      }
    | undefined
  >;
  activeEvents: Array<
    EventDef & {
      progress: number;
      edgePath: string;
    }
  >;
  timelineSteps: Array<{
    id: string;
    from: string;
    to: string;
    label: string;
    note?: string;
    color: string;
    startMs: number;
    endMs: number;
  }>;
  activeStepId?: string;
  emphasizedEdges: Record<string, number>;
};

type LoopSegment = {
  toolCallStartMs: number;
  toolResultStartMs: number;
  modelCallStartMs: number;
  modelResultStartMs: number;
  loopEndMs: number;
};

function formatMs(ms: number) {
  return ms >= 1000 ? `${(ms / 1000).toFixed(1)}s` : `${Math.round(ms)}ms`;
}

function formatPercent(value: number) {
  return `${Math.round(value)}%`;
}

function normalizeTime(timeMs: number, durationMs: number) {
  if (durationMs <= 0) {
    return 0;
  }

  return ((timeMs % durationMs) + durationMs) % durationMs;
}

function eventProgress(startMs: number, durationMs: number, loopedTimeMs: number) {
  if (loopedTimeMs < startMs || loopedTimeMs > startMs + durationMs) {
    return null;
  }

  return (loopedTimeMs - startMs) / durationMs;
}

function styleColor(style: EventDef["style"]) {
  if (style === "stream") {
    return "#3bb273";
  }
  if (style === "warm") {
    return "#c0884a";
  }
  return "#2d8cff";
}

function buildLoopSchedule(
  startMs: number,
  toolCallCount: number,
  modelApiLatencyMs: number,
  modelResponseMs: number,
  toolExecutionMs: number,
  toolBoundaryMs: number,
  gapMs: number,
) {
  const loops: LoopSegment[] = [];
  let cursor = startMs;

  for (let index = 0; index < toolCallCount; index += 1) {
    const toolCallStartMs = cursor;
    const toolResultStartMs = toolCallStartMs + toolBoundaryMs + toolExecutionMs;
    const modelCallStartMs = toolResultStartMs + toolBoundaryMs;
    const modelResultStartMs = modelCallStartMs + modelApiLatencyMs;
    const loopEndMs = modelResultStartMs + modelResponseMs + modelApiLatencyMs;

    loops.push({ modelCallStartMs, modelResultStartMs, toolCallStartMs, toolResultStartMs, loopEndMs });
    cursor = loopEndMs + gapMs;
  }

  return { loops, processingStartMs: startMs, processingEndMs: loops.length > 0 ? loops[loops.length - 1].loopEndMs : startMs };
}

function simulateInsideOutsideComparison(
  sim: InsideOutsideSimulation,
  timeMs: number,
  edgesById: Record<string, { path: string }>,
  controls: SimulationControls,
): SimulationSnapshot {
  const sandboxBoundaryLatencyMs = controls.sandboxBoundaryLatencyMs ?? 160;
  const modelApiLatencyMs = controls.modelApiLatencyMs ?? 120;
  const modelResponseMs = controls.modelResponseMs ?? 1400;
  const toolExecutionMs = controls.toolExecutionMs ?? 650;
  const toolCallCount = controls.taskDifficulty ?? 5;

  const outsideBoundaryMs = sandboxBoundaryLatencyMs;
  const insideBoundaryMs = Math.max(8, Math.round(sandboxBoundaryLatencyMs * 0.05));
  const processingStartMs = 400;

  const outsideSchedule = buildLoopSchedule(processingStartMs, toolCallCount, modelApiLatencyMs, modelResponseMs, toolExecutionMs, outsideBoundaryMs, 120);
  const insideSchedule = buildLoopSchedule(processingStartMs, toolCallCount, modelApiLatencyMs, modelResponseMs, toolExecutionMs, insideBoundaryMs, 0);

  const outsideTotalMs = outsideSchedule.processingEndMs - processingStartMs;
  const insideTotalMs = insideSchedule.processingEndMs - processingStartMs;
  const boundaryPenaltyMs = toolCallCount * sandboxBoundaryLatencyMs * 2;
  const modelLoopMs = toolCallCount * (modelApiLatencyMs * 2 + modelResponseMs);
  const durationMs = Math.max(outsideSchedule.processingEndMs, insideSchedule.processingEndMs) + 900;
  const loopedTimeMs = normalizeTime(timeMs, durationMs);

  const nodeProgress: Record<string, number> = {};
  const nodeProgressOpacity: Record<string, number> = {};
  const nodeStatus: Record<string, string | undefined> = {};
  const nodeActivity: Record<string, number> = {};
  const nodeResidency: SimulationSnapshot["nodeResidency"] = {};
  const emphasizedEdges: Record<string, number> = {};
  const activeEvents: SimulationSnapshot["activeEvents"] = [];
  const timelineSteps: SimulationSnapshot["timelineSteps"] = [];

  const addEvent = (event: EventDef, from: string, to: string, note?: string) => {
    timelineSteps.push({
      id: event.id,
      from,
      to,
      label: event.label ?? "",
      note,
      color: styleColor(event.style),
      startMs: event.startMs,
      endMs: event.startMs + event.durationMs,
    });

    const progress = eventProgress(event.startMs, event.durationMs, loopedTimeMs);
    if (progress === null) {
      return;
    }

    const edge = edgesById[event.edgeId];
    if (!edge) {
      return;
    }

    activeEvents.push({ ...event, progress, edgePath: edge.path });
    emphasizedEdges[event.edgeId] = Math.max(emphasizedEdges[event.edgeId] ?? 0, Math.sin(progress * Math.PI));
  };

  const addResidency = (
    nodeId: string,
    style: EventDef["style"],
    startMs: number,
    endMs: number,
    label?: string,
    slot: "left" | "right" | "center" = "center",
  ) => {
    if (loopedTimeMs < startMs || loopedTimeMs > endMs) {
      return;
    }

    nodeResidency[nodeId] = { style, label, slot };
    nodeActivity[nodeId] = Math.max(nodeActivity[nodeId] ?? 0, 0.3);
  };

  const createFlow = (
    prefix: string,
    style: EventDef["style"],
    schedule: ReturnType<typeof buildLoopSchedule>,
    modelCallEdgeId: string,
    modelResultEdgeId: string,
    toolCallEdgeId: string,
    toolResultEdgeId: string,
    toolFrom: string,
    toolTo: string,
    toolNote: string,
  ) => {
    schedule.loops.forEach((loop, index) => {
      const toolTravelMs = prefix === "outside" ? outsideBoundaryMs : insideBoundaryMs;
      addEvent(
        { id: `${prefix}-tool-call-${index}`, edgeId: toolCallEdgeId, startMs: loop.toolCallStartMs, durationMs: toolTravelMs, style, status: "ok", label: `Tool call ${index + 1}` },
        toolFrom,
        toolTo,
        toolNote,
      );
      addEvent(
        { id: `${prefix}-tool-result-${index}`, edgeId: toolResultEdgeId, startMs: loop.toolResultStartMs, durationMs: toolTravelMs, style, status: "ok", label: `Tool result ${index + 1}` },
        toolTo,
        toolFrom,
      );
      addEvent(
        { id: `${prefix}-model-call-${index}`, edgeId: modelCallEdgeId, startMs: loop.modelCallStartMs, durationMs: modelApiLatencyMs, style, status: "ok", label: `Model request ${index + 1}` },
        `${prefix}-agent`,
        prefix === "outside" ? sim.outsideModelNodeId : sim.insideModelNodeId,
      );
      addEvent(
        { id: `${prefix}-model-result-${index}`, edgeId: modelResultEdgeId, startMs: loop.modelResultStartMs + modelResponseMs, durationMs: modelApiLatencyMs, style, status: "ok", label: `Model response ${index + 1}` },
        prefix === "outside" ? sim.outsideModelNodeId : sim.insideModelNodeId,
        `${prefix}-agent`,
      );

      addResidency(
        toolTo,
        style,
        loop.toolCallStartMs + toolTravelMs,
        loop.toolResultStartMs,
        "running",
        "center",
      );
      addResidency(
        prefix === "outside" ? sim.outsideModelNodeId : sim.insideModelNodeId,
        style,
        loop.modelCallStartMs + modelApiLatencyMs,
        loop.modelResultStartMs + modelResponseMs,
        "thinking",
        prefix === "outside" ? "left" : "right",
      );
    });
  };

  createFlow(
    "outside",
    "message",
    outsideSchedule,
    sim.outsideModelCallEdgeId,
    sim.outsideModelResultEdgeId,
    sim.outsideToolCallEdgeId,
    sim.outsideToolResultEdgeId,
    "outside-agent",
    "outside-tools",
    `Crosses sandbox boundary (+${sandboxBoundaryLatencyMs * 2}ms round trip).`,
  );

  createFlow(
    "inside",
    "stream",
    insideSchedule,
    sim.insideModelCallEdgeId,
    sim.insideModelResultEdgeId,
    sim.insideToolCallEdgeId,
    sim.insideToolResultEdgeId,
    "inside-agent",
    "inside-tools",
    `Runs locally inside the sandbox (+${insideBoundaryMs * 2}ms equivalent overhead).`,
  );

  timelineSteps.sort((a, b) => a.startMs - b.startMs);
  const activeStep = timelineSteps.find((step) => loopedTimeMs >= step.startMs && loopedTimeMs <= step.endMs);

  return {
    durationMs,
    loopedTimeMs,
    metrics: {
      outsideTotal: formatMs(outsideTotalMs),
      insideTotal: formatMs(insideTotalMs),
      boundaryPenalty: formatMs(boundaryPenaltyMs),
      modelLoop: formatMs(modelLoopMs),
      speedup: `${formatPercent(((outsideTotalMs - insideTotalMs) / Math.max(1, outsideTotalMs)) * 100)} faster`,
    },
    nodeProgress,
    nodeProgressOpacity,
    nodeStatus,
    nodeActivity,
    nodeResidency,
    activeEvents,
    timelineSteps,
    activeStepId: activeStep?.id,
    emphasizedEdges,
  };
}

export function simulateScene(
  scene: Scene,
  timeMs: number,
  edgesById: Record<string, { path: string }>,
  controls: SimulationControls,
): SimulationSnapshot | null {
  if (!scene.simulation) {
    return null;
  }

  if (scene.simulation.kind === "insideOutsideComparison") {
    return simulateInsideOutsideComparison(scene.simulation as unknown as InsideOutsideSimulation, timeMs, edgesById, controls);
  }

  return null;
}
