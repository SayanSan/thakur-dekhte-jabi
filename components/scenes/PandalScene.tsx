"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import Image from "next/image";

const SMOKE_PLUMES = [
  { left: "42%", bottom: "12%", delay: "0s", scale: 1 },
  { left: "48%", bottom: "14%", delay: "1.8s", scale: 0.85 },
  { left: "54%", bottom: "10%", delay: "3.2s", scale: 1.1 },
];

const DIYAS = [
  { left: "45%", top: "72%", size: 60, color: "rgba(255, 180, 70, 0.45)" },
  { left: "51%", top: "76%", size: 70, color: "rgba(255, 200, 90, 0.5)" },
  { left: "32%", top: "75%", size: 80, color: "rgba(255, 160, 60, 0.35)" },
  { left: "68%", top: "75%", size: 80, color: "rgba(255, 160, 60, 0.35)" },
];

export default function PandalScene() {
  const rootRef = useRef<HTMLDivElement>(null);
  const imageLayerRef = useRef<HTMLDivElement>(null);
  const lightLayerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Deceleration arrival animation
    gsap.fromTo(
      rootRef.current,
      { scale: 1.08, filter: "blur(10px) brightness(1.4)", opacity: 0 },
      {
        scale: 1,
        filter: "blur(0px) brightness(1)",
        opacity: 1,
        duration: 1.4,
        ease: "power2.out",
      },
    );

    // Interactive 3D Cursor Parallax
    const imgX = gsap.quickTo(imageLayerRef.current, "x", {
      duration: 0.8,
      ease: "power3.out",
    });
    const imgY = gsap.quickTo(imageLayerRef.current, "y", {
      duration: 0.8,
      ease: "power3.out",
    });
    const lightX = gsap.quickTo(lightLayerRef.current, "x", {
      duration: 0.6,
      ease: "power3.out",
    });
    const lightY = gsap.quickTo(lightLayerRef.current, "y", {
      duration: 0.6,
      ease: "power3.out",
    });

    const handleMove = (e: PointerEvent) => {
      const relX = (e.clientX / window.innerWidth - 0.5) * 2;
      const relY = (e.clientY / window.innerHeight - 0.5) * 2;

      imgX(relX * -15);
      imgY(relY * -10);
      lightX(relX * 25);
      lightY(relY * 18);
    };

    window.addEventListener("pointermove", handleMove);
    return () => window.removeEventListener("pointermove", handleMove);
  }, []);

  return (
    <div
      ref={rootRef}
      className="relative h-dvh w-full overflow-hidden bg-black select-none"
    >
      {/* 3D Depth Image Layer (Fits Full Screen) */}
      <div
        ref={imageLayerRef}
        className="absolute inset-[-3%] h-[106%] w-[106%]"
      >
        <Image
          src="/pandal-inner.jpg"
          alt="Durga Idol Sanctum View"
          fill
          priority
          className="object-cover object-center"
        />

        {/* Ambient Depth Vignettes */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/50" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/50" />
      </div>

      {/* Interactive Diya Warm Light Glow Highlights */}
      <div ref={lightLayerRef} className="pointer-events-none absolute inset-0">
        {DIYAS.map((d, i) => (
          <div
            key={i}
            className="flicker absolute rounded-full"
            style={{
              left: d.left,
              top: d.top,
              width: d.size,
              height: d.size,
              background: `radial-gradient(circle, ${d.color} 0%, transparent 70%)`,
              filter: "blur(8px)",
              animationDelay: `${i * 0.7}s`,
            }}
          />
        ))}

        {/* Priest Aarti Warm Light Surge */}
        <div
          className="flicker-slow absolute rounded-full"
          style={{
            left: "44%",
            top: "68%",
            width: 140,
            height: 140,
            background:
              "radial-gradient(circle, rgba(255,180,80,0.4) 0%, transparent 75%)",
            filter: "blur(12px)",
          }}
        />
      </div>

      {/* Incense Dhunuchi Smoke Particles */}
      <div className="pointer-events-none absolute inset-0">
        {SMOKE_PLUMES.map((plume, i) => (
          <div
            key={i}
            className="absolute"
            style={{ left: plume.left, bottom: plume.bottom }}
          >
            {Array.from({ length: 4 }, (_, j) => (
              <div
                key={j}
                className="smoke-particle absolute rounded-full"
                style={{
                  width: 70 * plume.scale,
                  height: 70 * plume.scale,
                  background:
                    "radial-gradient(circle, rgba(255,230,200,0.25) 0%, transparent 75%)",
                  filter: "blur(8px)",
                  animationDelay: `calc(${plume.delay} + ${j * 2}s)`,
                }}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Golden Warm Color-grade Overlay */}
      <div
        className="pointer-events-none absolute inset-0 mix-blend-soft-light"
        style={{
          background:
            "radial-gradient(circle at 50% 40%, rgba(255, 180, 80, 0.18) 0%, rgba(180, 50, 40, 0.08) 60%, rgba(0,0,0,0.2) 100%)",
        }}
      />

      <div className="grain" />
      <div className="vignette" />
    </div>
  );
}

