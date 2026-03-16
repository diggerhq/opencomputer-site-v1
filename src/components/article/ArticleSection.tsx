import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type HeadingLevel = 2 | 3 | 4;

type ArticleSectionProps = {
  title: string;
  id?: string;
  level?: HeadingLevel;
  className?: string;
  children: ReactNode;
};

const headingStyles: Record<HeadingLevel, string> = {
  2: "font-heading text-[28px] tracking-[-0.5px]",
  3: "font-heading text-[24px] tracking-[-0.4px]",
  4: "font-heading text-[20px] tracking-[-0.3px]",
};

export default function ArticleSection({ title, id, level = 2, className, children }: ArticleSectionProps) {
  const HeadingTag = `h${level}` as const;

  return (
    <section className={cn("space-y-6", className)}>
      <HeadingTag id={id} className={cn("group scroll-mt-24", headingStyles[level])}>
        {title}
        {id ? (
          <a
            href={`#${id}`}
            className="ml-2 align-middle font-mono-brand text-[12px] uppercase tracking-[0.16em] text-muted-foreground opacity-0 transition-opacity hover:text-foreground group-hover:opacity-100"
            aria-label={`Link to ${title}`}
          >
            #
          </a>
        ) : null}
      </HeadingTag>
      {children}
    </section>
  );
}
