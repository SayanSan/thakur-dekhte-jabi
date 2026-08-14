"use client";

import { useEffect, useState } from "react";

type Seat = {
  id: string;
  occupied: boolean;
  swayDelay: number;
  swayDuration: number;
};

type Row = {
  depth: number; // 0 = front/closest, 1 = back/farthest
  seats: Seat[];
};

function buildRows(): Row[] {
  const rowConfigs = [
    { depth: 0, count: 9 },
    { depth: 0.28, count: 11 },
    { depth: 0.56, count: 13 },
    { depth: 0.82, count: 14 },
  ];

  return rowConfigs.map((cfg, rowIndex) => ({
    depth: cfg.depth,
    seats: Array.from({ length: cfg.count }, (_, i) => ({
      id: `r${rowIndex}-s${i}`,
      occupied: Math.random() > 0.22,
      swayDelay: Math.random() * 5,
      swayDuration: 3.4 + Math.random() * 2.4,
    })),
  }));
}

function Person({
  scale,
  standing,
  swayDelay,
  swayDuration,
}: {
  scale: number;
  standing: boolean;
  swayDelay: number;
  swayDuration: number;
}) {
  return (
    <div
      className="relative origin-bottom transition-transform duration-[1400ms] ease-out"
      style={{
        width: 14 * scale,
        height: 30 * scale,
        transform: standing ? `translateY(${-6 * scale}px)` : "translateY(0)",
        animation: `person-sway ${swayDuration}s ease-in-out infinite`,
        animationDelay: `${swayDelay}s`,
      }}
    >
      <div
        className="absolute left-1/2 top-0 -translate-x-1/2 rounded-full"
        style={{
          width: 8 * scale,
          height: 8 * scale,
          background: "#241c28",
          boxShadow: `0 0 ${5 * scale}px rgba(255,149,72,0.12)`,
        }}
      />
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-t-full"
        style={{
          width: 14 * scale,
          height: 22 * scale,
          background: "#231b26",
          boxShadow: `0 0 ${6 * scale}px rgba(255,149,72,0.1)`,
        }}
      />
    </div>
  );
}

function ChairRow({ row, index }: { row: Row; index: number }) {
  const seats = row.seats;
  const [standingId, setStandingId] = useState<string | null>(null);
  const scale = 1 - row.depth * 0.55;
  const bottomPercent = 6 + row.depth * 24;

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) return;

    const occupiedSeats = seats.filter((s) => s.occupied);
    if (!occupiedSeats.length) return;

    let standTimeout: ReturnType<typeof setTimeout>;
    const interval = setInterval(
      () => {
        const pick =
          occupiedSeats[Math.floor(Math.random() * occupiedSeats.length)];
        setStandingId(pick.id);
        standTimeout = setTimeout(() => setStandingId(null), 2600);
      },
      6000 + index * 1500 + Math.random() * 3000,
    );
    return () => {
      clearInterval(interval);
      clearTimeout(standTimeout);
    };
  }, [seats, index]);

  return (
    <div
      className="absolute inset-x-0 flex items-end justify-center"
      style={{
        bottom: `${bottomPercent}%`,
        gap: `${1.4 * scale}vw`,
        opacity: 0.55 + scale * 0.4,
        filter: `brightness(${0.7 + scale * 0.4})`,
      }}
    >
      {seats.map((seat) => (
        <div key={seat.id} className="flex flex-col items-center">
          <div
            style={{
              width: 20 * scale,
              height: 16 * scale,
              borderTop: `${2 * scale}px solid #3a2f38`,
              borderLeft: `${2 * scale}px solid #3a2f38`,
              borderRight: `${2 * scale}px solid #3a2f38`,
              borderTopLeftRadius: 3,
              borderTopRightRadius: 3,
            }}
          />
          {seat.occupied && (
            <Person
              scale={scale}
              standing={standingId === seat.id}
              swayDelay={seat.swayDelay}
              swayDuration={seat.swayDuration}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default function PandalPeople() {
  const [rows, setRows] = useState<Row[] | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- seeded client-side only to avoid a Math.random() SSR/hydration mismatch
    setRows(buildRows());
  }, []);

  if (!rows) return null;

  return (
    <div className="absolute inset-x-0 bottom-[17%] h-[38%] sm:bottom-[19%]" aria-hidden>
      <style>{`
        @keyframes person-sway {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(0.6deg); }
        }
      `}</style>
      {rows
        .slice()
        .sort((a, b) => b.depth - a.depth)
        .map((row, i) => (
          <ChairRow key={i} row={row} index={i} />
        ))}
    </div>
  );
}
