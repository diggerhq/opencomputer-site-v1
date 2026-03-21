import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { computeScene } from "@/animations/layout";
import { getScene } from "@/animations/scenes";
import { simulateScene } from "@/animations/simulation";
import ArchitectureCanvas from "@/components/architecture/ArchitectureCanvas";
import SimulationSummary from "@/components/architecture/SimulationSummary";

type AnimationRenderWindow = Window & {
  __setAnimationRenderTime?: (timeMs: number) => void;
  __animationRenderMeta?: {
    sceneId: string;
    durationMs: number;
    width: number;
  };
};

function readNumber(value: string | null, fallback: number) {
  if (value === null) {
    return fallback;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export default function AnimationRender() {
  const [searchParams] = useSearchParams();
  const scene = useMemo(() => getScene(searchParams.get("scene")), [searchParams]);
  const width = readNumber(searchParams.get("width"), 960);
  const showSummary = searchParams.get("summary") === "1";
  const [timeMs, setTimeMs] = useState(() => readNumber(searchParams.get("timeMs"), 0));

  const controls = useMemo(
    () =>
      Object.fromEntries(
        scene.controls.map((control) => [control.key, readNumber(searchParams.get(control.key), control.defaultValue)]),
      ),
    [scene.controls, searchParams],
  );

  const computedScene = useMemo(() => computeScene(scene), [scene]);
  const simulation = useMemo(() => simulateScene(scene, timeMs, computedScene.edgesById, controls), [computedScene.edgesById, controls, scene, timeMs]);
  const durationMs = simulation?.durationMs ?? scene.meta.durationMs;

  useEffect(() => {
    setTimeMs(readNumber(searchParams.get("timeMs"), 0));
  }, [searchParams]);

  useEffect(() => {
    const animationWindow = window as AnimationRenderWindow;
    animationWindow.__setAnimationRenderTime = (nextTimeMs: number) => {
      setTimeMs(nextTimeMs);
    };
    animationWindow.__animationRenderMeta = {
      sceneId: scene.meta.id,
      durationMs,
      width,
    };
    document.documentElement.dataset.animationRenderReady = "true";

    return () => {
      delete animationWindow.__setAnimationRenderTime;
      delete animationWindow.__animationRenderMeta;
      delete document.documentElement.dataset.animationRenderReady;
    };
  }, [durationMs, scene.meta.id, width]);

  return (
    <div className="min-h-screen bg-[#f6efe4] px-6 py-8 text-foreground">
      <main className="mx-auto flex max-w-[1400px] flex-col items-center gap-6">
        <div data-animation-render style={{ width: `${width}px`, maxWidth: "100%" }}>
          <ArchitectureCanvas scene={scene} timeMs={timeMs} simulation={simulation} />
        </div>
        {showSummary && simulation?.summary ? (
          <div style={{ width: `${width}px`, maxWidth: "100%" }}>
            <SimulationSummary scene={scene} controls={controls} simulation={simulation} />
          </div>
        ) : null}
      </main>
    </div>
  );
}
