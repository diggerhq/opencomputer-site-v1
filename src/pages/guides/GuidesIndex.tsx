import { Link } from "react-router-dom";
import FadeIn from "@/components/FadeIn";
import SitePageLayout from "@/components/SitePageLayout";
import SEO from "@/components/SEO";
import { guidePosts } from "@/content/guides/meta";

// /guides index — the hub page for the markdown-rendered guides section.
// Lists guides only; the blog keeps its own index. (The legacy
// /guides/<blog-slug> mirror routes still exist and canonicalize to /blog/*.)

const GuidesIndex = () => (
  <SitePageLayout
    activeSection="blog"
    contentClassName="max-w-[760px] mx-auto px-6 pt-10 pb-[60px]"
  >
    <SEO
      title="Guides"
      description="Technical guides on sandbox isolation for AI agents: hypervisors, microVMs, kernel-sharing boundaries, and how to choose infrastructure for agent workloads."
      path="/guides"
    />

    <FadeIn>
      <h1 className="font-heading text-[clamp(36px,5vw,52px)] leading-[1.15] tracking-[-1.5px]">
        Guides
      </h1>
      <p className="mt-4 max-w-[560px] text-[17px] leading-[1.7] text-muted-foreground">
        Technical guides on sandbox isolation for AI agents: hypervisors,
        microVMs, kernel-sharing boundaries, and how to choose infrastructure
        for agent workloads.
      </p>
    </FadeIn>

    <div className="mt-14 space-y-12">
      {guidePosts.map((guide) => (
        <FadeIn key={guide.slug}>
          <article>
            <Link to={`/guides/${guide.slug}`} className="group block no-underline">
              <h2 className="font-heading text-[26px] leading-[1.3] tracking-[-0.5px] group-hover:underline decoration-foreground/30">
                {guide.title}
              </h2>
              <p className="mt-3 text-[16px] leading-[1.7] text-muted-foreground">
                {guide.description}
              </p>
              <p className="mt-3 font-mono-brand text-[13px] text-muted-foreground">
                {guide.author} &middot;{" "}
                {new Date(`${guide.datePublished}T00:00:00Z`).toLocaleDateString(
                  "en-US",
                  { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" },
                )}
              </p>
            </Link>
          </article>
        </FadeIn>
      ))}
    </div>
  </SitePageLayout>
);

export default GuidesIndex;
