import { useEffect, useMemo, useRef, useState } from "react";
import { computeScene } from "@/animations/layout";
import { agentHybridSandboxScene } from "@/animations/scenes/agent-hybrid-sandbox";
import { agentInsideSandboxScene } from "@/animations/scenes/agent-inside-sandbox";
import { agentOutsideSandboxScene } from "@/animations/scenes/agent-outside-sandbox";
import type { ControlDef } from "@/animations/schema";
import { simulateScene, type SimulationControls, type SimulationSnapshot } from "@/animations/simulation";
import ArchitectureCanvas from "./ArchitectureCanvas";

const comparisonScenes = [agentOutsideSandboxScene, agentInsideSandboxScene, agentHybridSandboxScene];

function formatValue(control: ControlDef, value: number) {
  const range = control.ranges?.find((item) => value >= item.min && value <= item.max);
  const numeric = Number.isInteger(value) ? `${value}` : value.toFixed(1);
  return `${numeric}${control.unit ?? ""}${range ? ` (${range.label})` : ""}`;
}

function formatMs(ms: number) {
  return ms >= 1000 ? `${(ms / 1000).toFixed(1)}s` : `${Math.round(ms)}ms`;
}

function MiniSummary({ simulation }: { simulation: SimulationSnapshot | null }) {
  if (!simulation?.summary) {
    return null;
  }

  const [hoveredSliceId, setHoveredSliceId] = useState<string | null>(null);

  const total = simulation.summary.totalMs;
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;
  const hoveredSlice = simulation.summary.breakdown.find((slice) => slice.id === hoveredSliceId) ?? null;

  return (
    <div className="rounded-[20px] border border-[#ddcfba] bg-[rgba(255,255,255,0.72)] p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="font-mono-brand text-[11px] uppercase tracking-[0.18em] text-[#8a6d46]">Total completion</p>
        <p className="text-xl font-semibold tracking-[-0.03em] text-[#332b1f]">{formatMs(total)}</p>
      </div>
      <div className="mt-4 flex justify-center">
        <div className="relative h-[112px] w-[112px]">
          <svg viewBox="0 0 112 112" className="h-full w-full -rotate-90">
            <circle cx="56" cy="56" r={radius} fill="none" stroke="rgba(138,109,70,0.12)" strokeWidth="14" />
            {simulation.summary.breakdown.map((slice) => {
              const fraction = slice.ms / Math.max(1, total);
              const strokeDasharray = `${fraction * circumference} ${circumference}`;
              const strokeDashoffset = -offset;
              offset += fraction * circumference;
              return (
                <circle
                  key={slice.id}
                  cx="56"
                  cy="56"
                  r={radius}
                  fill="none"
                  stroke={slice.color}
                  strokeWidth="14"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="butt"
                  className="cursor-pointer transition-opacity duration-150 hover:opacity-85"
                  onMouseEnter={() => setHoveredSliceId(slice.id)}
                  onMouseLeave={() => setHoveredSliceId((current) => (current === slice.id ? null : current))}
                />
              );
            })}
          </svg>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
            <p className="font-mono-brand text-[9px] uppercase tracking-[0.16em] text-[#8a6d46]">Total</p>
            <p className="mt-1 text-lg font-semibold tracking-[-0.03em] text-[#332b1f]">
              {formatMs(total)}
            </p>
          </div>
        </div>
      </div>
      <div className="mt-3 space-y-1.5">
        {simulation.summary.breakdown.map((slice) => (
          <button
            key={slice.id}
            type="button"
            onMouseEnter={() => setHoveredSliceId(slice.id)}
            onMouseLeave={() => setHoveredSliceId((current) => (current === slice.id ? null : current))}
            className={`flex w-full items-start gap-3 rounded-[12px] border px-3 py-1.5 text-left transition-colors ${hoveredSliceId === slice.id ? "border-[#ddcfba] bg-[rgba(244,237,227,0.72)]" : "border-transparent hover:border-[rgba(138,109,70,0.12)]"}`}
          >
            <span className="mt-1 h-3 w-3 rounded-full" style={{ backgroundColor: slice.color }} />
            <div className="min-w-0 flex-1">
              <p className="text-[13px] leading-[1.35] text-[#4c3d28]">{slice.label}</p>
              <p className="font-mono-brand text-[11px] uppercase tracking-[0.08em] text-[#8a6d46]">{formatMs(slice.ms)}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function AgentPlacementComparison() {
  const controls = useMemo(
    () => agentHybridSandboxScene.controls.filter((control) => control.key !== "playbackSpeed"),
    [],
  );
  const [controlValues, setControlValues] = useState<SimulationControls>(() =>
    Object.fromEntries(controls.map((control) => [control.key, control.defaultValue])),
  );
  const [timeMs, setTimeMs] = useState(0);
  const frameRef = useRef<number | null>(null);
  const previousRef = useRef<number | null>(null);

  const computedScenes = useMemo(
    () => comparisonScenes.map((scene) => ({ scene, computed: computeScene(scene) })),
    [],
  );

  const simulations = useMemo(
    () =>
      computedScenes.map(({ scene, computed }) => ({
        scene,
        simulation: simulateScene(scene, timeMs, computed.edgesById, controlValues),
      })),
    [computedScenes, controlValues, timeMs],
  );

  const maxDurationMs = Math.max(...simulations.map(({ simulation, scene }) => simulation?.durationMs ?? scene.meta.durationMs));

  useEffect(() => {
    const tick = (timestamp: number) => {
      const previous = previousRef.current ?? timestamp;
      const delta = Math.min(48, timestamp - previous);
      previousRef.current = timestamp;
      setTimeMs((current) => (current + delta) % Math.max(1, maxDurationMs));
      frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [maxDurationMs]);

  return (
    <div className="space-y-8 rounded-[28px] border border-[#ddcfba] bg-[rgba(252,248,241,0.92)] p-6">
      <div className="space-y-3">
        <p className="font-mono-brand text-[11px] uppercase tracking-[0.18em] text-[#8a6d46]">Interactive comparison</p>
        <p className="text-[16px] leading-[1.7] text-[#625744]">
          Use the shared controls below to compare how the three placement models respond to the same workload and latency assumptions.
        </p>
      </div>

      <div className="rounded-[18px] border border-[#ddcfba] bg-[rgba(255,255,255,0.6)] p-3">
        <div className="grid gap-x-3 gap-y-2 md:grid-cols-2 xl:grid-cols-3">
        {controls.map((control) => {
          const value = controlValues[control.key] ?? control.defaultValue;
          return (
            <div key={control.key} className="space-y-1 rounded-[12px] border border-[#e3d9ca] bg-[rgba(255,255,255,0.72)] px-2.5 py-2">
              <div className="flex items-start justify-between gap-2">
                <span className="min-w-0 text-[12px] leading-4 text-[#8a6d46]">{control.label}</span>
                <span className="shrink-0 font-mono-brand text-[9px] uppercase tracking-[0.08em] text-[#4c3d28]">
                  {formatValue(control, value)}
                </span>
              </div>
              <input
                type="range"
                min={control.min}
                max={control.max}
                step={control.step}
                value={value}
                onChange={(event) => {
                  const nextValue = Number(event.target.value);
                  setControlValues((current) => ({ ...current, [control.key]: nextValue }));
                  previousRef.current = null;
                }}
                className="w-full accent-[#8a6d46]"
              />
            </div>
          );
        })}
        </div>
      </div>

      <div className="grid gap-8 xl:grid-cols-3">
        {simulations.map(({ scene, simulation }) => (
          <section key={scene.meta.id} className="space-y-4">
            <div className="space-y-1">
              <h3 className="font-heading text-[22px] tracking-[-0.4px]">{scene.meta.title}</h3>
            </div>
            <div className="overflow-hidden rounded-[24px] border border-[#ddcfba] bg-[rgba(255,255,255,0.72)] p-3">
              <ArchitectureCanvas scene={scene} timeMs={timeMs} simulation={simulation} />
            </div>
            <MiniSummary simulation={simulation} />
          </section>
        ))}
      </div>
    </div>
  );
}
