import type { Scene } from "@/animations/schema";
import type { SimulationControls, SimulationSnapshot } from "@/animations/simulation";

type SimulationSummaryProps = {
  scene: Scene;
  controls: SimulationControls;
  simulation: SimulationSnapshot;
};

function formatMs(ms: number) {
  return ms >= 1000 ? `${(ms / 1000).toFixed(1)}s` : `${Math.round(ms)}ms`;
}

function describeControl(scene: Scene, controls: SimulationControls, key: string) {
  const control = scene.controls.find((item) => item.key === key);
  if (!control) return null;
  const value = controls[key] ?? control.defaultValue;
  const range = control.ranges?.find((item) => value >= item.min && value <= item.max);
  const label = Number.isInteger(value) ? `${value}` : value.toFixed(1);
  return {
    label: control.label,
    value: `${label}${control.unit ?? ""}${range ? ` (${range.label})` : ""}`,
  };
}

export default function SimulationSummary({ scene, controls, simulation }: SimulationSummaryProps) {
  if (!simulation.summary) {
    return null;
  }

  const settings = [
    describeControl(scene, controls, "taskDifficulty"),
    describeControl(scene, controls, "safeToolPercent"),
    describeControl(scene, controls, "sandboxBoundaryLatencyMs"),
    describeControl(scene, controls, "modelApiLatencyMs"),
    describeControl(scene, controls, "modelResponseMs"),
    describeControl(scene, controls, "toolExecutionMs"),
  ].filter(Boolean) as Array<{ label: string; value: string }>;

  const total = simulation.summary.totalMs;
  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="rounded-[24px] border border-[#ddcfba] bg-[rgba(252,248,241,0.92)] p-5">
      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-3">
          <div>
            <p className="font-mono-brand text-[11px] uppercase tracking-[0.18em] text-[#8a6d46]">Scene settings</p>
            <p className="mt-1 text-sm text-[#625744]">Current parameters driving the simulation.</p>
          </div>
          <div className="rounded-[18px] border border-[#e3d9ca] bg-[rgba(255,255,255,0.72)] p-4">
            <div className="space-y-2 text-sm text-[#4c3d28]">
              {settings.map((setting) => (
                <div key={setting.label} className="flex flex-col gap-1 sm:grid sm:grid-cols-[minmax(0,1fr)_minmax(0,140px)] sm:items-start sm:gap-3">
                  <span className="leading-5 text-[#8a6d46]">{setting.label}</span>
                  <span className="font-mono-brand text-[11px] uppercase tracking-[0.08em] text-[#4c3d28] sm:text-right sm:break-words">
                    {setting.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center rounded-[18px] border border-[#e3d9ca] bg-[rgba(255,255,255,0.72)] p-4">
          <p className="font-mono-brand text-[11px] uppercase tracking-[0.18em] text-[#8a6d46]">Total completion</p>
          <div className="relative mt-4 h-[144px] w-[144px]">
            <svg viewBox="0 0 144 144" className="h-full w-full -rotate-90">
              <circle cx="72" cy="72" r={radius} fill="none" stroke="rgba(138,109,70,0.12)" strokeWidth="18" />
              {simulation.summary.breakdown.map((slice) => {
                const fraction = slice.ms / Math.max(1, total);
                const strokeDasharray = `${fraction * circumference} ${circumference}`;
                const strokeDashoffset = -offset;
                offset += fraction * circumference;
                return (
                  <circle
                    key={slice.id}
                    cx="72"
                    cy="72"
                    r={radius}
                    fill="none"
                    stroke={slice.color}
                    strokeWidth="18"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="butt"
                  />
                );
              })}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <p className="font-mono-brand text-[10px] uppercase tracking-[0.18em] text-[#8a6d46]">Total</p>
              <p className="mt-1 text-2xl font-semibold tracking-[-0.03em] text-[#332b1f]">{formatMs(total)}</p>
            </div>
          </div>
        </div>

        <div className="min-w-0 rounded-[18px] border border-[#e3d9ca] bg-[rgba(255,255,255,0.72)] p-4 md:col-span-2">
          <p className="font-mono-brand text-[11px] uppercase tracking-[0.18em] text-[#8a6d46]">Time breakdown</p>
          <div className="mt-3 grid gap-x-6 gap-y-2 lg:grid-cols-2">
            {simulation.summary.breakdown.map((slice) => {
              return (
                <div key={slice.id} className="border-b border-[rgba(138,109,70,0.12)] pb-2 last:border-b-0 last:pb-0 lg:[&:nth-last-child(-n+2)]:border-b-0 lg:[&:nth-last-child(-n+2)]:pb-0">
                  <div className="flex min-w-0 items-center gap-3 text-sm text-[#4c3d28]">
                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: slice.color }} />
                    <div className="min-w-0 flex-1">
                      <div className="space-y-0.5">
                        <span className="block min-w-0 text-[13px] leading-5">{slice.label}</span>
                        <span className="block font-mono-brand text-[11px] uppercase tracking-[0.08em] text-[#8a6d46]">{formatMs(slice.ms)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
