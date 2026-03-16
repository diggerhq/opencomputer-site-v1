import { Link } from "react-router-dom";
import FadeIn from "@/components/FadeIn";
import SitePageLayout from "@/components/SitePageLayout";

const posts = [
  {
    slug: "where-should-the-agent-live",
    title: "Where Should the Agent Live?",
    description:
      "A framework for deciding whether your coding agent should run outside the sandbox, inside the sandbox, or in a hybrid setup.",
    author: "TODO: placeholder",
    date: "March 15, 2026",
  },
  {
    slug: "sandbox-statefulness-designs",
    title: "Sandbox Statefulness Designs",
    description:
      "A practical guide to ephemeral, long-running, hybrid, and shared-environment sandbox designs for production agent systems.",
    author: "TODO: placeholder",
    date: "March 15, 2026",
  },
];

const Blog = () => {
  return (
    <SitePageLayout activeSection="blog">
      <FadeIn>
        <h1 className="mb-10 font-heading text-[clamp(42px,6vw,64px)] leading-[1.15] tracking-[-1.5px]">
          Blog
        </h1>
      </FadeIn>

      <div className="space-y-8">
        {posts.map((post) => (
          <FadeIn key={post.slug} delay={0.08}>
            <Link
              to={`/blog/${post.slug}`}
              className="block rounded-lg border border-border/50 bg-[hsl(0,0%,98%)] p-6 no-underline transition-colors duration-150 hover:border-foreground/20"
            >
              <h2 className="mb-2 font-heading text-[24px] tracking-[-0.3px] text-foreground">
                {post.title}
              </h2>
              <p className="mb-3 text-[15px] leading-[1.7] text-muted-foreground">
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
