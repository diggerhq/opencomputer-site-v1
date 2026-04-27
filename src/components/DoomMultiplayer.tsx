import { useEffect, useState } from "react";

const LOBBY_URL =
  (import.meta.env.VITE_DOOM_LOBBY_URL as string | undefined) ??
  "https://sb-a2a1e740-p7000.workers.opencomputer.dev";

const STATE_POLL_MS = 2_000;
const HEARTBEAT_INTERVAL_MS = 5_000;

type Slot = {
  slot: number;
  occupied: boolean;
  expiresIn: number | null;
  wsUrl: string | null;
};
type LobbyState = { slots: Slot[]; queueLength: number };

type ClaimResponse =
  | { status: "assigned"; sessionId: string; slot: number; wsUrl: string; expiresIn: number }
  | { status: "queued"; sessionId: string; position: number };

type PlayerState =
  | { kind: "idle" }
  | { kind: "joining" }
  | { kind: "queued"; sessionId: string; position: number }
  | { kind: "playing"; sessionId: string; slot: number; wsUrl: string; expiresIn: number }
  | { kind: "ended"; reason: string };

const initialPlayerState: PlayerState = { kind: "idle" };

export default function DoomMultiplayer() {
  const [tab, setTab] = useState<"join" | "watch">("join");
  const [lobbyState, setLobbyState] = useState<LobbyState | null>(null);
  const [playerState, setPlayerState] = useState<PlayerState>(initialPlayerState);
  const [watchSlot, setWatchSlot] = useState(1);

  // Poll lobby state every 2s.
  useEffect(() => {
    let cancelled = false;
    const poll = async () => {
      try {
        const r = await fetch(`${LOBBY_URL}/api/state`);
        if (cancelled) return;
        if (r.ok) setLobbyState(await r.json());
      } catch {
        /* network blip — keep last good state */
      }
    };
    void poll();
    const id = setInterval(poll, STATE_POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  // Heartbeat while playing or queued.
  useEffect(() => {
    if (playerState.kind !== "playing" && playerState.kind !== "queued") return;
    const sessionId = playerState.sessionId;
    let cancelled = false;
    const beat = async () => {
      try {
        const r = await fetch(`${LOBBY_URL}/api/heartbeat`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });
        if (cancelled) return;
        const data = await r.json();
        if (data.status === "ok") {
          setPlayerState({
            kind: "playing",
            sessionId,
            slot: data.slot,
            wsUrl: data.wsUrl,
            expiresIn: data.expiresIn,
          });
        } else if (data.status === "queued") {
          setPlayerState({ kind: "queued", sessionId, position: data.position });
        } else if (data.status === "released") {
          setPlayerState({ kind: "ended", reason: "Your turn is over" });
        }
      } catch {
        /* keep going */
      }
    };
    void beat();
    const id = setInterval(beat, HEARTBEAT_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [playerState.kind, "sessionId" in playerState ? playerState.sessionId : null]);

  const join = async () => {
    setPlayerState({ kind: "joining" });
    try {
      const r = await fetch(`${LOBBY_URL}/api/claim`, { method: "POST" });
      const data = (await r.json()) as ClaimResponse;
      if (data.status === "assigned") {
        setPlayerState({
          kind: "playing",
          sessionId: data.sessionId,
          slot: data.slot,
          wsUrl: data.wsUrl,
          expiresIn: data.expiresIn,
        });
      } else {
        setPlayerState({ kind: "queued", sessionId: data.sessionId, position: data.position });
      }
    } catch (e) {
      setPlayerState({ kind: "ended", reason: "Could not reach the lobby" });
    }
  };

  const leave = async () => {
    if (playerState.kind === "playing" || playerState.kind === "queued") {
      const sessionId = playerState.sessionId;
      try {
        await fetch(`${LOBBY_URL}/api/release`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });
      } catch {
        /* ignore */
      }
    }
    setPlayerState({ kind: "idle" });
  };

  const occupiedCount = lobbyState?.slots.filter((s) => s.occupied).length ?? 0;
  const totalSlots = lobbyState?.slots.length ?? 4;
  const queueLength = lobbyState?.queueLength ?? 0;

  return (
    <div className="rounded-lg overflow-hidden border border-border/50 shadow-lg bg-black">
      <div className="bg-[hsl(0,0%,95%)] border-b border-[hsl(0,0%,88%)] px-4 py-2.5 flex justify-between items-center text-foreground">
        <div className="flex gap-2">
          <span className="w-3 h-3 rounded-full bg-[hsl(0,0%,75%)]" />
          <span className="w-3 h-3 rounded-full bg-[hsl(0,0%,75%)]" />
          <span className="w-3 h-3 rounded-full bg-[hsl(0,0%,75%)]" />
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono-brand text-xs text-[hsl(0,0%,55%)]">
            {occupiedCount}/{totalSlots} playing · {queueLength} queued
          </span>
          <span className="font-mono-brand text-[10px] uppercase tracking-[0.15em] text-[hsl(0,0%,55%)]">
            live
          </span>
        </div>
      </div>

      <div className="flex border-b border-white/10 bg-black/60">
        <TabButton active={tab === "join"} onClick={() => setTab("join")}>
          ▶ Join match
        </TabButton>
        <TabButton active={tab === "watch"} onClick={() => setTab("watch")}>
          👁 Watch live
        </TabButton>
      </div>

      <div className="aspect-[4/3] sm:aspect-[16/10] w-full bg-black relative">
        {tab === "join" ? (
          <JoinPane state={playerState} onJoin={join} onLeave={leave} occupied={occupiedCount} total={totalSlots} queue={queueLength} />
        ) : (
          <WatchPane lobby={lobbyState} watchSlot={watchSlot} setWatchSlot={setWatchSlot} />
        )}
      </div>
    </div>
  );
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
        active ? "text-white bg-white/10" : "text-white/60 hover:text-white/90"
      }`}
    >
      {children}
    </button>
  );
}

function JoinPane({
  state,
  onJoin,
  onLeave,
  occupied,
  total,
  queue,
}: {
  state: PlayerState;
  onJoin: () => void;
  onLeave: () => void;
  occupied: number;
  total: number;
  queue: number;
}) {
  if (state.kind === "playing") {
    return (
      <div className="w-full h-full relative">
        <iframe
          key={state.sessionId}
          src={state.wsUrl}
          title={`DOOM slot ${state.slot}`}
          className="w-full h-full block border-0"
          allow="fullscreen; gamepad; clipboard-read; clipboard-write"
        />
        <div className="absolute top-3 right-3 flex items-center gap-2 bg-black/70 backdrop-blur px-3 py-1.5 rounded text-white text-xs font-mono-brand">
          <span>Player {state.slot}</span>
          <span className="opacity-60">·</span>
          <span>{state.expiresIn}s left</span>
          <button onClick={onLeave} className="ml-2 px-2 py-0.5 rounded bg-white/15 hover:bg-white/25">
            Leave
          </button>
        </div>
      </div>
    );
  }
  if (state.kind === "queued") {
    return (
      <CenteredMessage>
        <span className="font-heading text-[clamp(28px,4vw,42px)] tracking-[-0.5px]">
          You're #{state.position} in line
        </span>
        <span className="font-mono-brand text-[12px] uppercase tracking-[0.2em] text-white/50">
          we'll grab you a slot the moment one frees up
        </span>
        <button
          onClick={onLeave}
          className="mt-4 px-4 py-2 text-sm rounded bg-white/10 hover:bg-white/20 text-white"
        >
          Cancel
        </button>
      </CenteredMessage>
    );
  }
  if (state.kind === "joining") {
    return (
      <CenteredMessage>
        <span className="font-mono-brand text-[12px] uppercase tracking-[0.2em] text-white/60">
          claiming a slot…
        </span>
      </CenteredMessage>
    );
  }
  if (state.kind === "ended") {
    return (
      <CenteredMessage>
        <span className="font-heading text-[clamp(24px,3vw,36px)] tracking-[-0.5px]">
          {state.reason}
        </span>
        <button
          onClick={onJoin}
          className="mt-4 px-6 py-3 rounded bg-white text-black font-medium hover:bg-white/90"
        >
          Rejoin
        </button>
      </CenteredMessage>
    );
  }
  // idle
  return (
    <CenteredMessage>
      <button
        onClick={onJoin}
        className="font-heading text-[clamp(28px,4vw,42px)] tracking-[-0.5px] text-white/90 hover:text-white"
      >
        ▶ Join the match
      </button>
      <span className="font-mono-brand text-[12px] uppercase tracking-[0.2em] text-white/50">
        {occupied}/{total} playing{queue > 0 ? ` · ${queue} in queue` : ""}
      </span>
    </CenteredMessage>
  );
}

function WatchPane({
  lobby,
  watchSlot,
  setWatchSlot,
}: {
  lobby: LobbyState | null;
  watchSlot: number;
  setWatchSlot: (n: number) => void;
}) {
  const slot = lobby?.slots.find((s) => s.slot === watchSlot);
  const url = slot?.wsUrl ? `${slot.wsUrl}&view_only=1` : null;
  return (
    <div className="w-full h-full relative">
      {url ? (
        <iframe
          key={`watch-${watchSlot}`}
          src={url}
          title={`Watching Player ${watchSlot}`}
          className="w-full h-full block border-0"
          // sandbox limits inputs while still allowing the noVNC client to render
        />
      ) : (
        <CenteredMessage>
          <span className="font-mono-brand text-[12px] uppercase tracking-[0.2em] text-white/60">
            no slot URL available
          </span>
        </CenteredMessage>
      )}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 flex gap-2 bg-black/70 backdrop-blur px-2 py-1.5 rounded">
        {[1, 2, 3, 4].map((n) => (
          <button
            key={n}
            onClick={() => setWatchSlot(n)}
            className={`px-3 py-1 text-xs font-mono-brand rounded ${
              n === watchSlot ? "bg-white text-black" : "text-white/80 hover:text-white hover:bg-white/10"
            }`}
          >
            P{n}
          </button>
        ))}
      </div>
    </div>
  );
}

function CenteredMessage({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-white/90">
      {children}
    </div>
  );
}
