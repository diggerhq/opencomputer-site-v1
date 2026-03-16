import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type CalloutTone = "default" | "info" | "todo" | "note";

type ArticleCalloutProps = {
  title?: string;
  tone?: CalloutTone;
  className?: string;
  children: ReactNode;
};

const toneClasses: Record<CalloutTone, string> = {
  default: "border-border/70 bg-[hsl(0,0%,98%)] text-muted-foreground",
  info: "border-border/70 bg-[hsl(0,0%,98%)] text-muted-foreground",
  todo: "border-dashed border-border/80 bg-[hsl(0,0%,98%)] text-muted-foreground",
  note: "border-border/70 bg-[hsl(0,0%,98%)] text-muted-foreground",
};

export default function ArticleCallout({ title, tone = "default", className, children }: ArticleCalloutProps) {
  return (
    <div className={cn("rounded-lg border p-6 text-[16px] leading-[1.75]", toneClasses[tone], className)}>
      {title ? (
        <p className="font-mono-brand text-[12px] uppercase tracking-[0.15em] text-muted-foreground">{title}</p>
      ) : null}
      <div className={cn(title ? "mt-2" : undefined)}>{children}</div>
    </div>
  );
}
