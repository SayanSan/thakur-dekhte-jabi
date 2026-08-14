"use client";

type VisitorCounterProps = {
  count: number;
};

export default function VisitorCounter({ count }: VisitorCounterProps) {
  const digits = String(count).split("");

  return (
    <div
      className="pointer-events-none select-none text-right"
      aria-live="polite"
    >
      <div className="flex justify-end text-[clamp(1.6rem,3.2vw,2.4rem)] font-medium leading-none tracking-tight text-[#f3ecdf]">
        {digits.map((d, i) => (
          <span key={`${i}-${d}-${count}`} className="count-digit tabular-nums">
            {d}
          </span>
        ))}
      </div>
      <p className="mt-1 text-[0.6rem] uppercase tracking-[0.28em] text-[#cbb9a8]/70">
        People in the pandal
      </p>
    </div>
  );
}
