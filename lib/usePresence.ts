"use client";

import { useEffect, useRef, useState } from "react";
import { getSupabaseClient, supabaseEnabled } from "./supabaseClient";

export type PresenceEvent = { type: "join" | "leave"; at: number };

const CHANNEL_NAME = "pandal-presence";
const SESSION_KEY = "thakur-dekhte-jabi-session";

function getSessionId(): string {
  if (typeof window === "undefined") return "server";
  try {
    const existing = window.sessionStorage.getItem(SESSION_KEY);
    if (existing) return existing;
    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `guest-${Math.random().toString(36).slice(2)}-${Date.now()}`;
    window.sessionStorage.setItem(SESSION_KEY, id);
    return id;
  } catch {
    return `guest-${Math.random().toString(36).slice(2)}`;
  }
}

/**
 * Live visitor presence. Uses Supabase Realtime Presence when configured
 * (NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY). Falls back to
 * a locally simulated, gently wandering count so the experience still works
 * with zero backend setup.
 */
export function usePresence(active: boolean) {
  const [count, setCount] = useState<number>(0);
  const [event, setEvent] = useState<PresenceEvent | null>(null);
  const joinedRef = useRef(false);

  useEffect(() => {
    if (!active) return;

    if (!supabaseEnabled) {
      let simulated = 180 + Math.floor(Math.random() * 90);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- seeds the client-only simulated count when no backend is configured
      setCount(simulated);
      const interval = setInterval(() => {
        const delta = Math.random() < 0.5 ? -1 : 1;
        const jump = Math.random() < 0.08 ? delta * 3 : delta;
        simulated = Math.max(40, simulated + jump);
        setEvent({ type: jump > 0 ? "join" : "leave", at: Date.now() });
        setCount(simulated);
      }, 3200);
      return () => clearInterval(interval);
    }

    const supabase = getSupabaseClient();
    if (!supabase) return;

    const sessionId = getSessionId();
    const channel = supabase.channel(CHANNEL_NAME, {
      config: { presence: { key: sessionId } },
    });

    channel
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState();
        setCount(Object.keys(state).length);
      })
      .on("presence", { event: "join" }, ({ key }) => {
        if (joinedRef.current && key !== sessionId) {
          setEvent({ type: "join", at: Date.now() });
        }
      })
      .on("presence", { event: "leave" }, ({ key }) => {
        if (key !== sessionId) {
          setEvent({ type: "leave", at: Date.now() });
        }
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({ joined_at: Date.now() });
          joinedRef.current = true;
        }
      });

    return () => {
      channel.unsubscribe();
      joinedRef.current = false;
    };
  }, [active]);

  return { count, event };
}
