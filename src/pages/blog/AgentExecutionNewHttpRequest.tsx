import { Link } from "react-router-dom";
import FadeIn from "@/components/FadeIn";
import SitePageLayout from "@/components/SitePageLayout";
import SEO from "@/components/SEO";

/* ---------- Reusable components ---------- */

const Callout = ({ children }: { children: React.ReactNode }) => (
  <div className="my-8 pl-5 border-l-[3px] border-foreground/80 py-1">
    <p className="font-heading text-[19px] leading-[1.65] tracking-[-0.2px] italic text-foreground/85">
      {children}
    </p>
  </div>
);

const EraCard = ({
  era,
  year,
  title,
  detail,
  isolation,
  accent,
}: {
  era: string;
  year: string;
  title: string;
  detail: string;
  isolation: string;
  accent: string;
}) => (
  <div className="relative p-5 rounded-lg border border-border/50 bg-[hsl(0,0%,98%)]">
    <div className="flex items-center gap-2 mb-2">
      <span
        className={`inline-block w-2.5 h-2.5 rounded-full ${accent}`}
      />
      <span className="font-mono-brand text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
        {era} &middot; {year}
      </span>
    </div>
    <h4 className="font-heading text-[17px] tracking-[-0.2px] mb-1.5">
      {title}
    </h4>
    <p className="text-[14px] leading-[1.65] text-muted-foreground mb-2">
      {detail}
    </p>
    <p className="font-mono-brand text-[11px] text-muted-foreground/70">
      {isolation}
    </p>
  </div>
);

/* ---------- Stack layer diagram ---------- */
const StackLayer = ({
  label,
  sublabel,
  width,
  shade,
}: {
  label: string;
  sublabel: string;
  width: string;
  shade: string;
}) => (
  <div className="flex flex-col items-center">
    <div
      className={`${width} py-3 px-4 rounded-md border border-border/60 ${shade} text-center`}
    >
      <p className="font-mono-brand text-[12px] font-medium">{label}</p>
      <p className="font-mono-brand text-[10px] text-muted-foreground mt-0.5">
        {sublabel}
      </p>
    </div>
  </div>
);

const AgentExecutionNewHttpRequest = () => {
  return (
    <SitePageLayout activeSection="blog" contentAs="article">
      <SEO
        title="Agent Execution Is the New HTTP Request"
        description="From CGI scripts to serverless, web infrastructure evolved over 30 years. Now agents are taking us full circle - back to files and scripts."
        author="Igor Zalutski"
        path="/blog/agent-execution-new-http-request"
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
          Agent Execution Is the New HTTP Request
        </h1>
      </FadeIn>

      <FadeIn delay={0.08}>
        <p className="font-mono-brand text-[13px] text-muted-foreground mb-10">
          Igor Zalutski &middot; March 17, 2026
        </p>
      </FadeIn>

      <FadeIn delay={0.12}>
        <div className="space-y-7">
          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            Just the other day in{" "}
            <a
              href="https://x.com/IgorZIJ/status/2033316871928254530"
              target="_blank"
              className="underline hover:text-foreground/70 transition-colors"
            >
              The Agentic Workload
            </a>{" "}
            I managed to finally capture a hunch that bugged me for a while:
            agents need infrastructure of a fundamentally different "shape" than
            the distributed primitives we are accustomed to in application
            development. But re-reading it today I'm realising it misses
            something even more fundamental that is likely going on  -
            almost like a full-circle moment in the industry. What follows is my
            attempt to capture this; a "Part 2" of sorts.
          </p>
        </div>
      </FadeIn>

      {/* ========== GROUND ZERO ========== */}
      <FadeIn>
        <h2 className="font-heading text-[clamp(26px,3.5vw,34px)] leading-[1.25] tracking-[-0.8px] mt-16 mb-6">
          Ground 0: Files and Scripts
        </h2>
      </FadeIn>

      <FadeIn>
        <div className="space-y-7">
          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            At the dawn of the Web in the 1990s there wasn't much to it beyond
            files sitting on computers  - actual physical computers with
            public IP addresses. The first web server, HTTPd created by Tim
            Berners Lee, literally just mapped a URL to a file. The server's
            config (<code className="font-mono-brand text-[15px] bg-muted/50 px-1.5 py-0.5 rounded">httpd.conf</code>)
            basically defined a document root directory, e.g.{" "}
            <code className="font-mono-brand text-[15px] bg-muted/50 px-1.5 py-0.5 rounded">/usr/local/www/htdocs/</code>,
            and if you requested{" "}
            <code className="font-mono-brand text-[15px] bg-muted/50 px-1.5 py-0.5 rounded">/papers/proposal.html</code>{" "}
            it would read and return that file. This was perfectly fine because
            at the time there was just one web server in the world  -{" "}
            <a
              href="http://info.cern.ch/"
              target="_blank"
              className="underline hover:text-foreground/70 transition-colors"
            >
              info.cern.ch
            </a>
            .
          </p>

          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            By December 1991 there was a second one, at SLAC in the US. And by
            late 1993 there were already ~500 web servers. It was becoming clear
            that some sort of program on top of bare files would make launching a
            new server easier. So Rob McCool at NCSA introduced CGI. It was
            still file-based; but you could now put your program into the{" "}
            <code className="font-mono-brand text-[15px] bg-muted/50 px-1.5 py-0.5 rounded">cgi-bin</code>{" "}
            directory, and if a URL pointed into{" "}
            <code className="font-mono-brand text-[15px] bg-muted/50 px-1.5 py-0.5 rounded">cgi-bin/</code>,
            instead of returning the file, the server would fork a new OS
            process, exec that script/binary, pass the HTTP request info via
            environment variables ({" "}
            <code className="font-mono-brand text-[15px] bg-muted/50 px-1.5 py-0.5 rounded">QUERY_STRING</code>,{" "}
            <code className="font-mono-brand text-[15px] bg-muted/50 px-1.5 py-0.5 rounded">REQUEST_METHOD</code>,{" "}
            <code className="font-mono-brand text-[15px] bg-muted/50 px-1.5 py-0.5 rounded">CONTENT_LENGTH</code>,
            etc.) and stdin, and pipe the script's stdout back as the HTTP
            response. Such scripts were often written in Perl  - now almost
            forgotten, but one relict of it that remains in nearly all languages
            to this day is the Regular Expression pattern-matching. Perl was
            perfect for CGI because the most common job of a web application was
            to match some sort of a URL to some sort of a file path on disk.
          </p>
        </div>
      </FadeIn>

      <FadeIn>
        <Callout>
          Worth noting: each request was isolated at process level; filesystem
          was shared.
        </Callout>
      </FadeIn>

      {/* ---- Visual: CGI request flow ---- */}
      <FadeIn>
        <div className="my-10 p-6 rounded-xl border border-border/50 bg-[hsl(0,0%,98.5%)]">
          <p className="font-mono-brand text-[11px] uppercase tracking-[0.15em] text-muted-foreground mb-5">
            CGI Request Flow (1993)
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-0 justify-between">
            {[
              { label: "HTTP Request", sub: "/cgi-bin/search.pl?q=higgs" },
              { label: "Fork Process", sub: "OS-level isolation" },
              { label: "Exec Script", sub: "Perl / C / Shell" },
              { label: "stdout → HTTP", sub: "Response piped back" },
            ].map((step, i) => (
              <div key={step.label} className="flex items-center gap-3 sm:gap-0">
                <div className="text-center px-3 py-3 rounded-md border border-border/60 bg-white min-w-[140px]">
                  <p className="font-mono-brand text-[12px] font-medium">
                    {step.label}
                  </p>
                  <p className="font-mono-brand text-[10px] text-muted-foreground mt-1">
                    {step.sub}
                  </p>
                </div>
                {i < 3 && (
                  <span className="hidden sm:block text-muted-foreground/40 text-lg mx-2">
                    &rarr;
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* ========== APPLICATION SERVERS ========== */}
      <FadeIn>
        <h2 className="font-heading text-[clamp(26px,3.5vw,34px)] leading-[1.25] tracking-[-0.8px] mt-16 mb-6">
          Application Servers
        </h2>
      </FadeIn>

      <FadeIn>
        <div className="space-y-7">
          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            CGI scripts had one problem: every request spawned a new process.
            But there is only so much memory on the server. Back in 1995 a
            typical web server would be called "powerful" if it had 32MB of RAM
            (<em>mega</em>bytes, not <em>giga</em>bytes). It would hardly even
            load a single photo from a modern iPhone (~20mb) even if it was the
            only thing the poor server did because there was also an OS with a
            bunch of system programs running. So the number of requests a server
            could process was limited by the number of CGI processes that would
            fit in memory simultaneously  - which wasn't many.
          </p>

          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            The solution was to trade isolation for performance. I'll skip lots
            of important developments here for the sake of conciseness  -
            but essentially, by the late 1990s / early 2000s Apache, a fork of
            HTTPd, emerged as a de-facto standard web server. Extensions like
            mod_perl and mod_php allowed handling requests using various
            programming languages. Instead of giving a full process to each
            request like the original HTTPd, Apache would use a fixed-size pool
            of "worker processes", each running a PHP interpreter.
          </p>

          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            PHP became the most widely used (and arguably the first) "internet
            programming language", this Internet thing was clearly here to stay,
            so many other companies got into the business of sending HTML over
            HTTP  - notably Java Servlets by Sun and ASP by Microsoft. I
            won't even attempt to go into the technical design decisions of
            these, suffice to say that they rather quickly evolved from "web
            servers" to "enterprise software ecosystems". Computers became more
            powerful each year so you could serve more and more users from each
            computer (or rather VM, as virtualisation tech matured enough to
            cleanly decouple hardware maintenance from the software running on
            it).
          </p>

          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            Ruby on Rails and Django frameworks were created in 2004-05 and
            arguably perfected the "application server" pattern. Much of the Web
            as we know it was created with these frameworks: GitHub, Twitter and
            Shopify were built with Ruby on Rails; Instagram and Pinterest with
            Django.
          </p>
        </div>
      </FadeIn>

      <FadeIn>
        <Callout>
          Fundamentally these were still processes running on a single machine,
          keeping some stuff in memory, reading / writing some files. File
          system is still shared by all requests; but no longer a fresh process
          for each request  - the process stays alive between requests,
          holds state in memory, manages database connections, owns sessions.
        </Callout>
      </FadeIn>

      {/* ---- Visual: The Tradeoff ---- */}
      <FadeIn>
        <div className="my-10 p-6 rounded-xl border border-border/50 bg-[hsl(0,0%,98.5%)]">
          <p className="font-mono-brand text-[11px] uppercase tracking-[0.15em] text-muted-foreground mb-5">
            The Core Tradeoff
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-lg border border-border/60 bg-white">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-3 h-3 rounded-full bg-emerald-400" />
                <span className="font-mono-brand text-[12px] font-medium">
                  CGI (1993)
                </span>
              </div>
              <p className="text-[14px] leading-[1.65] text-muted-foreground">
                Fresh process per request. Maximum isolation. But expensive
                 - limited by RAM.
              </p>
            </div>
            <div className="p-5 rounded-lg border border-border/60 bg-white">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-3 h-3 rounded-full bg-blue-400" />
                <span className="font-mono-brand text-[12px] font-medium">
                  App Server (2000s)
                </span>
              </div>
              <p className="text-[14px] leading-[1.65] text-muted-foreground">
                Shared process pool. Less isolation. But handles orders of
                magnitude more requests.
              </p>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* ========== ISOLATION OVER EFFICIENCY ========== */}
      <FadeIn>
        <h2 className="font-heading text-[clamp(26px,3.5vw,34px)] leading-[1.25] tracking-[-0.8px] mt-16 mb-6">
          Isolation Over Efficiency: Shared-Nothing
        </h2>
      </FadeIn>

      <FadeIn>
        <div className="space-y-7">
          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            In early 2000s the number of users that each successful Internet
            application needed to handle was growing much faster than even the
            most optimistic versions of the Moore's law could deliver in terms of
            compute capacity. The bottleneck that didn't allow monolithic
            application servers to utilize more than one VM was state  -
            both in-memory and filesystem.
          </p>

          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            Long before "the cloud" it became frowned upon to store any data
            that might be shared across requests anywhere else but in memcached
            (and later Redis), even though the application server frameworks were
            literally built for that. The probability of in-memory state breaking
            is small but never zero, which translates into seemingly unbeatable
            error rates at high RPS  - unless you extract that state.
          </p>

          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            Same story with files: before object storage, a common pattern was
            to use a database for all "non-memory" state and never ever rely on
            any files on disk. Database servers were marvels of engineering
            designed to keep the representation of the underlying filesystem
            consistent for all clients  - so it made sense to make use of
            that. You could get even more reliability by using multiple DB
            instances instead of one, each narrowly scoped to its own domain…
            so arguably many of the standard backend patterns of today can be
            traced all the way back to pre-AWS days.
          </p>

          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            Amazon popularized these patterns by launching commercial services
            with unheard-of-before reliability guarantees in 2006: first Simple
            Storage Service for storage (S3, arguably the most important one),
            followed by Elastic Compute Cloud for compute (EC2). This was a
            "holy grail" of sorts  - you could now go as granular as you
            wanted with your applications on EC2, and have them all write files
            to S3, which would ensure consistency. For a few years it looked
            like "scalability solved"  - and the one breakthrough that made
            this possible was clean separation of storage and compute. In-memory
            state was also solved because with EC2 you could now reliably add
            nodes to sharded memcached clusters, which was enough even for
            Facebook.
          </p>

          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            Requests were still served by application server frameworks though,
            sitting on EC2s, keeping some bits of state in memory and reading /
            writing some files  - even if only for system reasons now.
            Remember the tradeoff that application servers made in the early days
            of the internet to forego process-level isolation? This no longer
            made sense because you could have as much compute as you needed, and
            the more isolation, the higher the reliability.
          </p>

          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            I'm obviously omitting lots of important developments, but basically
            this is how containers came to be  - Docker and then
            Kubernetes. A lot like virtualisation allowed to hot-swap hardware in
            data centres without software running in the VMs noticing, a fleet
            of VMs was now running hundreds of thousands of containers, each
            hosting a highly specialised stateless microservice designed to do
            one job well and handle failures and restarts gracefully, wired with
            all sorts of telemetry  - this pattern resembling good old
            division of labour / assembly line, was the way to squeeze even more
            nines out of the system.
          </p>
        </div>
      </FadeIn>

      {/* ---- Visual: The Stack ---- */}
      <FadeIn>
        <div className="my-10 p-6 rounded-xl border border-border/50 bg-[hsl(0,0%,98.5%)]">
          <p className="font-mono-brand text-[11px] uppercase tracking-[0.15em] text-muted-foreground mb-5">
            The Modern Stack (Pre-Serverless)
          </p>
          <div className="flex flex-col items-center gap-2">
            <StackLayer
              label="Web Server"
              sublabel="serves multiple requests"
              width="w-[55%]"
              shade="bg-amber-50"
            />
            <span className="text-muted-foreground/30 text-xs">inside</span>
            <StackLayer
              label="Container"
              sublabel="one microservice per container"
              width="w-[70%]"
              shade="bg-blue-50"
            />
            <span className="text-muted-foreground/30 text-xs">inside</span>
            <StackLayer
              label="Virtual Machine"
              sublabel="orchestrated by Kubernetes"
              width="w-[85%]"
              shade="bg-violet-50"
            />
            <span className="text-muted-foreground/30 text-xs">on top of</span>
            <StackLayer
              label="Hypervisor + Hardware"
              sublabel="the actual iron"
              width="w-full"
              shade="bg-stone-100"
            />
          </div>
        </div>
      </FadeIn>

      <FadeIn>
        <div className="space-y-7">
          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            But why stop there? Why so many layers? Every container takes a
            fixed amount of RAM  - but not every container needs all of it,
            because so many web servers in containers are idle at any given time.
            What if…
          </p>

          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            Yeah. The core idea behind <em>serverless</em> is simple  - if
            you could quickly and reliably provision isolated environments for
            every request in your data centres, you'd need less RAM! CPU can be
            time-shared; RAM cannot  - so there would be less idle CPU
            time, and the economics of your data centre would improve
            significantly.
          </p>

          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            It also happens to be great for reliability because now the server
            is recycled after every request. Even before serverless functions it
            was a best practice to kill containers periodically  - because
            even "pure stateless" services tend to accumulate bits of state here
            and there (e.g. because memory leaks in the foundational system
            libraries). Starting from scratch at the OS level{" "}
            <em>for every request</em> allows to add a couple more nines to your
            system's reliability, which is not possible to achieve in any other
            way.
          </p>
        </div>
      </FadeIn>

      <FadeIn>
        <Callout>Finally, we have solved scalability.</Callout>
      </FadeIn>

      {/* ---- Visual: Evolution timeline ---- */}
      <FadeIn>
        <div className="my-10 p-6 rounded-xl border border-border/50 bg-[hsl(0,0%,98.5%)]">
          <p className="font-mono-brand text-[11px] uppercase tracking-[0.15em] text-muted-foreground mb-5">
            30 Years of Web Infrastructure
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <EraCard
              era="Era 1"
              year="1990"
              title="Static Files"
              detail="URL maps to file on disk. HTTPd reads and returns it."
              isolation="Process per request, shared filesystem"
              accent="bg-stone-400"
            />
            <EraCard
              era="Era 2"
              year="1993"
              title="CGI Scripts"
              detail="Fork a process, exec a Perl script, pipe stdout back as HTTP."
              isolation="Process per request, shared filesystem"
              accent="bg-emerald-400"
            />
            <EraCard
              era="Era 3"
              year="2000s"
              title="App Servers"
              detail="Worker process pools. PHP, Java Servlets, Rails, Django."
              isolation="Shared process, shared filesystem"
              accent="bg-blue-400"
            />
            <EraCard
              era="Era 4"
              year="2006"
              title="Cloud + S3/EC2"
              detail="Separate storage from compute. Stateless services on elastic infra."
              isolation="VM-level isolation, external state"
              accent="bg-violet-400"
            />
            <EraCard
              era="Era 5"
              year="2013"
              title="Containers"
              detail="Docker, then Kubernetes. Microservices. Kill and restart freely."
              isolation="Container-level isolation, no local state"
              accent="bg-orange-400"
            />
            <EraCard
              era="Era 6"
              year="2014"
              title="Serverless"
              detail="Fresh isolated environment per request. Maximum isolation & efficiency."
              isolation="Function-level isolation, zero local state"
              accent="bg-rose-400"
            />
          </div>
        </div>
      </FadeIn>

      {/* ========== BACK TO FILES AND SCRIPTS ========== */}
      <FadeIn>
        <h2 className="font-heading text-[clamp(26px,3.5vw,34px)] leading-[1.25] tracking-[-0.8px] mt-16 mb-6">
          Now Scratch All That, Back to Files and Scripts
        </h2>
      </FadeIn>

      <FadeIn>
        <div className="space-y-7">
          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            With agents, we are back at ground 0. The leading harnesses read
            and write files and use bash, much like those early{" "}
            <code className="font-mono-brand text-[15px] bg-muted/50 px-1.5 py-0.5 rounded">cgi-bin</code>{" "}
            scripts. MCP is (or should I say was?) a stateful protocol. LLMs
            seem to <em>want</em> to live in stateful linux environment  -
            perhaps because bash scripts, various *nix utilities and linux
            itself make a large fraction of the code they've been trained on. So
            if there is any environment that LLMs understand <em>natively</em>{" "}
            without additional tools in the context, it's Linux  - files
            and scripts.
          </p>

          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            Web servers came a long way since HTTPd; it took ~30 years to reach
            the "final form" that is modern web frameworks that are now evolving
            much slower, if at all. But tracing their history shows that every
            step change was driven by a clear <em>why</em>, a bottleneck that
            created a practical problem  - and sure enough, a solution
            emerged.
          </p>

          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            Funnily enough, the evolution of web servers was not the first time
            these patterns emerged. Just before the Internet, we'd reached a
            similar "scalability solved" point at the OS level. Take virtual
            memory or process scheduling  - the designs (and the underlying
            reasons for them) of these OS-level primitives is strikingly similar
            to the patterns that emerged organically 30 years later at the
            datacenter level. Agents are likely to follow a similar arc, perhaps
            faster, but without skipping steps.
          </p>
        </div>
      </FadeIn>

      {/* ---- Visual: Full circle ---- */}
      <FadeIn>
        <div className="my-10 p-6 rounded-xl border border-border/50 bg-[hsl(0,0%,98.5%)]">
          <p className="font-mono-brand text-[11px] uppercase tracking-[0.15em] text-muted-foreground mb-5">
            The Full Circle
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-lg border border-border/60 bg-white">
              <p className="font-mono-brand text-[11px] uppercase tracking-[0.1em] text-muted-foreground mb-3">
                1993  - CGI
              </p>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <span className="text-muted-foreground/50 mt-0.5">&#x2022;</span>
                  <p className="text-[14px] leading-[1.65] text-muted-foreground">
                    Read files, run scripts
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-muted-foreground/50 mt-0.5">&#x2022;</span>
                  <p className="text-[14px] leading-[1.65] text-muted-foreground">
                    Stateful filesystem
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-muted-foreground/50 mt-0.5">&#x2022;</span>
                  <p className="text-[14px] leading-[1.65] text-muted-foreground">
                    Process-level isolation
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-muted-foreground/50 mt-0.5">&#x2022;</span>
                  <p className="text-[14px] leading-[1.65] text-muted-foreground">
                    Perl + bash
                  </p>
                </div>
              </div>
            </div>
            <div className="p-5 rounded-lg border-2 border-foreground/20 bg-white">
              <p className="font-mono-brand text-[11px] uppercase tracking-[0.1em] text-muted-foreground mb-3">
                2025  - Agents
              </p>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <span className="text-foreground/50 mt-0.5">&#x2022;</span>
                  <p className="text-[14px] leading-[1.65]">
                    Read files, run scripts
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-foreground/50 mt-0.5">&#x2022;</span>
                  <p className="text-[14px] leading-[1.65]">
                    Stateful filesystem
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-foreground/50 mt-0.5">&#x2022;</span>
                  <p className="text-[14px] leading-[1.65]">
                    VM-level isolation
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-foreground/50 mt-0.5">&#x2022;</span>
                  <p className="text-[14px] leading-[1.65]">
                    LLM + bash
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* ========== THE NEW HTTP REQUEST ========== */}
      <FadeIn>
        <h2 className="font-heading text-[clamp(26px,3.5vw,34px)] leading-[1.25] tracking-[-0.8px] mt-16 mb-6">
          The New HTTP Request
        </h2>
      </FadeIn>

      <FadeIn>
        <div className="space-y-7">
          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            In a web server a "unit of work" is a request; in agents, it is the
            execution (aka "session" aka "thread"). Every agent seems to follow
            a pattern resembling a messaging app: messages / actions grouped
            into conversations. This pattern likely emerged from the underlying
            architecture of the chat-like "instruct" variation of LLMs that
            started the revolution: predicting the next token is cool but
            post-training it on human dialogs makes it practically useful in a
            broad range of scenarios  - so chat it is.
          </p>
        </div>
      </FadeIn>

      {/* ---- Visual: Unit of work comparison ---- */}
      <FadeIn>
        <div className="my-10 p-6 rounded-xl border border-border/50 bg-[hsl(0,0%,98.5%)]">
          <p className="font-mono-brand text-[11px] uppercase tracking-[0.15em] text-muted-foreground mb-5">
            Unit of Work
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-lg border border-border/60 bg-white text-center">
              <p className="font-mono-brand text-[11px] uppercase tracking-[0.1em] text-muted-foreground mb-2">
                Web Server
              </p>
              <p className="font-heading text-[24px] tracking-[-0.5px] mb-1">
                HTTP Request
              </p>
              <p className="text-[13px] text-muted-foreground">
                milliseconds &middot; stateless &middot; isolated
              </p>
            </div>
            <div className="p-5 rounded-lg border-2 border-foreground/20 bg-white text-center">
              <p className="font-mono-brand text-[11px] uppercase tracking-[0.1em] text-muted-foreground mb-2">
                Agent
              </p>
              <p className="font-heading text-[24px] tracking-[-0.5px] mb-1">
                Execution / Session
              </p>
              <p className="text-[13px] text-muted-foreground">
                minutes to hours &middot; stateful &middot; isolated
              </p>
            </div>
          </div>
        </div>
      </FadeIn>

      <FadeIn>
        <div className="space-y-7">
          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            The internals of the emerging AI stack are likely here to stay just
            the way they are for a very long time. Apache, which is a fork of
            the original HTTPd built by Tim Berners Lee, was the #1 web server
            by popularity all the way until late 2010s, and is still serving
            roughly 30% of the Internet traffic in 2026. Given the explosive
            growth of popularity of LLMs with no end in sight, similarly to the
            early days of the Internet, only small incremental changes to the
            already-working designs are likely to survive the test of history,
            even if they seem suboptimal at times. It happened the way it
            happened; for many years ahead the utility of major changes to how it
            all works under the hood will be very low; and conversely, the
            utility of making what already exists work as-is for different
            problems at hand will be high. Just like it transpired with the
            Internet.
          </p>

          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            The implications of it I'm most concerned with are the ones for
            builders. It is tempting to rethink everything from first principles
            and show the world the "right way". But do you remember CORBA? Few
            do; however it was technically superior to HTTP in almost every way.
            Same for ATM vs TCP/IP. Same for every attempt to replace JavaScript
            with something more sensible. With such once-in-a-generation things,
            the fact that the entire world is using them dwarfs every other
            concern, and seemingly random designs become industry standards just
            because they were the first.
          </p>
        </div>
      </FadeIn>

      <FadeIn>
        <Callout>
          JavaScript was so wrong for the first 20 years of its existence,
          however that didn't stop it from becoming the most popular programming
          language.
        </Callout>
      </FadeIn>

      {/* ---- Visual: "Right" vs "First" ---- */}
      <FadeIn>
        <div className="my-10 p-6 rounded-xl border border-border/50 bg-[hsl(0,0%,98.5%)]">
          <p className="font-mono-brand text-[11px] uppercase tracking-[0.15em] text-muted-foreground mb-5">
            "Right" vs "First"  - First Always Wins
          </p>
          <div className="space-y-2.5">
            {[
              { right: "CORBA", first: "HTTP", domain: "Remote procedure calls" },
              { right: "ATM", first: "TCP/IP", domain: "Network protocols" },
              { right: "Dart / CoffeeScript / etc.", first: "JavaScript", domain: "Browser language" },
              {
                right: "Stateless agent + sandbox-as-tool",
                first: "Agent running inside a sandbox",
                domain: "Agent execution",
              },
            ].map((row) => (
              <div
                key={row.domain}
                className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 p-3 rounded-md bg-white border border-border/40"
              >
                <div className="text-right">
                  <p className="font-mono-brand text-[12px] text-muted-foreground line-through decoration-muted-foreground/40">
                    {row.right}
                  </p>
                </div>
                <div className="text-center">
                  <span className="font-mono-brand text-[10px] text-muted-foreground/50">
                    vs
                  </span>
                </div>
                <div>
                  <p className="font-mono-brand text-[12px] font-medium">
                    {row.first}
                  </p>
                  <p className="font-mono-brand text-[10px] text-muted-foreground">
                    {row.domain}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </FadeIn>

      <FadeIn>
        <div className="space-y-7">
          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            Specific example: there's an ongoing debate on merits of running
            agents inside sandboxes as opposed to using sandboxes as tools with
            a stateless agent loop outside it. I described it in more detail in{" "}
            <a
              href="https://x.com/IgorZIJ/status/2033316871928254530"
              target="_blank"
              className="underline hover:text-foreground/70 transition-colors"
            >
              The Agentic Workload
            </a>
            . The proponents of the "as tool" approach are probably right
             - it is, indeed, better in almost every way. But it also
            couldn't matter less. CLI agents happened the way they happened
            almost by accident, likely as an unintended consequence of the way
            LLMs were trained. But now that's history.
          </p>

          <p className="text-[17px] leading-[1.75] tracking-[-0.1px]">
            So you should <em>absolutely</em> run your agent inside a sandbox.
            For example in{" "}
            <a
              href="http://opencomputer.dev"
              target="_blank"
              className="underline hover:text-foreground/70 transition-colors"
            >
              opencomputer
            </a>
            . Embrace the imperfections! They are here to stay.
          </p>
        </div>
      </FadeIn>

      {/* ---- Bottom CTA ---- */}
      <FadeIn>
        <div className="mt-20 pt-10 border-t border-border">
          <p className="text-[15px] text-muted-foreground mb-4">
            Give your agents a real computer.
          </p>
          <div className="flex gap-3 items-center flex-wrap">
            <a
              href="https://app.opencomputer.dev"
              className="inline-block text-[15px] font-medium px-8 py-3 rounded-md bg-primary text-primary-foreground border border-primary hover:bg-foreground/90 transition-all duration-150"
            >
              Try it now &rarr;
            </a>
            <a
              href="https://github.com/diggerhq/opencomputer"
              target="_blank"
              className="inline-block text-[15px] font-medium px-8 py-3 rounded-md bg-background text-foreground border border-border hover:border-foreground transition-all duration-150"
            >
              GitHub
            </a>
          </div>
        </div>
      </FadeIn>
    </SitePageLayout>
  );
};

export default AgentExecutionNewHttpRequest;
