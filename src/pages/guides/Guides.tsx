import { Link } from "react-router-dom";
import FadeIn from "@/components/FadeIn";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

const guides = [
  {
    slug: "building-open-lovable-part-1",
    title: "Building an Open Lovable - part 1",
    description:
      "A series to build a lovable clone to learn how lovable works under the hood using Claude Agent SDK and OpenComputer.",
    author: "Mohamed Habib, CTO Digger",
    date: "March 11, 2026",
  },
];

const Guides = () => {
  return (
    <div className="min-h-screen">
      <SiteHeader activeSection="guides" />

      {/* Main */}
      <main className="max-w-[994px] mx-auto px-10 pt-10 pb-[60px]">
        <FadeIn>
          <h1 className="font-heading text-[clamp(42px,6vw,64px)] leading-[1.15] tracking-[-1.5px] mb-10">
            Guides
          </h1>
        </FadeIn>

        <div className="space-y-8">
          {guides.map((guide) => (
            <FadeIn key={guide.slug} delay={0.08}>
              <Link
                to={`/guides/${guide.slug}`}
                className="block p-6 rounded-lg border border-border/50 bg-[hsl(0,0%,98%)] hover:border-foreground/20 transition-colors duration-150 no-underline"
              >
                <h2 className="font-heading text-[24px] tracking-[-0.3px] mb-2 text-foreground">
                  {guide.title}
                </h2>
                <p className="text-[15px] leading-[1.7] text-muted-foreground mb-3">
                  {guide.description}
                </p>
                <p className="font-mono-brand text-[12px] text-muted-foreground">
                  {guide.author} &middot; {guide.date}
                </p>
              </Link>
            </FadeIn>
          ))}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
};

export default Guides;
