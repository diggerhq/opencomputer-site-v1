import type { MetricDef } from "@/animations/schema";

type MetricOverlayProps = {
  metrics: MetricDef[];
  values: Record<string, string>;
};

const toneStyles: Record<MetricDef["tone"], { fill: string; stroke: string; label: string; value: string }> = {
  default: { fill: "rgba(255,255,255,0.82)", stroke: "rgba(106,96,80,0.18)", label: "#8a6d46", value: "#332b1f" },
  positive: { fill: "rgba(238,251,243,0.94)", stroke: "rgba(63,125,94,0.22)", label: "#3f7d5e", value: "#214d37" },
  warning: { fill: "rgba(255,248,236,0.94)", stroke: "rgba(157,115,64,0.22)", label: "#9d7340", value: "#5f4319" },
};

export default function MetricOverlay({ metrics, values }: MetricOverlayProps) {
  return (
    <>
      {metrics.map((metric) => {
        const value = values[metric.id];
        if (!value) {
          return null;
        }

        const style = toneStyles[metric.tone];
        return (
          <g key={metric.id}>
            <rect x={metric.x} y={metric.y} width={148} height={54} rx={16} fill={style.fill} stroke={style.stroke} strokeWidth={1.2} />
            <text x={metric.x + 16} y={metric.y + 22} className="text-[10px] uppercase tracking-[0.18em]" style={{ fill: style.label }}>
              {metric.label}
            </text>
            <text x={metric.x + 16} y={metric.y + 40} className="text-[15px] font-semibold" style={{ fill: style.value }}>
              {value}
            </text>
          </g>
        );
      })}
    </>
  );
}
