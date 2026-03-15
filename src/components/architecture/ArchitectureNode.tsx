import { motion } from "framer-motion";
import { eventStyles } from "@/animations/presets";
import { Bot, Database, SlidersHorizontal, UserRound, Webhook } from "lucide-react";
import { nodePresets } from "@/animations/presets";
import type { NodeGeometry } from "@/animations/layout";
import type { EventStyleKey, NodeIcon } from "@/animations/schema";

type ArchitectureNodeProps = {
  node: NodeGeometry;
  active: number;
  progress: number;
  progressOpacity: number;
  statusLabel?: string;
  residentEvent?: {
    style: EventStyleKey;
    label?: string;
    slot?: "left" | "right" | "center";
  };
  visible: boolean;
};

const iconMap: Record<NodeIcon, typeof UserRound> = {
  user: UserRound,
  webhook: Webhook,
  agent: Bot,
  controlPlane: SlidersHorizontal,
  database: Database,
};

function renderShape(node: NodeGeometry, fill: string, stroke: string) {
  const preset = nodePresets[node.kind];
  const x = node.left;
  const y = node.top;

  if (preset.shape === "pill") {
    return <rect x={x} y={y} width={node.width} height={node.height} rx={node.height / 2} fill={fill} stroke={stroke} strokeWidth={1.5} />;
  }

  if (preset.shape === "cylinder") {
    const capHeight = 16;
    return (
      <>
        <ellipse cx={node.cx} cy={y + capHeight / 2} rx={node.width / 2} ry={capHeight / 2} fill={fill} stroke={stroke} strokeWidth={1.5} />
        <path
          d={`M ${x} ${y + capHeight / 2} L ${x} ${y + node.height - capHeight / 2} A ${node.width / 2} ${capHeight / 2} 0 0 0 ${x + node.width} ${y + node.height - capHeight / 2} L ${x + node.width} ${y + capHeight / 2}`}
          fill={fill}
          stroke={stroke}
          strokeWidth={1.5}
        />
        <ellipse cx={node.cx} cy={y + node.height - capHeight / 2} rx={node.width / 2} ry={capHeight / 2} fill="none" stroke={stroke} strokeWidth={1.5} />
      </>
    );
  }

  if (preset.shape === "hex") {
    const inset = 16;
    const points = [
      `${x + inset},${y}`,
      `${x + node.width - inset},${y}`,
      `${x + node.width},${y + node.height / 2}`,
      `${x + node.width - inset},${y + node.height}`,
      `${x + inset},${y + node.height}`,
      `${x},${y + node.height / 2}`,
    ].join(" ");

    return <polygon points={points} fill={fill} stroke={stroke} strokeWidth={1.5} />;
  }

  return <rect x={x} y={y} width={node.width} height={node.height} rx={16} fill={fill} stroke={stroke} strokeWidth={1.5} />;
}

export default function ArchitectureNode({ node, active, progress, progressOpacity, statusLabel, residentEvent, visible }: ArchitectureNodeProps) {
  const preset = nodePresets[node.kind];
  const palette = {
    fill: node.fill ?? preset.fill,
    stroke: node.stroke ?? preset.stroke,
    accent: node.accent ?? preset.accent,
  };
  const isSandbox = node.kind === "sandbox";
  const isDatabase = node.kind === "db";
  const meterWidth = Math.max(0, node.width - 32);
  const Icon = node.icon ? iconMap[node.icon] : null;
  const showProgress = node.showProgress ?? true;
  const standardTextX = Icon ? node.cx + 14 : node.cx;
  const residentStyle = residentEvent ? eventStyles[residentEvent.style] : null;
  const residentMarker = residentStyle
    ? {
        x:
          residentEvent?.slot === "left"
            ? node.cx - 42
            : residentEvent?.slot === "right"
              ? node.cx + 42
              : node.cx,
        y: node.cy + 22,
      }
    : null;

  return (
    <motion.g
      initial={false}
      animate={{
        opacity: visible ? 1 : 0,
        scale: visible ? 1 : 0.92,
      }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      style={{ transformOrigin: `${node.cx}px ${node.cy}px` }}
    >
      <motion.g
        initial={false}
        animate={{
          scale: 1 + active * 0.02,
          filter: `drop-shadow(0px 10px 24px rgba(31, 41, 55, ${0.08 + active * 0.12}))`,
        }}
        transition={{ duration: 0.24 }}
        style={{ transformOrigin: `${node.cx}px ${node.cy}px` }}
      >
        {renderShape(node, palette.fill, palette.stroke)}
      </motion.g>

      {isSandbox ? (
        <>
          {showProgress ? (
            <>
              <rect x={node.left + 16} y={node.top + 14} width={meterWidth} height={9} rx={4.5} fill="rgba(21, 67, 45, 0.14)" />
              <motion.rect
                initial={false}
                animate={{ width: meterWidth * progress }}
                x={node.left + 16}
                y={node.top + 14}
                height={9}
                rx={4.5}
                fill={palette.accent}
                opacity={0.95 * progressOpacity}
                transition={{ duration: 0.2 }}
              />
              {Icon ? <Icon x={node.cx - 82} y={node.cy - 10} width={22} height={22} stroke={palette.stroke} strokeWidth={2} /> : null}
              <text x={node.cx + 18} y={node.cy - (statusLabel ? 4 : 0)} textAnchor="middle" className="fill-foreground text-[20px] font-semibold tracking-[0.01em]">
                {node.label}
              </text>
              {statusLabel ? (
                <text x={node.cx + 18} y={node.cy + 24} textAnchor="middle" className="fill-muted-foreground text-[13px] tracking-[0.08em] uppercase">
                  {statusLabel}
                </text>
              ) : null}
              {residentStyle && residentMarker ? (
                <g>
                  <circle cx={residentMarker.x} cy={residentMarker.y} r={residentStyle.radius + 1} fill={residentStyle.fill} stroke={residentStyle.stroke} strokeWidth={2} opacity={0.95} />
                  {residentEvent?.label ? (
                    <text x={residentMarker.x} y={residentMarker.y + 22} textAnchor="middle" className="fill-muted-foreground text-[9px] tracking-[0.12em] uppercase">
                      {residentEvent.label}
                    </text>
                  ) : null}
                </g>
              ) : null}
            </>
          ) : (
            <>
              <rect x={node.left + 16} y={node.top + 14} width={meterWidth} height={9} rx={4.5} fill={palette.accent} opacity={0.9} />
              {Icon ? <Icon x={node.cx - 96} y={node.top + 36} width={22} height={22} stroke={palette.stroke} strokeWidth={2} /> : null}
              <text x={node.cx + 4} y={node.top + 54} textAnchor="middle" className="fill-foreground text-[20px] font-semibold tracking-[0.01em]">
                {node.label}
              </text>
              {node.subtitle ? (
                <text x={node.cx} y={node.top + 80} textAnchor="middle" className="fill-muted-foreground text-[14px] tracking-[0.08em] uppercase">
                  {node.subtitle}
                </text>
              ) : null}
            </>
          )}
        </>
      ) : (
        <>
          {node.kind === "source" ? (
            <rect
              x={node.left + 22}
              y={node.top + 12}
              width={node.width - 44}
              height={7}
              rx={3.5}
              fill={palette.accent}
              opacity={0.85}
            />
          ) : (
          <rect
            x={node.left + 10}
            y={node.top + 10}
            width={node.width - 20}
            height={7}
            rx={3.5}
            fill={palette.accent}
            opacity={0.85}
          />
          )}
          {Icon ? <Icon x={isDatabase ? node.cx - 102 : node.left + 20} y={isDatabase ? node.cy - 13 : node.cy - 12} width={22} height={22} stroke={palette.stroke} strokeWidth={2} /> : null}
          <text x={isDatabase ? node.cx + 34 : standardTextX} y={node.cy + 2} textAnchor="middle" className="fill-foreground text-[20px] font-semibold tracking-[0.01em]">
            {node.label}
          </text>
          {residentStyle && residentMarker ? (
            <g>
              <circle cx={residentMarker.x} cy={residentMarker.y} r={residentStyle.radius + 1} fill={residentStyle.fill} stroke={residentStyle.stroke} strokeWidth={2} opacity={0.95} />
              {residentEvent?.label ? (
                <text x={residentMarker.x} y={residentMarker.y + 22} textAnchor="middle" className="fill-muted-foreground text-[9px] tracking-[0.12em] uppercase">
                  {residentEvent.label}
                </text>
              ) : null}
            </g>
          ) : null}
          {statusLabel ?? node.subtitle ? (
            <text x={isDatabase ? node.cx : standardTextX} y={node.cy + 27} textAnchor="middle" className="fill-muted-foreground text-[14px] tracking-[0.08em] uppercase">
              {statusLabel ?? node.subtitle}
            </text>
          ) : null}
        </>
      )}
    </motion.g>
  );
}
