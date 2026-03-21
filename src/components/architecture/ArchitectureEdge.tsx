import { motion } from "framer-motion";
import type { ComputedEdge } from "@/animations/layout";

type ArchitectureEdgeProps = {
  edge: ComputedEdge;
  emphasis: number;
  visible: boolean;
};

export default function ArchitectureEdge({ edge, emphasis, visible }: ArchitectureEdgeProps) {
  return (
    <g>
      <motion.path
        d={edge.path}
        fill="none"
        stroke="rgba(122, 104, 77, 0.18)"
        strokeWidth={14}
        strokeLinecap="round"
        initial={false}
        animate={{ opacity: visible ? 0.35 + emphasis * 0.2 : 0 }}
      />
      <motion.path
        d={edge.path}
        fill="none"
        stroke={emphasis > 0.05 ? "#d08a3c" : "#8a7a61"}
        strokeWidth={2 + emphasis * 1.5}
        strokeDasharray="7 9"
        strokeLinecap="round"
        initial={false}
        animate={{ opacity: visible ? 0.45 + emphasis * 0.55 : 0 }}
      />
      {edge.label ? (
        <text
          x={(edge.start.x + edge.end.x) / 2}
          y={(edge.start.y + edge.end.y) / 2 - 10}
          textAnchor="middle"
          className="fill-muted-foreground text-[10px] uppercase tracking-[0.16em]"
        >
          {edge.label}
        </text>
      ) : null}
    </g>
  );
}
