import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

interface SitePageLayoutProps {
  activeSection?: "blog";
  children: React.ReactNode;
  contentClassName?: string;
  contentAs?: "main" | "article";
}

const SitePageLayout = ({
  activeSection,
  children,
  contentClassName = "max-w-[994px] mx-auto px-10 pt-10 pb-[60px]",
  contentAs = "main",
}: SitePageLayoutProps) => {
  const ContentTag = contentAs;

  return (
    <div className="min-h-screen">
      <SiteHeader activeSection={activeSection} />
      <ContentTag className={contentClassName}>{children}</ContentTag>
      <SiteFooter />
    </div>
  );
};

export default SitePageLayout;
