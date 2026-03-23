import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Pause, Play, RotateCcw } from "lucide-react";
import { computeScene } from "@/animations/layout";
import { simulateScene, type SimulationControls } from "@/animations/simulation";
import ArchitectureCanvas from "@/components/architecture/ArchitectureCanvas";
import SimulationSummary from "@/components/architecture/SimulationSummary";
import { getScene, scenes } from "@/animations/scenes";

export default function AnimationLab() {
  const [searchParams, setSearchParams] = useSearchParams();
  const scene = useMemo(() => getScene(searchParams.get("scene")), [searchParams]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [timeMs, setTimeMs] = useState(0);
  const [controlValues, setControlValues] = useState<SimulationControls>({});
  const rafRef = useRef<number | null>(null);
  const previousRef = useRef<number | null>(null);

  const playbackSpeed = controlValues.playbackSpeed ?? 1;
  const computedScene = useMemo(() => computeScene(scene), [scene]);

  const resolvedControlValues = useMemo(() => {
    return Object.fromEntries(
      scene.controls.map((control) => [control.key, controlValues[control.key] ?? control.defaultValue]),
    );
  }, [controlValues, scene.controls]);

  const simulation = useMemo(() => {
    return simulateScene(scene, timeMs, computedScene.edgesById, resolvedControlValues);
  }, [computedScene.edgesById, resolvedControlValues, scene, timeMs]);

  const effectiveDurationMs = simulation?.durationMs ?? scene.meta.durationMs;

  useEffect(() => {
    setTimeMs(0);
    previousRef.current = null;
  }, [scene.meta.id]);

  useEffect(() => {
    setControlValues(Object.fromEntries(scene.controls.map((control) => [control.key, control.defaultValue])));
  }, [scene.meta.id, scene.controls]);

  useEffect(() => {
    if (!isPlaying) {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      rafRef.current = null;
      previousRef.current = null;
      return;
    }

    const tick = (timestamp: number) => {
      const previous = previousRef.current ?? timestamp;
      const delta = Math.min(48, timestamp - previous);
      previousRef.current = timestamp;
      setTimeMs((current) => current + delta * playbackSpeed);
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      rafRef.current = null;
      previousRef.current = null;
    };
  }, [isPlaying, playbackSpeed]);

  const loopedTimeMs = ((timeMs % effectiveDurationMs) + effectiveDurationMs) % effectiveDurationMs;

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,_#fbf7ef_0%,_#f4ede3_52%,_#efe5d8_100%)] text-foreground">
      <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-6 py-8 md:px-10 lg:px-12">
        <div className="flex flex-col gap-6 rounded-[32px] border border-[#d8c9b3] bg-[rgba(255,252,247,0.78)] p-6 shadow-[0_24px_80px_rgba(95,67,25,0.12)] backdrop-blur md:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl space-y-3">
              <p className="font-mono-brand text-xs uppercase tracking-[0.28em] text-[#8a6d46]">Animation lab</p>
              <h1 className="font-heading text-[clamp(2.5rem,5vw,4.5rem)] leading-[0.95] tracking-[-0.05em]">
                Declarative architecture scenes for fast animation iteration.
              </h1>
              <p className="max-w-2xl text-[15px] leading-7 text-[#625744] md:text-[17px]">
                Scene data, routing, playback, and SVG rendering stay separate so you can tweak topology and timing without touching component internals.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-sm">
              <Link to="/" className="rounded-full border border-[#d8c9b3] px-4 py-2 text-[#625744] no-underline transition hover:border-[#8a6d46] hover:text-foreground">
                Back home
              </Link>
              <Link
                to={`/animation-lab?scene=${scene.meta.id}`}
                className="rounded-full bg-foreground px-4 py-2 text-background no-underline transition hover:opacity-90"
              >
                Share this scene
              </Link>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
            <aside className="space-y-4 rounded-[24px] border border-[#ddcfba] bg-[rgba(252,248,241,0.92)] p-5">
              <div className="space-y-2">
                <label htmlFor="scene-select" className="font-mono-brand text-[11px] uppercase tracking-[0.2em] text-[#8a6d46]">
                  Preview scene
                </label>
                <select
                  id="scene-select"
                  value={scene.meta.id}
                  onChange={(event) => setSearchParams({ scene: event.target.value })}
                  className="w-full rounded-2xl border border-[#d8c9b3] bg-background px-4 py-3 text-sm outline-none transition focus:border-[#8a6d46]"
                >
                  {scenes.map((entry) => (
                    <option key={entry.meta.id} value={entry.meta.id}>
                      {entry.meta.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <h2 className="font-heading text-2xl tracking-[-0.03em]">{scene.meta.title}</h2>
                <p className="text-sm leading-6 text-[#625744]">{scene.meta.description}</p>
              </div>

              {scene.controls.length > 0 ? (
                <div className="space-y-3 rounded-[20px] border border-[#e3d9ca] bg-[rgba(255,255,255,0.72)] p-4">
                  <p className="font-mono-brand text-[11px] uppercase tracking-[0.18em] text-[#8a6d46]">Scenario controls</p>
                  {scene.controls.map((control) => {
                    const value = resolvedControlValues[control.key] ?? control.defaultValue;
                    const selectedOption = control.options?.find((option) => option.value === value);
                    const selectedRange = control.ranges?.find((range) => value >= range.min && value <= range.max);
                    const valueLabel = selectedOption?.label ?? (Number.isInteger(value) ? value : value.toFixed(1));
                    const suffix = selectedOption ? "" : control.unit ?? "";
                    return (
                      <div key={control.key} className="space-y-1.5">
                        <div className="flex items-center justify-between gap-3 text-[11px] uppercase tracking-[0.14em] text-[#8a6d46]">
                          <span>{control.label}</span>
                          <span>
                            {valueLabel}{suffix}{selectedRange && !selectedOption ? ` (${selectedRange.label}: ${selectedRange.min}-${selectedRange.max})` : ""}
                          </span>
                        </div>
                        {control.options ? (
                          <select
                            value={value}
                            onChange={(event) => {
                              const nextValue = Number(event.target.value);
                              setControlValues((current) => ({ ...current, [control.key]: nextValue }));
                              previousRef.current = null;
                            }}
                            className="w-full rounded-2xl border border-[#d8c9b3] bg-background px-4 py-3 text-sm outline-none transition focus:border-[#8a6d46]"
                          >
                            {control.options.map((option) => (
                              <option key={option.label} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        ) : (
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
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : null}

              <div className="space-y-3 rounded-[20px] border border-[#e3d9ca] bg-[rgba(255,255,255,0.72)] p-4">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsPlaying((current) => !current)}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-foreground text-background transition hover:opacity-90"
                    aria-label={isPlaying ? "Pause animation" : "Play animation"}
                  >
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTimeMs(0);
                      previousRef.current = null;
                    }}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#d8c9b3] bg-background text-foreground transition hover:border-[#8a6d46]"
                    aria-label="Reset animation"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </button>
                  <div>
                    <p className="font-mono-brand text-[11px] uppercase tracking-[0.18em] text-[#8a6d46]">Playback</p>
                    <p className="text-sm text-[#625744]">Pause, scrub, and replay deterministically.</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between font-mono-brand text-[11px] uppercase tracking-[0.18em] text-[#8a6d46]">
                    <span>Timeline</span>
                    <span>{Math.round(loopedTimeMs)}ms / {Math.round(effectiveDurationMs)}ms</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={effectiveDurationMs}
                    value={loopedTimeMs}
                    onChange={(event) => {
                      setTimeMs(Number(event.target.value));
                      previousRef.current = null;
                    }}
                    className="w-full accent-[#8a6d46]"
                  />
                </div>
              </div>

              <div className="space-y-3 rounded-[20px] border border-[#e3d9ca] bg-[rgba(255,255,255,0.72)] p-4">
                <p className="font-mono-brand text-[11px] uppercase tracking-[0.18em] text-[#8a6d46]">Edit contract</p>
                <ul className="space-y-2 text-sm leading-6 text-[#625744]">
                  <li>`src/animations/scenes/` owns scene data.</li>
                  <li>`src/animations/layout.ts` owns path generation.</li>
                  <li>`src/animations/playback.ts` owns time-to-state mapping.</li>
                  <li>`src/components/architecture/` owns visuals only.</li>
                </ul>
              </div>
            </aside>

            <section className="space-y-4">
              <ArchitectureCanvas scene={scene} timeMs={timeMs} simulation={simulation} />
              {simulation?.summary ? <SimulationSummary scene={scene} controls={resolvedControlValues} simulation={simulation} /> : null}
              {simulation && simulation.timelineSteps.length > 0 ? (
                <div className="rounded-[24px] border border-[#ddcfba] bg-[rgba(252,248,241,0.92)] p-4">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="font-mono-brand text-[11px] uppercase tracking-[0.18em] text-[#8a6d46]">Event timeline</p>
                      <p className="text-sm text-[#625744]">Click a step to jump directly to that point in the simulation.</p>
                    </div>
                    <p className="font-mono-brand text-[11px] uppercase tracking-[0.18em] text-[#8a6d46]">
                      {Math.round(simulation.loopedTimeMs)}ms simulated
                    </p>
                  </div>
                  <div className="max-h-[320px] space-y-1 overflow-y-auto rounded-[16px] border border-[#e3d9ca] bg-[rgba(255,255,255,0.72)] p-2">
                    {simulation.timelineSteps.map((step, index) => {
                      const isActive = simulation.activeStepId === step.id;
                      return (
                        <button
                          key={step.id}
                          type="button"
                          onClick={() => {
                            setTimeMs(step.startMs);
                            previousRef.current = null;
                            setIsPlaying(false);
                          }}
                          className={`flex w-full items-start gap-3 rounded-2xl px-3 py-2 text-left transition ${isActive ? "bg-[#f4ede3]" : "hover:bg-[rgba(244,237,227,0.65)]"}`}
                        >
                          <span className="mt-0.5 font-mono-brand text-[10px] uppercase tracking-[0.16em] text-[#8a6d46]">{index + 1}</span>
                          <span className="mt-1 h-2.5 w-2.5 rounded-full" style={{ backgroundColor: step.color }} />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 text-sm text-[#332b1f]">
                              <span className="font-medium">{step.label}</span>
                              <span className="font-mono-brand text-[10px] uppercase tracking-[0.16em] text-[#8a6d46]">
                                {step.from} {"->"} {step.to}
                              </span>
                            </div>
                            {step.note ? <p className="mt-1 text-xs leading-5 text-[#625744]">{step.note}</p> : null}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : null}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
