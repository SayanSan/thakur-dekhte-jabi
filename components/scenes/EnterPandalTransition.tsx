"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

type EnterPandalTransitionProps = {
  onMidpoint: () => void;
  onComplete: () => void;
  onFlashPeak?: () => void;
};

const TELEPORT_STREAKS = Array.from({ length: 32 }, (_, i) => ({
  id: i,
  angle: (360 / 32) * i,
  distance: 30 + (i % 5) * 15,
  delay: (i % 8) * 0.02,
  length: 120 + (i % 4) * 80,
}));

export default function EnterPandalTransition({
  onMidpoint,
  onComplete,
  onFlashPeak,
}: EnterPandalTransitionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const tunnelRef = useRef<HTMLDivElement>(null);
  const portalFlashRef = useRef<HTMLDivElement>(null);
  const energyRingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      onFlashPeak?.();
      onMidpoint();
      onComplete();
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => onComplete(),
    });

    // Initial state
    gsap.set(tunnelRef.current, { scale: 0.2, opacity: 0, rotation: 0 });
    gsap.set(portalFlashRef.current, { opacity: 0, scale: 0.8 });
    gsap.set(energyRingRef.current, { scale: 0.1, opacity: 0 });

    // Teleportation Sequence
    tl.to(tunnelRef.current, {
      opacity: 1,
      scale: 3.5,
      rotation: 45,
      duration: 0.7,
      ease: "power3.in",
    })
      .to(
        energyRingRef.current,
        {
          opacity: 0.9,
          scale: 4,
          duration: 0.6,
          ease: "power2.in",
        },
        "<",
      )
      .to(
        portalFlashRef.current,
        {
          opacity: 1,
          scale: 1.4,
          duration: 0.35,
          ease: "power4.in",
        },
        "-=0.25",
      )
      .call(() => {
        onFlashPeak?.();
        onMidpoint();
      })
      .to(portalFlashRef.current, {
        opacity: 0,
        duration: 0.65,
        ease: "power2.out",
      })
      .to(
        tunnelRef.current,
        {
          opacity: 0,
          scale: 5,
          duration: 0.5,
          ease: "power2.out",
        },
        "<",
      );

    return () => {
      tl.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed inset-0 z-[100] overflow-hidden bg-black/40 backdrop-blur-sm select-none"
      aria-hidden
    >
      {/* 3D Teleportation Warp Speed Tunnel */}
      <div
        ref={tunnelRef}
        className="absolute left-1/2 top-1/2 h-0 w-0 -translate-x-1/2 -translate-y-1/2"
      >
        {TELEPORT_STREAKS.map((s) => (
          <div
            key={s.id}
            className="absolute left-1/2 top-1/2 origin-left"
            style={{
              width: `${s.length}vmax`,
              height: "3px",
              transform: `rotate(${s.angle}deg) translateX(${s.distance}px)`,
              background:
                "linear-gradient(to right, rgba(255,215,120,0) 0%, rgba(255,180,90,0.95) 40%, rgba(255,255,255,1) 85%, transparent 100%)",
              boxShadow: "0 0 15px 3px rgba(255, 170, 70, 0.8)",
              filter: "blur(0.5px)",
            }}
          />
        ))}
      </div>

      {/* Expanding 3D Shockwave Energy Ring */}
      <div
        ref={energyRingRef}
        className="absolute left-1/2 top-1/2 h-[350px] w-[350px] -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-[#ffcf73] opacity-0 shadow-[0_0_80px_30px_rgba(255,160,50,0.8)]"
      />

      {/* Radiant Golden Teleport Flash Peak */}
      <div
        ref={portalFlashRef}
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, #ffffff 0%, #ffe8b5 30%, #ff9e42 65%, #180a06 100%)",
        }}
      />
    </div>
  );
}

