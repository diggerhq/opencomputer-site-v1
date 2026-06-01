import { Link } from "react-router-dom";
import FadeIn from "@/components/FadeIn";
import SitePageLayout from "@/components/SitePageLayout";
import SEO from "@/components/SEO";

const posts = [
  {
    slug: "background-coding-agent",
    title: "Build a background coding agent that works while you sleep",
    description:
      "A 250-line self-hosted background coding agent. Label a GitHub issue with `agent`, wake up to a draft PR. ~$0.30/task. The snapshot, the agent loop, the webhook server, and the dead ends I'd save you from.",
    author: "Utpal Nadiger",
    date: "June 1, 2026",
  },
  {
    slug: "what-it-takes-to-run-an-ai-coworker-on-imessage",
    title: "What it takes to run an AI coworker on iMessage",
    description:
      "Lessons from shipping Clawputer, a managed openclaw that lives in your iMessage. Patterns for VM lifecycle, versioning, OAuth integrations, and browser offloading when building AI coworkers on long-lived compute.",
    author: "Mohamed Habib",
    date: "May 22, 2026",
  },
  {
    slug: "stop-treating-sandboxes-as-cattle",
    title: "Stop Treating Agent Sandboxes as Cattle",
    description:
      "A direct response to 'The agent harness belongs outside the sandbox.' Why credentials, hibernation, elasticity, and checkpoints make a persistent in-sandbox harness the better default.",
    author: "Utpal Nadiger",
    date: "May 4, 2026",
  },
  {
    slug: "the-race-to-build-the-next-wordpress",
    title: "The Race to Build the Next WordPress",
    description:
      "Agent harnesses are to this era what WordPress was to the early 2000s internet. The race to build the next one is already on.",
    author: "Igor Zalutski",
    date: "April 19, 2026",
  },
  {
    slug: "what-elastic-compute-means",
    title: "What \"elastic compute\" means in 2026",
    description:
      "From EC2 to agent sandboxes — how agents broke the compute paradigms we've relied on for 20 years, and what elasticity looks like now.",
    author: "Igor Zalutski",
    date: "April 7, 2026",
  },
  {
    slug: "where-should-the-agent-live",
    title: "Where Should the Agent(s) Live?",
    description:
      "Isolation models, agent placement tradeoffs, credential design, and sandbox lifecycle patterns for agentic systems.",
    author: "Utpal Nadiger, Mohamed Habib, Igor Zalutski",
    date: "March 20, 2026",
  },
  {
    slug: "agent-execution-new-http-request",
    title: "Agent Execution Is the New HTTP Request",
    description:
      "From CGI scripts to serverless, web infrastructure evolved over 30 years. Now agents are taking us full circle - back to files and scripts.",
    author: "Igor Zalutski",
    date: "March 17, 2026",
  },
  {
    slug: "sandbox-fingerprinting",
    title: "I Asked Opus 4.6 to Fingerprint Sandbox Vendors",
    description:
      "We fingerprinted 6 sandbox providers to understand their isolation models - from containers to microVMs to full hypervisors. Here's what we found.",
    author: "Mohamed Habib",
    date: "March 17, 2026",
  },
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
    author: "Mohamed Habib",
    date: "March 11, 2026",
  },
];

const Blog = () => {
  return (
    <SitePageLayout activeSection="blog">
        <SEO
          title="Blog"
          description="Thoughts on agentic compute, sandbox isolation, and building infrastructure for AI agents."
          path="/blog"
        />
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
