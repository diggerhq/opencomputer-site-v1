import { Link } from "react-router-dom";
import FadeIn from "@/components/FadeIn";
import SitePageLayout from "@/components/SitePageLayout";

const posts = [
  {
    slug: "the-agentic-workload",
    title: "The Agentic Workload",
    description:
      "Agent code doesn't fit neatly into existing categories. It's not a traditional app, and it's not a CI job. It's something new.",
    author: "Igor Zalutski",
    date: "March 15, 2026",
  },
  {
    slug: "building-open-lovable-part-1",
    title: "Building an Open Lovable - part 1",
    description:
      "A series to build a lovable clone to learn how lovable works under the hood using Claude Agent SDK and OpenComputer.",
    author: "Mohamed Habib, CTO Digger",
    date: "March 11, 2026",
  },
];

const Blog = () => {
  return (
    <SitePageLayout activeSection="blog">
        <FadeIn>
          <h1 className="font-heading text-[clamp(42px,6vw,64px)] leading-[1.15] tracking-[-1.5px] mb-10">
            Blog
          </h1>
        </FadeIn>

        <div className="space-y-8">
          {posts.map((post) => (
            <FadeIn key={post.slug} delay={0.08}>
              <Link
                to={`/blog/${post.slug}`}
                className="block p-6 rounded-lg border border-border/50 bg-[hsl(0,0%,98%)] hover:border-foreground/20 transition-colors duration-150 no-underline"
              >
                <h2 className="font-heading text-[24px] tracking-[-0.3px] mb-2 text-foreground">
                  {post.title}
                </h2>
                <p className="text-[15px] leading-[1.7] text-muted-foreground mb-3">
                  {post.description}
                </p>
                <p className="font-mono-brand text-[12px] text-muted-foreground">
                  {post.author} &middot; {post.date}
                </p>
              </Link>
            </FadeIn>
          ))}
        </div>
    </SitePageLayout>
  );
};

export default Blog;
