import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type ArticleListProps = {
  ordered?: boolean;
  className?: string;
  children: ReactNode;
};

export default function ArticleList({ ordered = false, className, children }: ArticleListProps) {
  const Tag = ordered ? "ol" : "ul";

  return (
    <Tag
      className={cn(
        ordered ? "list-decimal list-inside" : "list-disc list-inside",
        "space-y-2 pl-2 text-[17px] leading-[1.75] tracking-[-0.1px]",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
