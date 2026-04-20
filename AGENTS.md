# opencomputer-site-v1

Marketing site and blog for OpenComputer (opencomputer.dev).
Vite + React + React Router + Tailwind, deployed to Cloudflare Workers
via Wrangler.

## Blog posts are hardcoded React components, not MDX

Each post is a full component in `src/pages/blog/`. No CMS, no
markdown, no frontmatter. Existing posts are the template.

## Adding a blog post touches three places

1. `src/pages/blog/YourPost.tsx` — the component.
2. `src/App.tsx` — register dual routes under `/blog/<slug>` and
   `/guides/<slug>` (both prefixes alias to the same component).
3. `vite-plugin-blog-meta.ts` — add a `BlogMeta` entry. This
   generates `dist/blog/<slug>/index.html` and `dist/guides/<slug>/index.html`
   with OG/Twitter meta at build time. Missing here = no social
   preview and no crawlable per-slug HTML, even though the SPA
   route still renders.

## `/blog/*` and `/guides/*` are mirror routes

Every post is registered twice in `src/App.tsx`. Rename a slug =
rename both. Add a post = add both. The plugin in
`vite-plugin-blog-meta.ts` also emits both prefixes.

## Dev-only routes swap via Vite alias

`vite.config.ts` swaps `@/dev-routes` between `src/dev/DevRoutes.tsx`
(dev build) and `src/dev/NoopRoutes.tsx` (prod build). AnimationLab
and related tooling live behind this — routes present in dev will
404 in prod on purpose.

## Deploy target is Cloudflare Workers

`wrangler.toml` — SPA mode, assets from `./dist`, trailing-slash
normalization on. `npm run build` produces the deployable, `wrangler
deploy` ships it. The build step runs the blog-meta plugin; plain
`vite build` alone will not produce correct per-post HTML.

## Where to look

- Landing page: `src/pages/Index.tsx`
- Blog index: `src/pages/blog/Blog.tsx`
- Blog metadata (source of truth for per-post HTML): `vite-plugin-blog-meta.ts`
- Route table: `src/App.tsx`
- UI primitives: `src/components/ui/` (shadcn-ui)
- Animations: `src/animations/`
- Scripts + deps: `package.json`
