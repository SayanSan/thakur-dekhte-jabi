"use client";

import { useEffect, useRef, useState } from "react";
import type { PresenceEvent } from "@/lib/usePresence";

type MilestoneNotificationProps = {
  count: number;
  event: PresenceEvent | null;
};

const JOIN_LINES = ["Someone just joined you.", "Another chair just filled up."];
const LEAVE_LINES = ["Someone went for phuchka.", "Someone stepped out for a bit."];

export default function MilestoneNotification({
  count,
  event,
}: MilestoneNotificationProps) {
  const [message, setMessage] = useState<string | null>(null);
  const queueRef = useRef<string[]>([]);
  const shownMilestonesRef = useRef<Set<number>>(new Set());
  const lastEventAtRef = useRef<number>(0);
  const activeRef = useRef(false);

  const enqueue = (text: string) => {
    queueRef.current.push(text);
  };

  useEffect(() => {
    if (count >= 500 && !shownMilestonesRef.current.has(500)) {
      shownMilestonesRef.current.add(500);
      enqueue("500 people are in the pandal.");
    }
    if (count >= 1000 && !shownMilestonesRef.current.has(1000)) {
      shownMilestonesRef.current.add(1000);
      enqueue("Kolkata just showed up.");
    }
  }, [count]);

  useEffect(() => {
    if (!event || event.at === lastEventAtRef.current) return;
    lastEventAtRef.current = event.at;
    if (Math.random() > 0.35) return;

    const lines = event.type === "join" ? JOIN_LINES : LEAVE_LINES;
    enqueue(lines[Math.floor(Math.random() * lines.length)]);
  }, [event]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (activeRef.current) return;
      const next = queueRef.current.shift();
      if (!next) return;
      activeRef.current = true;
      setMessage(next);
      setTimeout(() => {
        activeRef.current = false;
        setMessage(null);
      }, 4400);
    }, 900);
    return () => clearInterval(interval);
  }, []);

  if (!message) return null;

  return (
    <div
      key={message}
      role="status"
      aria-live="polite"
      className="toast pointer-events-none fixed left-1/2 top-8 z-40 -translate-x-1/2 whitespace-nowrap rounded-full border border-[#c9a35e]/20 bg-[#0c0a10]/80 px-5 py-2 text-[0.72rem] uppercase tracking-[0.2em] text-[#f3ecdf] backdrop-blur-md"
    >
      {message}
    </div>
  );
}
