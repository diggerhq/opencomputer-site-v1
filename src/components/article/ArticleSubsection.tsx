import type { ReactNode } from "react";
import ArticleSection from "./ArticleSection";

type ArticleSubsectionProps = {
  title: string;
  id?: string;
  children: ReactNode;
};

export default function ArticleSubsection({ title, id, children }: ArticleSubsectionProps) {
  return (
    <ArticleSection title={title} id={id} level={3}>
      {children}
    </ArticleSection>
  );
}
