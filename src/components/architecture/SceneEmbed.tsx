import { useEffect, useMemo, useRef, useState } from "react";
import { computeScene } from "@/animations/layout";
import type { Scene } from "@/animations/schema";
import { simulateScene, type SimulationControls } from "@/animations/simulation";
import ArchitectureCanvas from "./ArchitectureCanvas";

type SceneEmbedProps = {
  scene: Scene;
  controlOverrides?: SimulationControls;
};

export default function SceneEmbed({ scene, controlOverrides }: SceneEmbedProps) {
  const [timeMs, setTimeMs] = useState(0);
  const previousRef = useRef<number | null>(null);
  const frameRef = useRef<number | null>(null);

  const computedScene = useMemo(() => computeScene(scene), [scene]);
  const controls = useMemo(
    () => ({
      ...Object.fromEntries(scene.controls.map((control) => [control.key, control.defaultValue])),
      ...(controlOverrides ?? {}),
    }),
    [controlOverrides, scene.controls],
  );

  const simulation = useMemo(() => simulateScene(scene, timeMs, computedScene.edgesById, controls), [computedScene.edgesById, controls, scene, timeMs]);
  const durationMs = simulation?.durationMs ?? scene.meta.durationMs;
  const playbackSpeed = controls.playbackSpeed ?? 1;

  useEffect(() => {
    previousRef.current = null;
    setTimeMs(0);
  }, [scene.meta.id]);

  useEffect(() => {
    const tick = (timestamp: number) => {
      const previous = previousRef.current ?? timestamp;
      const delta = Math.min(48, timestamp - previous);
      previousRef.current = timestamp;
      setTimeMs((current) => (current + delta * playbackSpeed) % Math.max(1, durationMs));
      frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [durationMs, playbackSpeed]);

  return (
    <div className="mx-auto max-w-[500px]">
      <div className="overflow-hidden rounded-[24px] border border-[#ddcfba] bg-[rgba(252,248,241,0.92)] p-3">
        <ArchitectureCanvas scene={scene} timeMs={timeMs} simulation={simulation} />
      </div>
    </div>
  );
}
