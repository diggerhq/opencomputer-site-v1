import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { BundledLanguage } from "shiki";
import FadeIn from "@/components/FadeIn";
import ShikiCodeBlock from "@/components/ShikiCodeBlock";
import SitePageLayout from "@/components/SitePageLayout";
import SEO from "@/components/SEO";

/* ---------- Table of contents ---------- */
type TocItem = { id: string; label: string; sub?: boolean };
const TOC_ITEMS: TocItem[] = [
  { id: "what-youll-build", label: "What you'll build" },
  { id: "architecture", label: "Architecture" },
  { id: "prerequisites", label: "Prerequisites" },
  { id: "compose", label: "1. Compose services", sub: true },
  { id: "schema", label: "2. Task schema", sub: true },
  { id: "approval-gate", label: "3. Approval gate", sub: true },
  { id: "routing", label: "4. Routing table", sub: true },
  { id: "tick-loop", label: "5. Agent tick loop", sub: true },
  { id: "adapter", label: "6. Content adapter", sub: true },
  { id: "review-loop", label: "7. Review loop", sub: true },
  { id: "prove-it", label: "8. Prove the gate", sub: true },
  { id: "run-it", label: "Run it locally" },
  { id: "improve", label: "What to improve next" },
  { id: "faq", label: "FAQ" },
];

const TableOfContents = () => {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-80px 0px -70% 0px", threshold: 0 },
    );
    TOC_ITEMS.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <aside
      aria-label="Table of contents"
      className="hidden [@media(min-width:1360px)]:block fixed top-[140px] right-6 w-[150px] max-h-[calc(100vh-180px)] overflow-y-auto z-10"
    >
      <div className="font-mono-brand text-[11px] uppercase tracking-[0.14em] text-muted-foreground mb-3 pb-2 border-b border-border/40">
        Contents
      </div>
      <ul className="space-y-1.5">
        {TOC_ITEMS.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              aria-current={activeId === item.id ? "location" : undefined}
              className={`block font-mono-brand text-[12px] leading-[1.45] no-underline transition-colors ${
                item.sub ? "pl-3" : ""
              } ${
                activeId === item.id
                  ? "text-foreground"
                  : item.sub
                    ? "text-muted-foreground/80 hover:text-foreground"
                    : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
};

/* ---------- Inline code ---------- */
const InlineCode = ({ children }: { children: React.ReactNode }) => (
  <code className="font-mono-brand text-[15px] bg-[hsl(0,0%,93%)] px-1.5 py-0.5 rounded">
    {children}
  </code>
);

/* ---------- Paragraph ---------- */
const P = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <p className={`text-[17px] leading-[1.75] tracking-[-0.1px] ${className}`}>{children}</p>
);

/* ---------- Screenshot / figure (static image) ---------- */
const Figure = ({
  src,
  alt,
  caption,
}: {
  src: string;
  alt: string;
  caption?: string;
}) => (
  <FadeIn>
    <figure className="my-10 -mx-2 sm:mx-0">
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="w-full rounded-lg border border-border/50 bg-white"
      />
      {caption && (
        <figcaption className="font-mono-brand text-[12px] text-muted-foreground mt-3 italic text-center">
          {caption}
        </figcaption>
      )}
    </figure>
  </FadeIn>
);

/* ---------- Code block ---------- */
const Code = ({ code, language }: { code: string; language: BundledLanguage }) => (
  <FadeIn>
    <ShikiCodeBlock
      code={code}
      language={language}
      theme="dark-plus"
      copyable
      className="my-6 border border-border/50 shadow-lg"
      bodyClassName="[&_pre]:px-6 [&_pre]:py-5 [&_pre]:text-[13.5px] [&_pre]:leading-[1.85]"
    />
  </FadeIn>
);

const H2 = ({ id, children }: { id: string; children: React.ReactNode }) => (
  <FadeIn>
    <h2
      id={id}
      className="scroll-mt-24 font-heading text-[clamp(28px,4vw,38px)] leading-[1.35] tracking-[-0.8px] mb-6"
    >
      {children}
    </h2>
  </FadeIn>
);

const H3 = ({ children }: { children: React.ReactNode }) => (
  <h3 className="font-heading text-[20px] leading-[1.4] tracking-[-0.3px] mt-8 mb-3">{children}</h3>
);

const Divider = () => (
  <FadeIn>
    <div className="w-12 h-px bg-border my-10" />
  </FadeIn>
);

const Bullets = ({ items }: { items: React.ReactNode[] }) => (
  <FadeIn>
    <ul className="space-y-2 text-[17px] leading-[1.75] tracking-[-0.1px] pl-1">
      {items.map((item, i) => (
        <li
          key={i}
          className="pl-5 relative before:content-['—'] before:absolute before:left-0 before:text-muted-foreground"
        >
          {item}
        </li>
      ))}
    </ul>
  </FadeIn>
);

/* ---------- Simple data table ---------- */
const DataTable = ({
  head,
  rows,
}: {
  head: React.ReactNode[];
  rows: React.ReactNode[][];
}) => (
  <FadeIn>
    <div className="my-6 overflow-x-auto rounded-lg border border-border/50">
      <table className="w-full text-left text-[14px]">
        <thead>
          <tr className="border-b border-border/50 bg-[hsl(0,0%,97%)]">
            {head.map((cell, i) => (
              <th key={i} className="px-5 py-3 font-medium">
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className={i < rows.length - 1 ? "border-b border-border/50" : ""}>
              {row.map((cell, j) => (
                <td key={j} className="px-5 py-3 align-top">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </FadeIn>
);

const IMG_BASE = "/automated-marketing-team";
const REPO_URL = "https://github.com/ninadpathak/automated-marketing-team";

/* ---------- Code constants ---------- */
const CODE_FLOW = "direction (human) -> eight tasks (orchestrator) -> artifacts (agents)\nartifacts unblock downstream tasks -> drafts stop at Review\napproval (human) -> scheduled (ops) -> learning recorded (ops)";
const CODE_COMPOSE = "    build: ./agents\n    environment:\n      API_URL: http://api:8080\n      TICK_MS: 2000\n      # Content adapter: \"local\" is deterministic and used by the proof.\n      # Set ADAPTER=claude and provide ANTHROPIC_API_KEY to draft with Claude.\n      ADAPTER: ${ADAPTER:-local}\n      ANTHROPIC_API_KEY: ${ANTHROPIC_API_KEY:-}\n    depends_on:\n      api:\n        condition: service_healthy";
const CODE_ENUMS = "-- Stages mirror the board columns, left to right.\nCREATE TYPE stage AS ENUM (\n  'intake', 'strategy', 'research', 'production',\n  'review', 'approved', 'scheduled', 'learning'\n);\n\n-- The eight roles of the marketing team.\nCREATE TYPE team_role AS ENUM (\n  'strategist', 'researcher', 'seo', 'content',\n  'social', 'lifecycle', 'creative', 'ops'\n);";
const CODE_TASKS = "CREATE TABLE tasks (\n  id           serial PRIMARY KEY,\n  direction_id integer NOT NULL,\n  title        text NOT NULL,\n  brief        text NOT NULL DEFAULT '',\n  stage        stage NOT NULL DEFAULT 'intake',\n  role         team_role NOT NULL,\n  owner        text NOT NULL,\n  channel      text NOT NULL DEFAULT '',\n  priority     priority NOT NULL DEFAULT 'p1',\n  due_date     date,\n  external     boolean NOT NULL DEFAULT false,\n  blocked      boolean NOT NULL DEFAULT false,\n  blocked_reason text NOT NULL DEFAULT '',\n  next_action  text NOT NULL DEFAULT '',\n  requires     text[] NOT NULL DEFAULT '{}',\n  produces     text NOT NULL DEFAULT '',\n  created_at   timestamptz NOT NULL DEFAULT now(),\n  updated_at   timestamptz NOT NULL DEFAULT now(),\n  CONSTRAINT tasks_direction_id_fk FOREIGN KEY (direction_id) REFERENCES directions (id)\n);";
const CODE_GUARDRAILS = "// The single enforcement point for human control. Every stage transition and\n// every approval decision passes through these two checks, no matter who asks:\n// the UI, an agent, or curl. Agents identify as \"agent:<role>\" via the\n// X-Actor header; humans as \"human:<name>\".\n\nexport function isHuman(actor) {\n  return typeof actor === 'string' && actor.startsWith('human:');\n}\n\n// Rules, in order:\n// 1. Nothing enters Approved through a stage move. Approved is only reachable\n//    through the /approve endpoint, which records who approved and when.\n// 2. Nothing enters Scheduled without an approval row on the task. Scheduling\n//    is the moment work is committed to the outside world, so the approval\n//    must already exist -- regardless of who requests the move.\n// 3. External tasks (publish, spend, CRM mutation, launch) may never be moved\n//    past Review by an agent. Ops schedules them only after rule 2 is met.\nexport function checkTransition({ actor, task, to, approvalCount }) {\n  if (to === 'approved') {\n    return {\n      ok: false,\n      code: 'USE_APPROVE_ENDPOINT',\n      reason: 'Tasks enter Approved only via POST /api/tasks/:id/approve by a human principal.',\n    };\n  }\n  if (to === 'scheduled' && approvalCount === 0) {\n    return {\n      ok: false,\n      code: 'APPROVAL_REQUIRED',\n      reason: 'This task has no recorded human approval; it cannot be scheduled.',\n    };\n  }\n  if (task.external && !isHuman(actor) && ['scheduled', 'learning'].includes(to) && approvalCount === 0) {\n    return {\n      ok: false,\n      code: 'EXTERNAL_ACTION_GATED',\n      reason: 'External-facing work cannot advance past Review without human approval.',\n    };\n  }\n  return { ok: true };\n}\n\nexport function checkApprove(actor) {\n  if (!isHuman(actor)) {\n    return {\n      ok: false,\n      code: 'HUMAN_APPROVAL_REQUIRED',\n      reason: 'Only a human principal can approve, request changes, or stop work.',\n    };\n  }\n  return { ok: true };\n}";
const CODE_STAGE_ROUTE = "// Stage transitions -- the guardrails module decides, whoever asks.\napp.post('/api/tasks/:id/stage', async (req, res) => {\n  const to = req.body.to;\n  const { rows } = await q('SELECT * FROM tasks WHERE id = $1', [req.params.id]);\n  const task = rows[0];\n  if (!task) return res.status(404).json({ error: 'not found' });\n  const approvals = await q(\n    \"SELECT count(*)::int AS n FROM approvals WHERE task_id = $1 AND decision = 'approved'\",\n    [task.id]\n  );\n  const verdict = checkTransition({ actor: req.actor, task, to, approvalCount: approvals.rows[0].n });\n  if (!verdict.ok) return res.status(403).json({ error: verdict.code, reason: verdict.reason });\n  const updated = await q(\n    'UPDATE tasks SET stage = $1, updated_at = now() WHERE id = $2 RETURNING *',\n    [to, task.id]\n  );\n  await q('INSERT INTO task_events (task_id, actor, action, detail) VALUES ($1,$2,$3,$4)',\n    [task.id, req.actor, 'status', `Moved ${task.stage} -> ${to}`]);\n  res.json(updated.rows[0]);\n});";
const CODE_ROUTING = "export const ROUTING = [\n  { role: 'strategist', title: 'Campaign strategy and bets',            stage: 'strategy', produces: 'strategy_brief', requires: [],                                priority: 'p0' },\n  { role: 'researcher', title: 'Evidence and objections pack',          stage: 'research', produces: 'research_pack',  requires: [],                                priority: 'p0' },\n  { role: 'seo',        title: 'Search opportunity brief',              stage: 'intake',   produces: 'seo_brief',      requires: ['strategy_brief'],                channel: 'blog' },\n  { role: 'creative',   title: 'Creative brief and brand consistency check', stage: 'intake', produces: 'creative_brief', requires: ['strategy_brief'] },\n  { role: 'content',    title: 'Long-form launch draft',                stage: 'intake',   produces: 'draft',          requires: ['strategy_brief', 'research_pack'], channel: 'blog' },\n  { role: 'social',     title: 'Channel-native distribution drafts',    stage: 'intake',   produces: 'social_drafts',  requires: ['draft'],                         channel: 'social', external: true },\n  { role: 'lifecycle',  title: 'Launch nurture email sequence',         stage: 'intake',   produces: 'email_sequence', requires: ['draft'],                         channel: 'email',  external: true },\n  { role: 'ops',        title: 'Weekly scorecard and next experiment',  stage: 'intake',   produces: 'weekly_readout', requires: ['draft'] },\n];";
const CODE_WORKER = "  for (const task of tasks) {\n    const actor = `agent:${task.role}`;\n    const have = artifactKinds[task.direction_id] || [];\n    const ready = task.requires.every((kind) => have.includes(kind));\n\n    try {\n      if (task.stage === 'intake' && ready) {\n        await api(actor, 'POST', `/api/tasks/${task.id}/stage`, { to: workingStage(task.role) });\n        await api(actor, 'PATCH', `/api/tasks/${task.id}`, { next_action: 'Agent drafting' });\n        continue;\n      }\n\n      if (task.stage === workingStage(task.role) && task.artifact_count === 0 && ready) {\n// ...\n        const out = await adapter.generate({ task, direction, brand, inputs });\n        for (const d of out.decisions) {\n          await api(actor, 'POST', `/api/tasks/${task.id}/events`, { action: 'decision', detail: d.detail, source_url: d.source_url });\n        }\n        for (const s of out.sources) {\n          await api(actor, 'POST', `/api/tasks/${task.id}/events`, { action: 'source', detail: s.detail, source_url: s.source_url });\n        }\n        await api(actor, 'POST', `/api/tasks/${task.id}/artifacts`, {\n          kind: task.produces, body: out.body, adapter: useClaude ? 'claude' : 'local',\n        });\n        await api(actor, 'POST', `/api/tasks/${task.id}/stage`, { to: 'review' });\n        await api(actor, 'PATCH', `/api/tasks/${task.id}`, { next_action: 'Awaiting head of marketing review' });";
const CODE_LABEL = "const LABEL = '[local adapter] Deterministic draft assembled from the direction and brand facts. Set ADAPTER=claude for model-written copy.';";
const CODE_CLAUDE = "  const response = await client.messages.create({\n    model: 'claude-opus-5',\n    max_tokens: 16000,\n    thinking: { type: 'adaptive' },\n    system:\n      'You are one role inside an automated marketing team. Write only the artifact requested. ' +\n      'Use only claims marked claim_allowed, never anything matching a claim_prohibited rule, ' +\n      'and follow the voice facts exactly. This is a draft for human review; do not imply it will be published as-is.',\n    messages: [\n      {\n        role: 'user',\n        content: [\n          `Role: ${task.role}. Artifact kind: ${task.produces}. Task: ${task.title}.`,\n          `Campaign: ${direction.campaign}\\nGoal: ${direction.goal}\\nICP: ${direction.icp}\\nPositioning: ${direction.positioning}\\nGuardrails: ${direction.guardrails}`,\n          `Brand facts:\\n${brandBlock}`,\n          inputBlock || '(no upstream artifacts)',\n        ].join('\\n\\n'),\n      },\n    ],\n  });";
const CODE_REQUEST_CHANGES = "app.post('/api/tasks/:id/request-changes', async (req, res) => {\n  const verdict = checkApprove(req.actor);\n  if (!verdict.ok) return res.status(403).json({ error: verdict.code, reason: verdict.reason });\n  const note = req.body.note || 'Changes requested';\n  await q(\"INSERT INTO approvals (task_id, decided_by, decision, note) VALUES ($1,$2,'changes_requested',$3)\",\n    [req.params.id, req.actor, note]);\n  await q('INSERT INTO task_events (task_id, actor, action, detail) VALUES ($1,$2,$3,$4)',\n    [req.params.id, req.actor, 'feedback', note]);\n  const { rows } = await q(\n    \"UPDATE tasks SET stage = 'production', next_action = 'Address reviewer feedback', updated_at = now() WHERE id = $1 RETURNING *\",\n    [req.params.id]\n  );\n  res.json(rows[0]);\n});";
const CODE_OPS = "      // Ops advances approved external work to Scheduled (the guardrail\n      // verifies the approval actually exists) and closes the loop by\n      // recording a learning when scheduled work completes.\n      if (task.stage === 'approved' && task.external && task.approval_count > 0) {\n        await api('agent:ops', 'POST', `/api/tasks/${task.id}/stage`, { to: 'scheduled' });\n        await api('agent:ops', 'PATCH', `/api/tasks/${task.id}`, { next_action: 'Queued for send window; ops monitors' });\n        continue;\n      }\n\n      if (task.stage === 'scheduled') {\n        await api('agent:ops', 'POST', '/api/learnings', {\n          task_id: task.id,\n          summary: `${task.title} shipped after human approval; watching channel ${task.channel || 'n/a'} for signal.`,\n          next_experiment: 'Test the setup-time claim as the lead hook in one channel before scaling it to all three.',\n        });\n        await api('agent:ops', 'POST', `/api/tasks/${task.id}/stage`, { to: 'learning' });\n        await api('agent:ops', 'PATCH', `/api/tasks/${task.id}`, { next_action: 'Learning recorded; feeds next weekly readout' });\n        continue;\n      }";
const CODE_PROOF = "// 6. Approval gate: agents cannot approve or smuggle work into Approved/Scheduled\nconst agentApprove = await call(AGENT, 'POST', `/api/tasks/${draftTask.id}/approve`, {});\nif (agentApprove.status !== 403) fail(`agent approve returned ${agentApprove.status}, expected 403`);\nstep(`agent approve rejected: 403 ${agentApprove.body.error}`);\n\nconst agentMove = await call(AGENT, 'POST', `/api/tasks/${draftTask.id}/stage`, { to: 'approved' });\nif (agentMove.status !== 403) fail(`agent stage move to approved returned ${agentMove.status}, expected 403`);\nstep(`agent stage move to approved rejected: 403 ${agentMove.body.error}`);\n\nconst socialTask = tasks.find((t) => t.produces === 'social_drafts');\nconst agentSchedule = await call('agent:ops', 'POST', `/api/tasks/${socialTask.id}/stage`, { to: 'scheduled' });\nif (agentSchedule.status !== 403) fail(`unapproved schedule returned ${agentSchedule.status}, expected 403`);\nstep(`scheduling without approval rejected: 403 ${agentSchedule.body.error}`);";
const CODE_RUN = "docker compose up -d --build --wait\nopen http://localhost:8080";
const CODE_DOD = "bash proof/dod.sh";

const AutomatedMarketingTeam = () => {
  return (
    <SitePageLayout activeSection="blog" contentAs="article">
      <SEO
        title="Build a Fully Automated Marketing Team with AI Agents"
        description="A cookbook for a local-first marketing team: eight role agents, an orchestrator, and a kanban command center on Docker Compose, with a code-enforced human approval gate so nothing goes live without a recorded sign-off."
        author="Utpal Nadiger"
        path="/blog/automated-marketing-team"
        type="article"
      />

      <TableOfContents />

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
          Build a Fully Automated Marketing Team with AI Agents
        </h1>
      </FadeIn>

      <FadeIn delay={0.08}>
        <p className="font-mono-brand text-[13px] text-muted-foreground mb-10">
          Written by Utpal Nadiger &middot;{" "}
          <time dateTime="2026-07-26">July 26, 2026</time>
        </p>
      </FadeIn>

      {/* ---- Intro ---- */}
      <FadeIn delay={0.12}>
        <div className="space-y-7">
          <P>
            I handed a marketing campaign to eight agents running on my laptop. It takes one
            paragraph of direction, and seconds later a kanban board holds eight role-owned tasks
            that record their decisions and sources as they move.
          </P>
          <P>
            The only rule is, the agents cannot push anything live. Going live takes a human
            approval, and an agent request that tries without one gets a 403.
          </P>
          <P>
            Marketing runs on handoffs, with one person accountable for whatever reaches a
            customer. So the design questions that matter are org questions:
          </P>
        </div>
      </FadeIn>
      <Bullets
        items={[
          "what each role needs before it starts",
          "what it hands off when done",
          "where the human sits",
        ]}
      />
      <FadeIn>
        <div className="space-y-7 mt-7">
          <P>
            The whole thing is open source. Clone the{" "}
            <a href={REPO_URL} target="_blank" rel="noreferrer" className="underline hover:text-foreground">
              GitHub repo
            </a>{" "}
            and <InlineCode>docker compose up -d --build --wait</InlineCode> runs the team while
            you read.
          </P>
        </div>
      </FadeIn>

      <Figure
        src={`${IMG_BASE}/board.jpg`}
        alt="The kanban board a few seconds after boot: eight role-owned tasks, most waiting at Review"
        caption="The board a few seconds after boot: eight role-owned tasks, most waiting at Review."
      />

      <H2 id="what-youll-build">The automated marketing team you&apos;ll build</H2>
      <FadeIn>
        <div className="space-y-7">
          <P>
            A fully automated marketing team with eight agents acting as team members, plus an
            orchestrator that assigns their work and a command center you run them from.
          </P>
          <P>Here are the roles:</P>
        </div>
      </FadeIn>
      <Bullets
        items={[
          <><strong>Strategist</strong> turns your direction into campaign bets and a strategy brief.</>,
          <><strong>Researcher</strong> assembles the evidence pack of proof points and objections.</>,
          <><strong>SEO lead</strong> maps search opportunities for the content work.</>,
          <><strong>Content lead</strong> writes the long-form draft from the strategy and research.</>,
          <><strong>Social lead</strong> derives channel-native drafts from the finished piece.</>,
          <><strong>Lifecycle lead</strong> drafts the nurture email sequence.</>,
          <><strong>Creative director</strong> writes the creative brief and checks brand consistency.</>,
          <><strong>Ops</strong> schedules approved work and keeps the weekly scorecard current.</>,
        ]}
      />
      <FadeIn>
        <div className="space-y-7 mt-7">
          <P>
            Each agent starts only when its inputs exist and leaves a decision trail on its card.
            Finished drafts land with you at Review.
          </P>
          <P>
            Day to day, you set direction and review drafts. Everything in between runs on its
            own, from decomposition through the revision loop.
          </P>
          <P>
            Reviewing a card takes minutes because every claim on it links back to a brand fact.
          </P>
        </div>
      </FadeIn>

      <Divider />

      <H2 id="architecture">How we designed the automated marketing team architecture</H2>
      <DataTable
        head={["Service", "Runs", "Job"]}
        rows={[
          [<InlineCode>db</InlineCode>, "postgres:16", "Single source of truth for everything: work, brand, approvals, metrics"],
          [<InlineCode>api</InlineCode>, "Node + Express", "The REST API, the command center UI, and every guardrail"],
          [<InlineCode>agents</InlineCode>, "Node worker", "The orchestrator and the eight role agents on a 2-second tick"],
        ]}
      />
      <FadeIn>
        <div className="space-y-7">
          <P>Data moves one way through them:</P>
        </div>
      </FadeIn>
      <Code code={CODE_FLOW} language="log" />
      <FadeIn>
        <div className="space-y-7">
          <P>There are three boundaries doing the real work here.</P>
          <P>
            <strong>First</strong>, agents talk to the API, never to the database. The agents
            container is not given a database credential at all.
          </P>
          <P>
            It authenticates every request with an <InlineCode>X-Actor: agent:&lt;role&gt;</InlineCode>{" "}
            header. I considered letting both services share a database client library, which
            would have been less HTTP plumbing, but then every agent becomes a trusted writer and
            the review rule turns into a convention someone eventually breaks.
          </P>
          <P>
            <strong>Second</strong>, approval lives in the database and gets enforced over HTTP.
            Prompt instructions were never going to be enough here, because agents that draft from
            web content and brand docs can be argued into things, and that is all prompt injection
            is.
          </P>
          <P>
            A guardrails module in the API decides every stage transition identically for every
            caller, and it checks for a recorded approval row that only a human endpoint can
            create.
          </P>
          <P>
            <strong>Third</strong>, content generation is an adapter seam. I wanted the proof to
            run offline and reproducibly, but the product only gets interesting with a real model.
          </P>
          <P>
            So there are two implementations of one <InlineCode>generate()</InlineCode> interface,
            and the workflow code never knows which one is loaded.
          </P>
        </div>
      </FadeIn>

      <Divider />

      <H2 id="prerequisites">Prerequisites</H2>
      <Bullets
        items={[
          "Docker with Compose v2. That is the only hard requirement to run the app.",
          "Node 18 or newer on the host, to run the proof script.",
          "Optional: an Anthropic API key if you want live drafting. It enters through the environment only, and nothing in the repo ever contains it.",
        ]}
      />
      <FadeIn>
        <div className="space-y-7 mt-7">
          <P>
            No external accounts or services. Everything binds to{" "}
            <InlineCode>localhost:8080</InlineCode>.
          </P>
        </div>
      </FadeIn>

      <Divider />

      <H2 id="compose">1. Set up the Docker Compose services</H2>
      <FadeIn>
        <div className="space-y-7">
          <P>
            Start with the Compose file, because the agents have to run as a separate container
            that could not reach Postgres even if their code tried, and that separation gets
            decided here. Health checks matter too, because the worker starts firing HTTP requests
            immediately and has to wait for the API to be actually up.
          </P>
          <P>
            <InlineCode>docker-compose.yml</InlineCode> defines <InlineCode>db</InlineCode>{" "}
            (postgres:16 with the schema and seed baked into the image),{" "}
            <InlineCode>api</InlineCode>, and <InlineCode>agents</InlineCode>. The agents service
            is where the boundary shows:
          </P>
        </div>
      </FadeIn>
      <Code code={CODE_COMPOSE} language="yaml" />
      <FadeIn>
        <div className="space-y-7">
          <P>
            The block carries no <InlineCode>DATABASE_URL</InlineCode>, so the worker knows only
            the API origin, the tick cadence, and which adapter to load. The{" "}
            <InlineCode>{"${VAR:-}"}</InlineCode> syntax lets the key pass through from your shell
            without ever being written to a file.
          </P>
          <P>
            Run <InlineCode>docker compose up -d --build --wait</InlineCode> and check that all
            three containers report healthy before moving on. There was one gotcha during the
            image builds: I pinned <InlineCode>@anthropic-ai/sdk</InlineCode> to a version I
            remembered, <InlineCode>^0.116.0</InlineCode>, and <InlineCode>npm install</InlineCode>{" "}
            inside the container failed with an ETARGET &quot;notarget&quot; error because that
            version does not exist.
          </P>
          <P>
            On your machine a stale <InlineCode>node_modules</InlineCode> can paper over a wrong
            pin for months, but a container rebuilds from the registry every time, so a bad pin
            fails on the spot. Run <InlineCode>npm view @anthropic-ai/sdk version</InlineCode>{" "}
            before pinning.
          </P>
        </div>
      </FadeIn>

      <Divider />

      <H2 id="schema">2. Design the schema for agent tasks and handoffs</H2>
      <FadeIn>
        <div className="space-y-7">
          <P>
            The board, the agents, and the proof script all need to agree on what work exists and
            what state it is in, so there is exactly one <InlineCode>tasks</InlineCode> table and
            the kanban board is a projection of it. The stages and roles are Postgres enums, which
            keeps a typo&apos;d stage name from ever being a row:
          </P>
        </div>
      </FadeIn>
      <Code code={CODE_ENUMS} language="sql" />
      <FadeIn>
        <div className="space-y-7">
          <P>
            The columns doing the real work are <InlineCode>requires</InlineCode>,{" "}
            <InlineCode>produces</InlineCode>, and <InlineCode>external</InlineCode>.{" "}
            <InlineCode>requires</InlineCode> is an explicit array of artifact kinds that must
            exist for the same direction before the task may start,{" "}
            <InlineCode>produces</InlineCode> names what the role will hand off, and{" "}
            <InlineCode>external</InlineCode> marks work that touches the outside world once
            scheduled:
          </P>
        </div>
      </FadeIn>
      <Code code={CODE_TASKS} language="sql" />
      <FadeIn>
        <div className="space-y-7">
          <P>
            I first sketched readiness as logic inside each role module, which works but cannot
            tell a head of marketing why a card is stuck. With <InlineCode>requires</InlineCode>{" "}
            as a column, the card itself can say &quot;Waiting on: strategy_brief&quot;.
          </P>
          <P>The rest of the schema:</P>
        </div>
      </FadeIn>
      <DataTable
        head={["Table", "Holds"]}
        rows={[
          [<InlineCode>directions</InlineCode>, "The campaign input: goal, ICP, positioning, budget, channels, guardrails"],
          [<InlineCode>brand_facts</InlineCode>, "Voice rules, allowed and prohibited claims, proof points, competitors, personas"],
          [<InlineCode>artifacts</InlineCode>, "What agents produce, each labeled with the adapter that wrote it"],
          [<InlineCode>task_events</InlineCode>, "Decisions, sources, handoffs, status moves, reviewer feedback"],
          [<InlineCode>approvals</InlineCode>, "Who approved, requested changes, or stopped work, and why"],
          [<><InlineCode>metrics</InlineCode>, <InlineCode>learnings</InlineCode></>, "The scorecard rows, each metric with its attribution assumption"],
        ]}
      />
      <FadeIn>
        <div className="space-y-7">
          <P>
            The seed loads a fictional brand base and one campaign, so the board fills up on first
            boot without any setup.
          </P>
          <P>
            Check it by booting and opening the Brand tab, where the facts should be grouped by
            kind with their source links.
          </P>
        </div>
      </FadeIn>

      <Divider />

      <H2 id="approval-gate">3. Enforce human approval at the API layer</H2>
      <FadeIn>
        <div className="space-y-7">
          <P>
            Agents in this system never take an external action on their own. That rule lives in a
            single module the API consults on every state change, keyed to who is asking, instead
            of in any agent&apos;s prompt:
          </P>
        </div>
      </FadeIn>
      <Code code={CODE_GUARDRAILS} language="javascript" />
      <FadeIn>
        <div className="space-y-7">
          <P>
            The transition route is the only way any caller changes a task&apos;s stage, and it
            asks this module first:
          </P>
        </div>
      </FadeIn>
      <Code code={CODE_STAGE_ROUTE} language="javascript" />
      <FadeIn>
        <div className="space-y-7">
          <P>
            The <InlineCode>X-Actor</InlineCode> header is a stand-in for real authentication.
            That is fine for a local-first app where you control every caller, and it is the first
            thing to replace if this ever faces a network.
          </P>
          <P>The rest of the structure survives that swap unchanged.</P>
          <P>
            Check it with curl. An approve call carrying{" "}
            <InlineCode>X-Actor: agent:content</InlineCode> must return 403 with{" "}
            <InlineCode>HUMAN_APPROVAL_REQUIRED</InlineCode>, and the same call with a{" "}
            <InlineCode>human:</InlineCode> actor must succeed.
          </P>
        </div>
      </FadeIn>

      <Divider />

      <H2 id="routing">4. Route campaign direction into agent tasks</H2>
      <FadeIn>
        <div className="space-y-7">
          <P>
            The decomposition itself should be boring, because the shape of a marketing team does
            not change per campaign. So the routing is a data table rather than an LLM planner,
            with eight specs naming each role, its starting stage, its output, and its inputs.
          </P>
          <P>
            An LLM planner would make the task set nondeterministic, which makes the board
            unpredictable and the pipeline untestable. It would also burn model calls on a
            decision that never changes.
          </P>
        </div>
      </FadeIn>
      <Code code={CODE_ROUTING} language="javascript" />
      <FadeIn>
        <div className="space-y-7">
          <P>
            You can read the org chart straight off the table, including which two roles produce
            work that needs sign-off before it ships.
          </P>
          <P>
            The orchestrator walks it once per new direction. Each task gets created through the
            API with a handoff event explaining where it came from, and the direction is marked
            routed at the end.
          </P>
          <P>
            Check it by posting a direction and listing tasks a couple of seconds later. There
            should be eight, and the two marked <InlineCode>external</InlineCode> should be social
            and lifecycle.
          </P>
        </div>
      </FadeIn>

      <Divider />

      <H2 id="tick-loop">5. Run the agents on a tick loop with input gates</H2>
      <FadeIn>
        <div className="space-y-7">
          <P>
            Each agent is a branch in a tick loop, with no long-running process and no memory
            between ticks. Every two seconds the worker pulls one composite{" "}
            <InlineCode>/api/work</InlineCode> payload (unrouted directions, live tasks, and which
            artifact kinds already exist per direction) and walks the tasks.
          </P>
          <P>
            The readiness rule from the schema becomes one line, and the drafting path records its
            reasoning before it hands anything off:
          </P>
        </div>
      </FadeIn>
      <Code code={CODE_WORKER} language="javascript" />
      <FadeIn>
        <div className="space-y-7">
          <P>
            The elided part loads the direction and brand facts, plus the bodies of whatever
            artifacts the task requires, through the same API everything else uses. There are two
            deliberate details here:
          </P>
        </div>
      </FadeIn>
      <Bullets
        items={[
          "Decisions and sources get posted as events before the artifact, so even a half-finished run leaves its trail on the card.",
          "Every stage move goes through the guarded transition route as the agent's own actor, so a coding mistake in this loop cannot do anything the guardrails would refuse. A 403 lands in the catch block as a log line and the loop moves to the next task.",
        ]}
      />
      <FadeIn>
        <div className="space-y-7 mt-7">
          <P>
            Check it on the board: content should sit in Intake showing &quot;Waiting on:
            strategy_brief, research_pack&quot; until both exist, then move through In production
            to Review on its own.
          </P>
        </div>
      </FadeIn>

      <Divider />

      <H2 id="adapter">6. Draft with a swappable content adapter</H2>
      <FadeIn>
        <div className="space-y-7">
          <P>
            Both adapters implement one function,{" "}
            <InlineCode>{"generate({ task, direction, brand, inputs })"}</InlineCode>, returning a
            body plus the decisions and sources to record. The local adapter assembles
            deliberately flat, templated copy from the brand facts, and its first line tells you
            exactly what it is:
          </P>
        </div>
      </FadeIn>
      <Code code={CODE_LABEL} language="javascript" />
      <FadeIn>
        <div className="space-y-7">
          <P>
            The label is there because local-adapter output is flat on purpose and should never
            pass for marketing copy. Its job is proving the pipeline works without a network call.
          </P>
          <P>
            The Claude adapter fills the same seam with a real model, and the brand base rides
            along as hard constraints in the system prompt:
          </P>
        </div>
      </FadeIn>
      <Code code={CODE_CLAUDE} language="javascript" />
      <FadeIn>
        <div className="space-y-7">
          <P>
            The <InlineCode>@anthropic-ai/sdk</InlineCode> package handles the transport, so the
            adapter really is this small.
          </P>
          <P>
            Nothing about control changes with the real model either. Claude writes drafts, and
            whether a draft ships is still decided at the Review column by a person.
          </P>
          <P>
            Check it by running{" "}
            <InlineCode>ADAPTER=claude ANTHROPIC_API_KEY=... docker compose up -d</InlineCode> and
            opening any artifact. The body should open with the{" "}
            <InlineCode>[claude adapter: claude-opus-4-8]</InlineCode> tag instead of the local
            label, and the workflow should behave identically.
          </P>
        </div>
      </FadeIn>

      <Divider />

      <H2 id="review-loop">7. Handle review verdicts and the learning loop</H2>
      <FadeIn>
        <div className="space-y-7">
          <P>The human gets three verbs at the gate, all recorded in the approvals table:</P>
        </div>
      </FadeIn>
      <Bullets
        items={[
          <><strong>Approve</strong> writes the approval row and moves the task to Approved.</>,
          <><strong>Request changes</strong> files your note as feedback and sends the task back to production.</>,
          <><strong>Stop work</strong> blocks the task with a reason, shown as a badge on the board.</>,
        ]}
      />
      <FadeIn>
        <div className="space-y-7 mt-7">
          <P>The request-changes path is the one with a loop behind it:</P>
        </div>
      </FadeIn>
      <Code code={CODE_REQUEST_CHANGES} language="javascript" />
      <FadeIn>
        <div className="space-y-7">
          <P>
            On the next tick, the owning agent notices its task back in the working stage with
            feedback in the log, redrafts with the note appended to the artifact, and returns it
            to Review.
          </P>
          <P>After an approval, ops takes over mechanically:</P>
        </div>
      </FadeIn>
      <Code code={CODE_OPS} language="javascript" />
      <FadeIn>
        <div className="space-y-7">
          <P>
            Ops gets no special treatment. Its move into Scheduled passes through the same
            transition route, and the guardrail re-checks that the approval row really exists.
          </P>
          <P>
            The learning it records shows up on the Scorecard tab next to the funnel metrics, and
            each metric carries its attribution assumption as a label, so nobody has to guess how
            &quot;qualified&quot; was counted.
          </P>
          <P>
            Check it by rejecting a draft with a note and watching the revision arrive. Then
            approve an external task and confirm a learning appears on the scorecard.
          </P>
        </div>
      </FadeIn>

      <Divider />

      <H2 id="prove-it">8. Test the approval gate end to end</H2>
      <FadeIn>
        <div className="space-y-7">
          <P>
            I cared less about proving the happy path than about proving the approval boundary
            holds when an agent pushes on it. So the proof script talks to the API as an agent
            principal and asserts the refusals by error code, then completes the loop as the
            human.
          </P>
          <P>
            I rejected asserting against the database directly, because that would keep passing
            even if someone broke the API-level gate, and the gate breaking silently is the
            failure I most wanted to rule out.
          </P>
        </div>
      </FadeIn>
      <Code code={CODE_PROOF} language="javascript" />
      <FadeIn>
        <div className="space-y-7">
          <P>The three rejections cover three different failure modes:</P>
        </div>
      </FadeIn>
      <DataTable
        head={["Attempt, as an agent", "Response"]}
        rows={[
          [<InlineCode>POST /api/tasks/:id/approve</InlineCode>, <InlineCode>403 HUMAN_APPROVAL_REQUIRED</InlineCode>],
          [<>Stage move into <InlineCode>approved</InlineCode></>, <InlineCode>403 USE_APPROVE_ENDPOINT</InlineCode>],
          [<>Stage move into <InlineCode>scheduled</InlineCode> with no approval row</>, <InlineCode>403 APPROVAL_REQUIRED</InlineCode>],
        ]}
      />
      <FadeIn>
        <div className="space-y-7">
          <P>Around the rejections, the script also walks the happy path:</P>
        </div>
      </FadeIn>
      <Bullets
        items={[
          "posts a fresh direction and waits for the orchestrator's eight tasks",
          "verifies the content draft reached Review with decision and source events",
          "approves as the human and waits for ops to schedule",
          "confirms the learning landed on the scorecard",
        ]}
      />
      <FadeIn>
        <div className="space-y-7 mt-7">
          <P>
            <InlineCode>bash proof/dod.sh</InlineCode> wraps it in{" "}
            <InlineCode>docker compose up -d --build --wait</InlineCode> and exits nonzero if any
            step fails.
          </P>
        </div>
      </FadeIn>

      <Divider />

      <H2 id="run-it">Run the marketing team locally</H2>
      <FadeIn>
        <div className="space-y-7">
          <P>From a clean checkout:</P>
        </div>
      </FadeIn>
      <Code code={CODE_RUN} language="bash" />
      <FadeIn>
        <div className="space-y-7">
          <P>
            The seed brand (Harborlight Analytics, a fictional product-analytics tool) and its Q3
            campaign populate the board without you doing anything. Open the &quot;Channel-native
            distribution drafts&quot; card and you will find:
          </P>
        </div>
      </FadeIn>
      <Bullets
        items={[
          "the agent's brief and its labeled draft",
          "the recorded decision that every social claim was derived from the long-form draft rather than written fresh",
          "source links into the brand base",
          "the external badge explaining why this card cannot leave Review without you",
        ]}
      />
      <Figure
        src={`${IMG_BASE}/task-drawer.jpg`}
        alt="The task drawer: brief, labeled artifact, decision and source trail, and the three human verbs"
        caption="The task drawer: brief, labeled artifact, decision and source trail, and the three human verbs."
      />
      <FadeIn>
        <div className="space-y-7">
          <P>
            Type your own direction on the Direction tab and watch eight new cards appear and
            start moving. After you approve external work, the Scorecard tab connects it to the
            funnel, with every attribution assumption printed next to its number:
          </P>
        </div>
      </FadeIn>
      <Figure
        src={`${IMG_BASE}/scorecard.jpg`}
        alt="The scorecard: assumption-labeled weekly funnel, learnings, and the next recommended experiment"
        caption="The scorecard: assumption-labeled weekly funnel, learnings, and the next recommended experiment."
      />
      <FadeIn>
        <div className="space-y-7">
          <P>Then run the scripted version:</P>
        </div>
      </FadeIn>
      <Code code={CODE_DOD} language="bash" />
      <FadeIn>
        <div className="space-y-7">
          <P>
            It prints each step as it verifies it and ends with PROOF PASSED. If you want to see
            the gate fail closed, curl the approve endpoint with an <InlineCode>agent:</InlineCode>{" "}
            actor and read the 403.
          </P>
        </div>
      </FadeIn>

      <Divider />

      <H2 id="improve">What to improve next</H2>
      <Bullets
        items={[
          <>Replace the <InlineCode>X-Actor</InlineCode> header with real authentication before this touches a network.</>,
          "Give the Claude adapter per-role prompt shaping and a second-pass critique against the brand base. The artifact-and-events structure already has room for it.",
          <>Add channel connectors (an ESP, a social scheduler) as new external task types behind the same approval gate. The <InlineCode>external</InlineCode> flag was built to absorb exactly that.</>,
          "Ingest real metrics into the scorecard instead of seeded rows.",
          "Let an LLM assist the orchestrator with campaign-specific task titles and briefs, while the routing table stays as the floor it cannot drop below.",
        ]}
      />
      <FadeIn>
        <div className="space-y-7 mt-7">
          <P>
            None of this is marketing specific. Handing any org function to agents comes down to
            the same moves:
          </P>
        </div>
      </FadeIn>
      <Bullets
        items={[
          "write the roles down as data",
          "make every handoff an artifact",
          <>turn each &quot;the AI must never&quot; sentence into code that returns a 403</>,
        ]}
      />

      <Divider />

      <H2 id="faq">FAQ</H2>
      <FadeIn>
        <div className="space-y-2">
          <H3>Can the agents publish or send anything on their own?</H3>
          <P>
            No. Publishing, spend, CRM changes, and launches sit behind the approval gate in the
            API, and an agent request that tries gets a 403 with a named error code.
          </P>
          <H3>Do I need an Anthropic API key to run this?</H3>
          <P>
            No. The default local adapter drafts clearly labeled templates with no external API,
            and setting <InlineCode>ADAPTER=claude</InlineCode> with a key in the environment
            switches on real drafting.
          </P>
          <H3>What happens when I reject a draft?</H3>
          <P>
            Request changes files your note as feedback and sends the task back to production. The
            owning agent redrafts with the note attached and returns the task to Review on the
            next tick.
          </P>
          <H3>How do I know the approval gate actually holds?</H3>
          <P>
            The proof script talks to the API as an agent principal and asserts the three refusal
            codes before completing the loop as the human. Run{" "}
            <InlineCode>bash proof/dod.sh</InlineCode> and it exits nonzero if any step fails.
          </P>
        </div>
      </FadeIn>

      <Divider />

      <FadeIn>
        <div className="space-y-7">
          <P>
            Get the code from the{" "}
            <a href={REPO_URL} target="_blank" rel="noreferrer" className="underline hover:text-foreground">
              GitHub repo
            </a>
            .
          </P>
        </div>
      </FadeIn>
    </SitePageLayout>
  );
};

export default AutomatedMarketingTeam;
