import { motion } from "framer-motion";
import { eventStyles } from "@/animations/presets";

type EventParticleProps = {
  x: number;
  y: number;
  styleKey: keyof typeof eventStyles;
  label?: string;
};

export default function EventParticle({ x, y, styleKey, label }: EventParticleProps) {
  const style = eventStyles[styleKey];
  const size = style.radius * 2;

  return (
    <motion.g
      initial={{ opacity: 0, scale: 0.75 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.75 }}
      transition={{ duration: 0.16 }}
      style={{ transformOrigin: `${x}px ${y}px` }}
    >
      {style.shape === "diamond" ? (
        <rect
          x={x - style.radius}
          y={y - style.radius}
          width={size}
          height={size}
          rx={2}
          fill={style.fill}
          stroke={style.stroke}
          strokeWidth={2}
          transform={`rotate(45 ${x} ${y})`}
        />
      ) : (
        <circle cx={x} cy={y} r={style.radius} fill={style.fill} stroke={style.stroke} strokeWidth={2} />
      )}

      {label ? (
        <text x={x} y={y - 14} textAnchor="middle" className="fill-foreground text-[10px] font-medium tracking-[0.08em] uppercase">
          {label}
        </text>
      ) : null}
    </motion.g>
  );
}
