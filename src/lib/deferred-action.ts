// Deferred action — the deeplink the hero prompt box sends users to.
//
// The app (app.opencomputer.dev) exposes a /do route that decodes an "action
// envelope" from the ?action= query param and executes it after the user is
// signed in — creating the account first if needed. This lets an anonymous
// visitor type a prompt here, go through signup, and land on their created
// agent with the prompt prefilled.
//
// The envelope format and the base64url algorithm below are a contract with
// the app; keep them byte-compatible with
// opencomputer/web/src/lib/deferred-actions.ts (encodeAction). See
// .agents/work/deferred-action-deeplink.md.

export type ActionEnvelope = {
  v: 1
  type: string
  params: Record<string, unknown>
}

// Unicode-safe base64url. btoa operates on binary strings, so we round-trip
// through UTF-8 bytes — a naive btoa(JSON.stringify(...)) throws on emoji/CJK.
export function encodeAction(envelope: ActionEnvelope): string {
  const bytes = new TextEncoder().encode(JSON.stringify(envelope))
  let bin = ""
  for (const b of bytes) bin += String.fromCharCode(b)
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}

// Keep in lockstep with the app's prompt cap so a long prompt still fits the
// signup round-trip (the app rejects longer ones).
const PROMPT_MAX = 1000

// Build the app URL for "prefill an agent with this prompt". Inbound campaign
// params on the CURRENT page (utm_*, gclid, fbclid, ref, …) are forwarded as
// sibling params so signup attribution survives the hop — they must NOT go
// inside the envelope.
export function agentPrefillUrl(appUrl: string, prompt: string): string {
  const q = prompt.trim()
  if (!q) return appUrl
  const action = encodeAction({
    v: 1,
    type: "agent_prefill",
    params: { prompt: q.slice(0, PROMPT_MAX) },
  })
  const params = new URLSearchParams(window.location.search)
  params.set("action", action)
  return `${appUrl}/do?${params.toString()}`
}
