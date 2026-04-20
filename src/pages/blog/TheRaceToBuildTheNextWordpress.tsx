import { Link } from "react-router-dom";
import FadeIn from "@/components/FadeIn";
import SitePageLayout from "@/components/SitePageLayout";
import SEO from "@/components/SEO";

/* ---------- Callout ---------- */
const Callout = ({ children }: { children: React.ReactNode }) => (
  <div className="my-8 pl-5 border-l-[3px] border-foreground/80 py-1">
    <p className="font-heading text-[19px] leading-[1.65] tracking-[-0.2px] italic text-foreground/85">
      {children}
    </p>
  </div>
);

const TheRaceToBuildTheNextWordpress = () => {
  return (
    <SitePageLayout activeSection="blog" contentAs="article">
      <SEO
        title="The Race to Build the Next WordPress"
        description="Agent harnesses are to this era what WordPress was to the early 2000s internet. The race to build the next one is already on."
        author="Igor Zalutski"
        path="/blog/the-race-to-build-the-next-wordpress"
        type="article"
      />
      <FadeIn>
        <Link
          to="/blog"
          className="font-mono-brand text-[13px] text-muted-foreground hover:text-foreground transition-colors no-underline"
        >
          &larr; Back to blog
        </Link>
      </FadeIn>

      <FadeIn delay={0.04}>
        <h1 className="font-heading text-[clamp(36px,5vw,52px)] leading-[1.15] tracking-[-1.5px] mt-8 mb-4">
          The Race to Build the Next WordPress
        </h1>
      </FadeIn>

      <FadeIn delay={0.08}>
        <p className="font-mono-brand text-[13px] text-muted-foreground mb-10">
          Igor Zalutski &middot; April 19, 2026
        </p>
      </FadeIn>

      <FadeIn delay={0.12}>
        <div className="space-y-7">
          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            WordPress still serves roughly 40% of all Internet traffic. It's more than 20 years old. It
            is old and clumsy and doesn't scale well and it couldn't care less about all the distributed
            system cloud goodness that we are all accustomed to. WordPress runs on servers. It reads and
            writes files. Managed VMs weren't around when WordPress was created, not speaking of
            containers and serverless and CDNs and the rest of modern cloud infrastructure. And yet, it
            remains one of the most popular pieces of infrastructure software ever, handling more
            traffic than most countries.
          </p>
        </div>
      </FadeIn>

      {/* ── Visual: WordPress's share of the web ── */}
      <FadeIn>
        <div className="my-12 p-6 rounded-xl border border-border/50 bg-[hsl(0,0%,98.5%)]">
          <p className="font-mono-brand text-[11px] uppercase tracking-[0.15em] text-muted-foreground mb-6">
            The quiet giant
          </p>
          <div className="space-y-2">
            {[
              { label: "WordPress", share: 43, note: "of all websites, 40%+ of Internet traffic", highlight: true },
              { label: "Shopify", share: 6, note: "ecommerce-focused" },
              { label: "Wix", share: 4, note: "hosted builder" },
              { label: "Squarespace", share: 3, note: "hosted builder" },
              { label: "Everyone else combined", share: 8, note: "Drupal, Joomla, Ghost, etc." },
              { label: "No CMS / custom", share: 36, note: "hand-rolled sites" },
            ].map((row) => (
              <div key={row.label} className="flex items-center gap-3">
                <span className={`w-[180px] flex-shrink-0 font-mono-brand text-[12px] ${row.highlight ? "font-bold text-foreground" : "text-muted-foreground"}`}>
                  {row.label}
                </span>
                <div className="flex-1 h-6 rounded bg-[hsl(0,0%,94%)] relative overflow-hidden">
                  <div
                    className={`h-full ${row.highlight ? "bg-foreground" : "bg-foreground/30"}`}
                    style={{ width: `${row.share * 2}%` }}
                  />
                  <span className={`absolute right-2 top-1/2 -translate-y-1/2 font-mono-brand text-[11px] ${row.highlight ? "text-background pr-1" : "text-foreground/60"}`} style={{ left: row.highlight ? "auto" : `${row.share * 2 + 1}%`, right: row.highlight ? `${100 - row.share * 2 + 1}%` : "auto" }}>
                    {row.share}%
                  </span>
                </div>
              </div>
            ))}
          </div>
          <p className="font-mono-brand text-[11px] text-muted-foreground mt-5 italic">
            WordPress powers more of the web than the next five platforms combined &mdash; despite being built before modern cloud existed.
          </p>
        </div>
      </FadeIn>

      <FadeIn>
        <div className="space-y-7">
          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            I think that with LLM-based agents we are in a place similar to the Internet in the early
            2000s. It is very clear that it's revolutionary tech and going to change everyone's life in
            a big way. But how exactly and when and what exactly is missing is not so clear. As before,
            builders in Silicon Valley stay ahead of the curve and try to create the tooling that'd
            become the foundational tech for the decades ahead. It involves a lot of trial and error
            and the right shape of tooling will only be obvious in hindsight. But we can draw some
            parallels to make educated guesses on where things are headed.
          </p>

          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            Earlier I called one of the missing concepts{" "}
            <Link
              to="/blog/the-agentic-workload"
              className="underline hover:text-muted-foreground transition-colors"
            >
              The Agentic Workload
            </Link>
            , and today came across{" "}
            <a
              href="https://www.aparnadhinakaran.com/p/sandboxes-are-the-servers-of-the"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-muted-foreground transition-colors"
            >
              Sandboxes are the Servers of the Agent Era
            </a>{" "}
            by Aparna Dhinakaran. It's a great feeling to see other people thinking along similar
            lines. Earlier I also thought, what would be the piece of software from the early days of
            the internet that'd be the perfect analogy to this missing "workload" piece? I thought of
            Apache, itself a fork of httpd, but reading Aparna's article made me realise that an even
            better analogy is WordPress.
          </p>

          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            The difference is subtle but significant. Apache is a web server &mdash; it can host and
            run any web application, for example one written in PHP. Whereas WordPress sits a layer
            above; in fact it typically runs on Apache. What makes it a better analogy for the
            "agentic workload" is what you do with it &mdash; or rather, who and how uses it.
          </p>
        </div>
      </FadeIn>

      {/* ── Visual: Apache vs WordPress layering, mapped to agents ── */}
      <FadeIn>
        <div className="my-12">
          <p className="font-mono-brand text-[11px] uppercase tracking-[0.15em] text-muted-foreground mb-6">
            The layer that matters
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Web era */}
            <div className="rounded-xl border border-border/60 bg-white overflow-hidden">
              <div className="px-5 py-2.5 border-b border-border/60 bg-[hsl(0,0%,97%)]">
                <p className="font-mono-brand text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
                  Web, early 2000s
                </p>
              </div>
              <div className="p-5 space-y-2">
                <div className="rounded-md bg-foreground text-background px-4 py-3">
                  <p className="font-mono-brand text-[13px] font-medium">WordPress</p>
                  <p className="font-mono-brand text-[11px] text-background/60 mt-0.5">
                    the thing users actually wanted
                  </p>
                </div>
                <div className="flex justify-center text-foreground/30 font-mono-brand text-[14px]">↑</div>
                <div className="rounded-md border border-border/60 px-4 py-3">
                  <p className="font-mono-brand text-[13px]">Apache</p>
                  <p className="font-mono-brand text-[11px] text-muted-foreground mt-0.5">
                    the runtime under it
                  </p>
                </div>
                <div className="flex justify-center text-foreground/30 font-mono-brand text-[14px]">↑</div>
                <div className="rounded-md border border-border/60 px-4 py-3">
                  <p className="font-mono-brand text-[13px]">Linux / VM</p>
                  <p className="font-mono-brand text-[11px] text-muted-foreground mt-0.5">
                    server &amp; OS
                  </p>
                </div>
              </div>
            </div>

            {/* Agent era */}
            <div className="rounded-xl border border-border/60 bg-white overflow-hidden">
              <div className="px-5 py-2.5 border-b border-border/60 bg-[hsl(0,0%,97%)]">
                <p className="font-mono-brand text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
                  Agents, 2026
                </p>
              </div>
              <div className="p-5 space-y-2">
                <div className="rounded-md bg-foreground text-background px-4 py-3">
                  <p className="font-mono-brand text-[13px] font-medium">Agent Harness</p>
                  <p className="font-mono-brand text-[11px] text-background/60 mt-0.5">
                    the thing users actually want
                  </p>
                </div>
                <div className="flex justify-center text-foreground/30 font-mono-brand text-[14px]">↑</div>
                <div className="rounded-md border border-border/60 px-4 py-3">
                  <p className="font-mono-brand text-[13px]">Sandbox / Runtime</p>
                  <p className="font-mono-brand text-[11px] text-muted-foreground mt-0.5">
                    the workload underneath
                  </p>
                </div>
                <div className="flex justify-center text-foreground/30 font-mono-brand text-[14px]">↑</div>
                <div className="rounded-md border border-border/60 px-4 py-3">
                  <p className="font-mono-brand text-[13px]">Cloud / microVM</p>
                  <p className="font-mono-brand text-[11px] text-muted-foreground mt-0.5">
                    isolation &amp; infra
                  </p>
                </div>
              </div>
            </div>
          </div>
          <p className="font-mono-brand text-[11px] text-muted-foreground mt-5 italic">
            The harness is the WordPress layer &mdash; the one users touch, fork, plug into, and build businesses on top of.
          </p>
        </div>
      </FadeIn>

      <FadeIn>
        <div className="space-y-7">
          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            In the early days of the Internet it was quickly obvious that every person and every
            business would need some presence. Everyone would want a website. But making one wasn't
            easy. You'd need some engineering skill to create one and make it work so that everyone on
            the Internet could see it. Those who knew how to do it made lots of "easy money" in those
            days, just like people who know how to build AI agents today. Those same people started
            creating tools to make their life easier (and make more money to be able to serve more
            customers). This is how we got CGI scripts and then web servers like Apache and then
            engines like WordPress that are actively used for new projects to this day.
          </p>

          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            Apache became a foundational piece of "system software" that WordPress could rely on; but
            WordPress itself became an ecosystem of plugins and extensions and in effect created an
            entire industry that is booming to this day &mdash; all because lots of businesses need a
            website or an online store, which WordPress can support via plugins.
          </p>

          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            Agent harnesses are much more like WordPress than they are like Apache, simply because
            people want to have their own agents &mdash; just like everyone wanted their own website in
            the early 2000s. Looking at OpenClaw / Hermes one can see some striking similarities.
            These are rather monolithic pieces of software, ignoring many of the principles of good
            distributed system design &mdash; on purpose. Because building something like OpenClaw for
            scale, which I'm sure was done hundreds of times before Peter made the Clawdbot, would
            also make its application limited &mdash; very few people would have time and skill to
            make it work, which would defy the purpose of such software.
          </p>
        </div>
      </FadeIn>

      <FadeIn>
        <Callout>
          WordPress wasn't the best-designed CMS &mdash; Drupal was. It wasn't the most performant or
          reliable either. It won because it was the easiest to use.
        </Callout>
      </FadeIn>

      <FadeIn>
        <div className="space-y-7">
          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            Same principles made WordPress popular back in the day. It wasn't the most well-designed
            CMS &mdash; Drupal was. It wasn't the most performant or reliable either. But that didn't
            stop WordPress from becoming the de-facto standard for building websites and the largest
            ecosystem &mdash; all because it was the easiest to use. The demand for websites was
            seemingly insatiable; so the tool that allowed to get up and running with the lowest
            barrier of entry became a life-changing opportunity for so many young entrepreneurs. They
            were able to quickly learn just enough to make some money by building WordPress websites,
            and contributed back to the ecosystem by creating a myriad of extensions.
          </p>
        </div>
      </FadeIn>

      <FadeIn>
        <div className="w-12 h-px bg-border my-10" />
      </FadeIn>

      {/* ====== Section: Where we are now ====== */}
      <FadeIn>
        <h2 className="font-heading text-[clamp(28px,4vw,38px)] leading-[1.35] tracking-[-0.8px] mb-6">
          Where we are now
        </h2>
      </FadeIn>

      <FadeIn>
        <div className="space-y-7">
          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            It seems to me that we are in a very similar place with agent harnesses today (April
            2026). The demand for agents is seemingly insatiable; big labs are racing up the stack by
            subsidising usage and copying success stories at the application layer in a bid to retain
            customers who exhibit very little loyalty otherwise. Code generation is the main
            battleground and "every agent is a coding agent" seems to be the current consensus
            &mdash; surprisingly many problems that on the surface have little to do with code are
            solvable by agents generating and running some code. But everyone using "Anthropic agents"
            or "OpenAI agents" that are managed end-to-end by the big labs does not seem like a
            realistic scenario. I'm struggling to pinpoint exactly why, but it feels odd &mdash; a bit
            like people building websites using the ISP's software back in the 2000s.
          </p>
        </div>
      </FadeIn>

      {/* ── Visual: What the ISPs tried vs what won ── */}
      <FadeIn>
        <div className="my-12">
          <p className="font-mono-brand text-[11px] uppercase tracking-[0.15em] text-muted-foreground mb-6">
            History doesn't repeat, but it rhymes
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="rounded-xl border border-border/60 p-5 relative overflow-hidden">
              <div className="absolute top-4 right-4">
                <span className="font-mono-brand text-[10px] uppercase tracking-[0.1em] px-2 py-0.5 rounded-full bg-[hsl(0,65%,95%)] text-[hsl(0,45%,40%)]">
                  didn't stick
                </span>
              </div>
              <p className="font-mono-brand text-[11px] uppercase tracking-[0.1em] text-muted-foreground mb-3">
                ISP-bundled tooling, ~2000
              </p>
              <ul className="space-y-2 font-mono-brand text-[13px]">
                <li className="flex items-baseline gap-2">
                  <span className="text-muted-foreground">&times;</span>
                  <span>GeoCities (Yahoo!)</span>
                </li>
                <li className="flex items-baseline gap-2">
                  <span className="text-muted-foreground">&times;</span>
                  <span>AOL Hometown</span>
                </li>
                <li className="flex items-baseline gap-2">
                  <span className="text-muted-foreground">&times;</span>
                  <span>Tripod, Angelfire</span>
                </li>
              </ul>
              <p className="font-mono-brand text-[11px] text-muted-foreground mt-4 italic">
                Users were locked into the ISP's stack. When standalone tools emerged, they left.
              </p>
            </div>

            <div className="rounded-xl bg-foreground text-background p-5 relative overflow-hidden">
              <div className="absolute top-4 right-4">
                <span className="font-mono-brand text-[10px] uppercase tracking-[0.1em] px-2 py-0.5 rounded-full bg-[hsl(120,40%,22%)] text-[hsl(120,55%,75%)]">
                  won
                </span>
              </div>
              <p className="font-mono-brand text-[11px] uppercase tracking-[0.1em] text-background/60 mb-3">
                Dedicated tooling, ~2003+
              </p>
              <ul className="space-y-2 font-mono-brand text-[13px]">
                <li className="flex items-baseline gap-2">
                  <span className="text-background/50">&rarr;</span>
                  <span>WordPress</span>
                </li>
                <li className="flex items-baseline gap-2">
                  <span className="text-background/50">&rarr;</span>
                  <span>Drupal, Joomla</span>
                </li>
                <li className="flex items-baseline gap-2">
                  <span className="text-background/50">&rarr;</span>
                  <span>Movable Type</span>
                </li>
              </ul>
              <p className="font-mono-brand text-[11px] text-background/60 mt-4 italic">
                Portable. Host-agnostic. Each built for one job and got best-in-class attention.
              </p>
            </div>
          </div>
          <p className="font-mono-brand text-[11px] text-muted-foreground mt-5 italic text-center">
            &ldquo;Anthropic agents&rdquo; and &ldquo;OpenAI agents&rdquo; look structurally a lot like GeoCities did in 2000.
          </p>
        </div>
      </FadeIn>

      <FadeIn>
        <div className="space-y-7">
          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            ISPs tried actually &mdash; there was GeoCities and a similar platform by AOL. But these
            products didn't stick around for long. The reason is that as soon as a credible
            alternative that isn't locking the user into the ISP existed, there was no reason to not
            use a dedicated service for that. Plus the usual law of specialisation &mdash; a big ISP
            or a big AI lab only has so much attention to spare, whereas every product focused on a
            use case gets dedicated attention and eventually becomes best-in-class.
          </p>
        </div>
      </FadeIn>

      <FadeIn>
        <div className="w-12 h-px bg-border my-10" />
      </FadeIn>

      {/* ====== Section: The cambrian explosion ====== */}
      <FadeIn>
        <h2 className="font-heading text-[clamp(28px,4vw,38px)] leading-[1.35] tracking-[-0.8px] mb-6">
          A Cambrian explosion of harnesses
        </h2>
      </FadeIn>

      <FadeIn>
        <div className="space-y-7">
          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            If this analogy is right, then we will likely see sort of a "Cambrian explosion" in agent
            harnesses purpose-built for running server-side; and the few that win this race will
            become as ubiquitous as WordPress. Just like with websites earlier, every organisation on
            earth wants to have their own agents. They don't mind paying the AI labs for tokens, but
            the agent itself they'd much rather have outside of the labs' infrastructure.
          </p>
        </div>
      </FadeIn>

      {/* ── Visual: Fan-out of purpose-built harnesses ── */}
      <FadeIn>
        <div className="my-12">
          <p className="font-mono-brand text-[11px] uppercase tracking-[0.15em] text-muted-foreground mb-6">
            What &ldquo;purpose-built harnesses&rdquo; might look like
          </p>
          <div className="flex flex-col items-center">
            {/* Root */}
            <div className="rounded-lg bg-foreground text-background px-5 py-3 mb-2">
              <p className="font-mono-brand text-[13px] font-medium">Server-side agent harness</p>
              <p className="font-mono-brand text-[10px] text-background/60 mt-0.5 text-center">
                the generic &ldquo;runtime&rdquo;
              </p>
            </div>
            {/* Connector */}
            <div className="w-px h-6 bg-foreground/40" />
            {/* Branches */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full max-w-[820px]">
              {[
                { label: "Coding agent", sub: "PRs, reviews, migrations" },
                { label: "Ops agent", sub: "oncall, incidents, runbooks" },
                { label: "Sales agent", sub: "outbound, CRM, research" },
                { label: "Research agent", sub: "deep reads, synthesis" },
                { label: "Finance agent", sub: "close, reconciliation" },
                { label: "Support agent", sub: "tickets, refunds, logs" },
                { label: "Legal agent", sub: "contracts, diligence" },
                { label: "... the rest", sub: "every vertical, eventually" },
              ].map((h) => (
                <div key={h.label} className="rounded-lg border border-border/60 px-3 py-3 text-center bg-white">
                  <p className="font-mono-brand text-[12px] font-medium">{h.label}</p>
                  <p className="font-mono-brand text-[10px] text-muted-foreground mt-1 leading-[1.4]">
                    {h.sub}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <p className="font-mono-brand text-[11px] text-muted-foreground mt-6 italic text-center">
            One runtime, many harnesses. Each owned by the team that lives inside that problem space.
          </p>
        </div>
      </FadeIn>

      <FadeIn>
        <Callout>
          They don't mind paying the AI labs for tokens &mdash; but the agent itself, they'd much
          rather have outside of the labs' infrastructure.
        </Callout>
      </FadeIn>

      <FadeIn>
        <div className="w-12 h-px bg-border my-10" />
      </FadeIn>

      <FadeIn>
        <div className="space-y-7">
          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            I'm building{" "}
            <a
              href="https://opencomputer.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-muted-foreground transition-colors"
            >
              opencomputer.dev
            </a>{" "}
            &mdash; a sandbox built for running agents inside it.
          </p>
          <p className="font-mono-brand text-[12px] text-muted-foreground italic">
            Written by a human.
          </p>
        </div>
      </FadeIn>
    </SitePageLayout>
  );
};

export default TheRaceToBuildTheNextWordpress;
