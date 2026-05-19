import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import FadeIn from "@/components/FadeIn";
import SitePageLayout from "@/components/SitePageLayout";
import SEO from "@/components/SEO";

// Clawputer landing — Poke-style dead-simple setup, ported into the
// opencomputer.dev site. One job above the fold: get a visitor into a
// working iMessage or Telegram conversation in two taps. Use cases
// render as a single iMessage thread instead of a card grid.

const POOL_PHONE_E164 = "+16462427398";
const POOL_PHONE_DISPLAY = "+1 (646) 242-7398";
const TELEGRAM_BOT_USERNAME = "clawputer_the_bot";
const TELEGRAM_LINK = `https://t.me/${TELEGRAM_BOT_USERNAME}`;
// iOS uses & as the body separator on sms: links; Android also accepts it.
const SMS_DEEP_LINK = `sms:${POOL_PHONE_E164}&body=${encodeURIComponent("hi")}`;

type Channel = "imessage" | "telegram";

const CHANNELS: Record<Channel, {
  title: string;
  hint: string;
  qrValue: string;
  copyValue: string;
  copyDisplay: string;
  buttonHref: string;
  buttonLabel: string;
  switchLabel: string;
  switchTo: Channel;
}> = {
  imessage: {
    title: "iMessage",
    hint: "Scan with your iPhone camera, or tap below.",
    qrValue: SMS_DEEP_LINK,
    copyValue: POOL_PHONE_E164,
    copyDisplay: POOL_PHONE_DISPLAY,
    buttonHref: SMS_DEEP_LINK,
    buttonLabel: "Open iMessage",
    switchLabel: "Try Telegram instead",
    switchTo: "telegram",
  },
  telegram: {
    title: "Telegram",
    hint: "Scan with any phone, or tap below.",
    qrValue: TELEGRAM_LINK,
    copyValue: `@${TELEGRAM_BOT_USERNAME}`,
    copyDisplay: `@${TELEGRAM_BOT_USERNAME}`,
    buttonHref: TELEGRAM_LINK,
    buttonLabel: "Open Telegram",
    switchLabel: "Try iMessage instead",
    switchTo: "imessage",
  },
};

// Single chat thread — same exchanges as clawputer.dev, last reply is a
// "typing" indicator so the section reads like a live conversation.
type Exchange =
  | { prompt: string; reply: string }
  | { prompt: string; typing: string };

const THREAD: Exchange[] = [
  {
    prompt: "Every weekday at 8am, text me my calendar + anything urgent in email.",
    reply: "Got it. First brief lands tomorrow at 8:00 AM PT.",
  },
  {
    prompt: "Find 30 min with Jane next week and send the invite.",
    reply: "Wed 2:30–3pm works for both of you. Invite sent.",
  },
  {
    prompt: "Ping me whenever anyone with >10k followers tweets about clawputer.",
    reply: "Watching. I'll text you the first match.",
  },
  {
    prompt: "Bump the Stripe SDK, run the tests, open a PR.",
    reply: "PR #482 open — all green. Squash & merge?",
  },
  {
    prompt: "Compare the top 3 Postgres-on-K8s operators. Two paragraphs, cite sources.",
    typing: "Spinning up a browser in the sandbox…",
  },
];

const PRICE_INCLUDES = [
  "Your own iMessage- or Telegram-native AI agent",
  "Always-on Linux sandbox per agent — files, browser, terminal",
  "Persistent memory via gbrain (Postgres + vector)",
  "Tokens included during early access",
  "No app to install, no signup form, no rate limits",
];

function CopyPill({ value, display }: { value: string; display: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          setTimeout(() => setCopied(false), 1400);
        } catch {
          /* clipboard blocked — user can still read the value */
        }
      }}
      aria-label={`Copy ${display}`}
      className="w-full bg-[hsl(40,15%,18%)] text-background rounded-xl px-4 py-3 flex items-center justify-between gap-3 font-mono-brand text-[14px] tracking-[0.01em] hover:bg-[hsl(40,15%,22%)] transition-colors"
    >
      <span className="flex-1 text-center truncate">{display}</span>
      <span className="inline-flex items-center text-background/60" aria-hidden>
        {copied ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
        )}
      </span>
    </button>
  );
}

function ClawputerMark() {
  return (
    <span className="inline-flex w-14 h-14 rounded-[13px] items-center justify-center" aria-hidden>
      <svg width="56" height="56" viewBox="0 0 40 40">
        <rect width="40" height="40" rx="9" className="fill-foreground" />
        <path
          d="M27 14.5a8.5 8.5 0 1 0 0 11"
          fill="none"
          className="stroke-background"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}

const Clawputer = () => {
  const [channel, setChannel] = useState<Channel>("imessage");
  const c = CHANNELS[channel];

  return (
    <SitePageLayout>
      {/* ── Hero ── */}
      <FadeIn>
        <div className="flex flex-col items-center text-center gap-4 mb-12">
          <ClawputerMark />
          <h1 className="font-heading text-[clamp(44px,7vw,72px)] leading-[1.02] tracking-[-1.6px] font-medium mt-2">
            Welcome to clawputer.
          </h1>
          <p className="text-[clamp(18px,2vw,22px)] leading-[1.4] font-medium max-w-[560px] text-foreground">
            A personal AI assistant with a real computer and memory that sticks.
          </p>
          <p className="text-[15px] text-muted-foreground max-w-[440px]">
            Send a text to get started.
          </p>
        </div>
      </FadeIn>

      {/* ── Channel card ── */}
      <FadeIn delay={0.08}>
        <div className="flex justify-center mb-20">
          <div className="bg-foreground text-background rounded-[26px] p-7 pb-6 w-full max-w-[360px] flex flex-col items-center gap-[18px] shadow-[0_1px_0_rgba(0,0,0,0.04),0_28px_70px_-30px_hsla(45,10%,8%,0.5)] transition-colors">
            <div className="text-center flex flex-col gap-1.5 w-full">
              <h2 className="font-heading text-[30px] tracking-[-0.3px] font-medium m-0">{c.title}</h2>
              <p className="text-[13px] text-background/60 m-0">{c.hint}</p>
            </div>
            <div className="bg-[hsl(40,15%,18%)] rounded-[18px] p-5 w-full flex items-center justify-center">
              <QRCodeSVG
                key={channel}
                value={c.qrValue}
                size={220}
                bgColor="transparent"
                fgColor="hsl(40, 33%, 97%)"
                level="M"
                marginSize={0}
                className="w-full h-auto max-w-[240px] block"
              />
            </div>
            <CopyPill value={c.copyValue} display={c.copyDisplay} />
            <a
              className="w-full inline-flex items-center justify-center bg-background text-foreground rounded-xl px-4 py-3.5 text-[15px] font-semibold tracking-[0.005em] no-underline hover:bg-white active:translate-y-px transition-all"
              href={c.buttonHref}
            >
              {c.buttonLabel}
            </a>
            <button
              type="button"
              onClick={() => setChannel(c.switchTo)}
              className="mt-1 text-[13px] text-background/60 hover:text-background tracking-[0.01em] px-2 py-1.5 rounded-md transition-colors"
            >
              {c.switchLabel} →
            </button>
          </div>
        </div>
      </FadeIn>

      {/* ── Just text it ── single iMessage thread ── */}
      <FadeIn>
        <div className="flex flex-col items-center gap-8 mb-24">
          <div className="flex flex-col gap-2 max-w-[520px] text-center items-center">
            <h2 className="font-heading text-[clamp(30px,4vw,44px)] leading-[1.05] tracking-[-0.7px] font-medium m-0">
              Just text it.
            </h2>
            <p className="text-[16px] leading-[1.55] text-muted-foreground m-0">
              Linux sandbox, persistent memory, 3,000+ app integrations. Treat it
              like a chief of staff with a laptop.
            </p>
          </div>

          <div className="w-full max-w-[520px] flex flex-col gap-[22px]">
            {THREAD.map((ex, i) => (
              <div className="flex flex-col gap-1.5" key={i}>
                <div className="self-end max-w-[82%] bg-[#007aff] text-white rounded-[20px] rounded-br-[6px] px-4 py-2.5 text-[15px] leading-[1.4] break-words">
                  {ex.prompt}
                </div>
                {"typing" in ex ? (
                  <div className="self-start max-w-[82%] bg-foreground text-background rounded-[20px] rounded-bl-[6px] inline-flex items-center gap-1.5 px-4 py-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-background/55 animate-pulse" />
                    <span className="w-1.5 h-1.5 rounded-full bg-background/55 animate-pulse [animation-delay:150ms]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-background/55 animate-pulse [animation-delay:300ms]" />
                    <span className="ml-2 text-[13px] text-background/55 italic">{ex.typing}</span>
                  </div>
                ) : (
                  <div className="self-start max-w-[82%] bg-foreground text-background rounded-[20px] rounded-bl-[6px] px-4 py-2.5 text-[15px] leading-[1.4] break-words">
                    {ex.reply}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* ── Pricing ── */}
      <FadeIn>
        <div className="mb-24">
          <div className="flex flex-col items-center text-center gap-2 mb-10">
            <h2 className="font-heading text-[clamp(30px,4vw,44px)] leading-[1.05] tracking-[-0.7px] font-medium m-0">
              Simple pricing. Try it, then decide.
            </h2>
            <p className="text-[16px] leading-[1.55] text-muted-foreground max-w-[520px] m-0">
              One day free, then $20/month. Cancel anytime from inside iMessage.
            </p>
          </div>

          <div className="max-w-[560px] mx-auto rounded-[22px] border border-border/70 bg-[hsl(40,33%,99%)] p-10 sm:p-12 text-center shadow-[0_1px_0_rgba(0,0,0,0.02)]">
            <p className="font-mono-brand text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-3">
              early access
            </p>
            <p className="m-0 font-heading text-foreground leading-none">
              <span className="text-[80px] font-medium tracking-[-1.6px]">$20</span>
              <span className="text-[22px] italic text-muted-foreground ml-2">/ month</span>
            </p>
            <p className="mt-4 text-[15px] text-muted-foreground italic">
              Tokens included during early access.
            </p>
            <ul className="mt-7 mb-8 inline-block text-left text-[15px] leading-[1.9] text-foreground list-none p-0 space-y-0">
              {PRICE_INCLUDES.map((line) => (
                <li className="relative pl-6" key={line}>
                  <span className="absolute left-0 top-0 text-muted-foreground text-[14px]">✓</span>
                  {line}
                </li>
              ))}
            </ul>
            <div>
              <a
                href={SMS_DEEP_LINK}
                className="inline-flex items-center justify-center bg-foreground text-background rounded-xl px-7 py-3.5 text-[15px] font-semibold no-underline hover:bg-foreground/90 transition-colors"
              >
                Start your free day →
              </a>
            </div>
            <p className="mt-5 font-mono-brand text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
              powered by openclaw · gbrain · opencomputer
            </p>
          </div>
        </div>
      </FadeIn>

      <SEO
        title="Clawputer"
        description="Welcome to clawputer. A personal AI assistant with a real computer and memory that sticks. On iMessage or Telegram. Send a text to get started."
        path="/clawputer"
        type="website"
      />
    </SitePageLayout>
  );
};

export default Clawputer;
