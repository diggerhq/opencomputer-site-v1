import type { ZoneDef } from "@/animations/schema";

type ZoneLayerProps = {
  zones: ZoneDef[];
};

const zoneStyles: Record<ZoneDef["style"], { fill: string; stroke: string; label: string }> = {
  sandbox: { fill: "rgba(237, 243, 255, 0.45)", stroke: "rgba(70, 103, 180, 0.38)", label: "#4667b4" },
  external: { fill: "rgba(238, 251, 243, 0.52)", stroke: "rgba(63, 125, 94, 0.34)", label: "#3f7d5e" },
  neutral: { fill: "rgba(247, 243, 237, 0.7)", stroke: "rgba(106, 96, 80, 0.28)", label: "#6a6050" },
};

export default function ZoneLayer({ zones }: ZoneLayerProps) {
  return (
    <>
      {zones.map((zone) => {
        const style = zoneStyles[zone.style];
        return (
          <g key={zone.id}>
            <rect
              x={zone.x}
              y={zone.y}
              width={zone.width}
              height={zone.height}
              rx={28}
              fill={style.fill}
              stroke={style.stroke}
              strokeWidth={1.5}
              strokeDasharray="10 10"
            />
            {zone.label ? (
              <text x={zone.x + 20} y={zone.y + 28} className="fill-foreground text-[12px] font-semibold uppercase tracking-[0.14em]" style={{ fill: style.label }}>
                {zone.label}
              </text>
            ) : null}
          </g>
        );
      })}
    </>
  );
}
