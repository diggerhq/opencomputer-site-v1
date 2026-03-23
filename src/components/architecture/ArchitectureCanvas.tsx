import { AnimatePresence } from "framer-motion";
import { computeScene, type ComputedScene } from "@/animations/layout";
import { getPlaybackSnapshot } from "@/animations/playback";
import type { SimulationSnapshot } from "@/animations/simulation";
import type { Scene } from "@/animations/schema";
import ArchitectureEdge from "./ArchitectureEdge";
import ArchitectureNode from "./ArchitectureNode";
import EventParticle from "./EventParticle";
import MetricOverlay from "./MetricOverlay";
import ZoneLayer from "./ZoneLayer";

type ArchitectureCanvasProps = {
  scene: Scene;
  timeMs: number;
  simulation?: SimulationSnapshot | null;
};

export default function ArchitectureCanvas({ scene, timeMs, simulation }: ArchitectureCanvasProps) {
  const computedScene: ComputedScene = computeScene(scene);
  const snapshot = getPlaybackSnapshot(computedScene, timeMs, simulation);

  return (
    <div className="overflow-hidden rounded-[28px] border border-border/70 bg-[radial-gradient(circle_at_top_left,_rgba(255,247,237,0.95),_rgba(247,243,237,0.85)_35%,_rgba(240,234,225,0.95)_100%)] shadow-[0_24px_80px_rgba(60,41,16,0.12)]">
      <svg viewBox={`0 0 ${scene.meta.viewport.width} ${scene.meta.viewport.height}`} className="h-auto w-full">
        <defs>
          <pattern id="grid" width="36" height="36" patternUnits="userSpaceOnUse">
            <path d="M 36 0 L 0 0 0 36" fill="none" stroke="rgba(140, 122, 97, 0.08)" strokeWidth="1" />
          </pattern>
        </defs>

        <rect width={scene.meta.viewport.width} height={scene.meta.viewport.height} fill="url(#grid)" />

        {scene.zones.length > 0 ? <ZoneLayer zones={scene.zones} /> : null}

        {computedScene.edges.map((edge) => (
          <ArchitectureEdge
            key={edge.id}
            edge={edge}
            emphasis={snapshot.emphasizedEdges[edge.id] ?? 0}
            visible={snapshot.edgeVisibility[edge.id] ?? true}
          />
        ))}

        <AnimatePresence>
          {snapshot.activeEvents.map((event) => {
            const edge = computedScene.edgesById[event.edgeId];
            const point = edge.pointAt(event.progress);
            return <EventParticle key={event.id} x={point.x} y={point.y} styleKey={event.style} label={event.label} />;
          })}
        </AnimatePresence>

        {computedScene.nodes.filter((node) => !node.hidden).map((node) => (
          <ArchitectureNode
            key={node.id}
            node={node}
            active={snapshot.nodeActivity[node.id] ?? 0}
            progress={snapshot.nodeProgress[node.id] ?? 0}
            progressOpacity={snapshot.nodeProgressOpacity[node.id] ?? 0}
            statusLabel={snapshot.nodeStatus[node.id]}
            residentEvent={simulation?.nodeResidency[node.id]}
            visible={snapshot.nodeVisibility[node.id] ?? true}
          />
        ))}

        {scene.metrics.length > 0 && simulation ? <MetricOverlay metrics={scene.metrics} values={simulation.metrics} /> : null}
      </svg>
    </div>
  );
}
