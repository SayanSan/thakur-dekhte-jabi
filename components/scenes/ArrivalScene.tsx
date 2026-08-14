"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Image from "next/image";
import PartnerLogos from "@/components/PartnerLogos";

type ArrivalSceneProps = {
  onEnter: () => void;
  soundOn: boolean;
  onToggleSound: () => void;
  disabled?: boolean;
};

const PARTICLES = Array.from({ length: 24 }, (_, i) => ({
  id: i,
  left: `${(i * 17) % 95 + 2.5}%`,
  top: `${(i * 23) % 90 + 5}%`,
  size: (i % 3) * 3 + 3,
  duration: 4 + (i % 5) * 1.5,
  delay: (i % 7) * 0.4,
  depth: 40 + (i % 4) * 25,
}));

export default function ArrivalScene({
  onEnter,
  soundOn,
  onToggleSound,
  disabled,
}: ArrivalSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const buttonWrapRef = useRef<HTMLDivElement>(null);
  const buttonInnerRef = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // GSAP quickTo setters for 60fps smooth 3D interpolation
  const rotXTo = useRef<((v: number) => void) | null>(null);
  const rotYTo = useRef<((v: number) => void) | null>(null);
  const bgXTo = useRef<((v: number) => void) | null>(null);
  const bgYTo = useRef<((v: number) => void) | null>(null);

  useEffect(() => {
    if (!cardRef.current || !containerRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    rotXTo.current = gsap.quickTo(cardRef.current, "rotationX", {
      duration: 0.6,
      ease: "power2.out",
    });
    rotYTo.current = gsap.quickTo(cardRef.current, "rotationY", {
      duration: 0.6,
      ease: "power2.out",
    });
    bgXTo.current = gsap.quickTo(containerRef.current, "x", {
      duration: 0.8,
      ease: "power3.out",
    });
    bgYTo.current = gsap.quickTo(containerRef.current, "y", {
      duration: 0.8,
      ease: "power3.out",
    });

    const handlePointerMove = (e: PointerEvent) => {
      const { innerWidth, innerHeight } = window;
      const xNorm = e.clientX / innerWidth - 0.5; // -0.5 to 0.5
      const yNorm = e.clientY / innerHeight - 0.5; // -0.5 to 0.5

      // 3D rotation angles
      const rotX = -yNorm * 22; // max tilt 11 deg
      const rotY = xNorm * 26; // max tilt 13 deg

      rotXTo.current?.(rotX);
      rotYTo.current?.(rotY);
      bgXTo.current?.(xNorm * -25);
      bgYTo.current?.(yNorm * -15);

      // Glare lighting position
      if (glareRef.current) {
        const glareX = (xNorm + 0.5) * 100;
        const glareY = (yNorm + 0.5) * 100;
        glareRef.current.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 220, 160, 0.28) 0%, rgba(255, 180, 100, 0.08) 40%, transparent 75%)`;
      }
    };

    const handlePointerLeave = () => {
      setIsHovered(false);
      rotXTo.current?.(0);
      rotYTo.current?.(0);
      bgXTo.current?.(0);
      bgYTo.current?.(0);
      if (glareRef.current) {
        glareRef.current.style.background = `radial-gradient(circle at 50% 50%, rgba(255, 220, 160, 0.12) 0%, transparent 60%)`;
      }
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, []);

  // Magnetic button 3D push effect
  useEffect(() => {
    const wrap = buttonWrapRef.current;
    const inner = buttonInnerRef.current;
    if (!wrap || !inner) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const xTo = gsap.quickTo(inner, "x", { duration: 0.35, ease: "power3" });
    const yTo = gsap.quickTo(inner, "y", { duration: 0.35, ease: "power3" });
    const zTo = gsap.quickTo(inner, "z", { duration: 0.35, ease: "power3" });

    function handleMove(e: PointerEvent) {
      const rect = wrap!.getBoundingClientRect();
      const relX = e.clientX - (rect.left + rect.width / 2);
      const relY = e.clientY - (rect.top + rect.height / 2);
      xTo(relX * 0.35);
      yTo(relY * 0.35);
      zTo(25);
    }
    function handleLeave() {
      xTo(0);
      yTo(0);
      zTo(0);
    }

    wrap.addEventListener("pointermove", handleMove);
    wrap.addEventListener("pointerleave", handleLeave);
    return () => {
      wrap.removeEventListener("pointermove", handleMove);
      wrap.removeEventListener("pointerleave", handleLeave);
    };
  }, []);

  // Intro reveal timeline — kept snappy so users see content immediately
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const tl = gsap.timeline();
    tl.fromTo(
      cardRef.current,
      { scale: 0.97, opacity: 0.6, rotateX: 5, filter: "brightness(0.85)" },
      {
        scale: 1,
        opacity: 1,
        rotateX: 0,
        filter: "brightness(1)",
        duration: 0.8,
        ease: "power2.out",
      },
    ).fromTo(
      titleRef.current,
      { y: 16, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" },
      "-=0.5",
    );

    return () => {
      tl.kill();
    };
  }, []);

  // Handle click zoom enter effect
  const handleEnterClick = () => {
    if (cardRef.current) {
      gsap.to(cardRef.current, {
        scale: 1.35,
        rotateX: -10,
        z: 300,
        opacity: 0,
        duration: 1.1,
        ease: "power3.inOut",
      });
    }
    onEnter();
  };

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-[#060408] perspective-1000 select-none">
      {/* Dynamic Ambient Background Blur */}
      <div
        ref={containerRef}
        className="absolute inset-[-6%] scale-105 transition-transform duration-700 ease-out"
      >
        <Image
          src="/starting-screen.jpg"
          alt="Pandal Scene Ambient Background"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-55 filter contrast-110 saturate-150"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#060408]/80 via-[#060408]/30 to-[#060408]/40" />
      </div>

      {/* Decorative Night Stars/Sparks */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-60">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255, 215, 120, 0.6) 1.5px, transparent 1.5px)",
            backgroundSize: "44px 44px",
          }}
        />
      </div>

      {/* Main 3D Card Stage Wrapper (Screen Fit) */}
      <div className="relative z-10 flex h-full w-full items-center justify-center p-0 sm:p-4 md:p-6">
        <div
          ref={cardRef}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="preserve-3d group relative flex h-full w-full flex-col items-center justify-between overflow-hidden rounded-none sm:rounded-3xl border-0 sm:border border-[#c9a35e]/40 bg-[#0d0914]/70 shadow-[0_30px_90px_rgba(0,0,0,0.8)] transition-shadow duration-500 hover:border-[#c9a35e]/70 hover:shadow-[0_45px_120px_rgba(201,163,94,0.35)]"
          style={{
            transformStyle: "preserve-3d",
          }}
        >
          {/* Main Artwork Image Layer (Z = 0) (Full Screen Fit) */}
          <div className="absolute inset-0 overflow-hidden rounded-none sm:rounded-3xl">
            <Image
              src="/starting-screen.jpg"
              alt="Durga Puja Pandal Scene"
              fill
              priority
              sizes="100vw"
              className={`object-cover object-center brightness-110 saturate-[1.15] transition-transform duration-700 ease-out ${
                isHovered ? "scale-105" : "scale-100"
              }`}
            />

            {/* Warm Painterly Lighting Vignette & Depth Gradients — kept light for vibrant feel */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#09060c]/70 via-transparent to-transparent opacity-80" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#09060c]/30 via-transparent to-[#09060c]/30" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,transparent_45%,rgba(6,4,8,0.45)_100%)]" />

            {/* Dynamic Interactive 3D Glare Sheen Overlay */}
            <div
              ref={glareRef}
              className="pointer-events-none absolute inset-0 mix-blend-soft-light transition-opacity duration-500"
              style={{
                background:
                  "radial-gradient(circle at 50% 50%, rgba(255, 220, 160, 0.25) 0%, transparent 55%)",
              }}
            />

            {/* Animated Golden Ambient Lights — boosted for festive glow */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-60 bg-gradient-to-b from-[#ffb443]/35 via-[#ff9548]/10 to-transparent" />

            {/* Central warm light bloom */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,rgba(255,200,100,0.12)_0%,transparent_60%)]" />
          </div>

          {/* 3D Floating Festive Embers / Marigold Sparks (Z = 60px) */}
          <div
            className="pointer-events-none absolute inset-0 z-20 overflow-hidden"
            style={{ transform: "translateZ(60px)" }}
          >
            {PARTICLES.map((p) => (
              <div
                key={p.id}
                className="flicker absolute rounded-full bg-[#ffe08a]"
                style={{
                  left: p.left,
                  top: p.top,
                  width: `${p.size + 2}px`,
                  height: `${p.size + 2}px`,
                  boxShadow: `0 0 ${p.size * 4}px ${p.size * 1.5}px rgba(255,210,100,0.9)`,
                  animation: `emberFloat ${p.duration}s ease-in-out infinite alternate`,
                  animationDelay: `${p.delay}s`,
                  transform: `translateZ(${p.depth}px)`,
                }}
              />
            ))}
          </div>

          <div
            ref={titleRef}
            className="relative z-30 flex flex-col items-center pt-8 text-center sm:pt-12 gap-4"
            style={{ transform: "translateZ(90px)", transformStyle: "preserve-3d" }}
          >
            <PartnerLogos />
            <div className="inline-flex items-center gap-2 rounded-full border border-[#c9a35e]/40 bg-[#0d0a12]/90 px-4 py-1.5 shadow-lg">
              <span className="h-2 w-2 rounded-full bg-[#ff9548] animate-pulse" />
              <span className="font-bengali text-xs uppercase tracking-[0.25em] text-[#f3ecdf]">
                দুর্গা পুজো অভিজ্ঞতা • DIGITAL PUJO
              </span>
            </div>

            <h1 className="mt-4 font-bengali text-[clamp(2.2rem,6.5vw,5.2rem)] font-bold leading-[1.1] tracking-normal text-[#f3ecdf] drop-shadow-[0_10px_25px_rgba(0,0,0,0.9)]">
              ঠাকুর দেখতে যাবি?
            </h1>

            <p className="mt-3 text-[0.75rem] font-bold uppercase tracking-[0.18em] text-[#ffd788]/90 sm:text-sm drop-shadow-md">
              Durga Puja Pandal Bangers from 80s, 90s and 2000s
            </p>
          </div>

          {/* Footer Call To Action & 3D Interactive Button (Z = 120px) */}
          <div
            className="relative z-30 flex flex-col items-center pb-24 sm:pb-28"
            style={{ transform: "translateZ(120px)", transformStyle: "preserve-3d" }}
          >
            <div ref={buttonWrapRef} className="preserve-3d">
              <button
                ref={buttonInnerRef}
                type="button"
                onClick={handleEnterClick}
                disabled={disabled}
                aria-label="Enter the pandal"
                className="group relative flex items-center gap-4 rounded-full border border-[#c9a35e]/60 bg-gradient-to-r from-[#201529]/95 via-[#3a251e]/95 to-[#201529]/95 px-9 py-4 text-sm font-semibold uppercase tracking-[0.25em] text-[#f3ecdf] shadow-[0_15px_35px_rgba(0,0,0,0.8)] transition-all duration-500 hover:border-[#ffd788] hover:bg-[#c9a35e]/20 hover:shadow-[0_20px_50px_rgba(255,195,90,0.35)] disabled:opacity-50"
                style={{ transformStyle: "preserve-3d" }}
              >
                <span className="relative z-10 drop-shadow-sm">Enter Pandal</span>
                <span className="relative z-10 flex h-7 w-7 items-center justify-center rounded-full border border-[#c9a35e]/50 bg-[#ff9548]/20 transition-transform duration-500 group-hover:translate-x-1.5 group-hover:bg-[#ff9548]/40">
                  →
                </span>

                {/* Button 3D Ambient Glow Ring */}
                <span className="absolute inset-0 rounded-full bg-gradient-to-r from-[#ff9548]/0 via-[#ffcf73]/30 to-[#ff9548]/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              </button>
            </div>

            <p className="mt-4 text-[0.65rem] uppercase tracking-[0.3em] text-[#cbb9a8]/70">
              Move cursor for 3D depth tilt
            </p>
          </div>
        </div>
      </div>

      {/* Sound Toggle Control in 3D bar */}
      <button
        type="button"
        onClick={onToggleSound}
        aria-label={soundOn ? "Turn sound off" : "Turn sound on"}
        className="absolute bottom-6 left-6 z-40 flex items-center gap-2 rounded-full border border-[#c9a35e]/30 bg-[#0d0914]/90 px-4 py-2 text-[0.68rem] uppercase tracking-[0.25em] text-[#cbb9a8] transition-all hover:border-[#c9a35e] hover:text-[#f3ecdf]"
      >
        {soundOn ? "◍ Sound On" : "◌ Sound Off"}
      </button>

      {/* Embedded CSS Animations */}
      <style jsx global>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        @keyframes emberFloat {
          0% {
            transform: translateY(0px) rotate(0deg) scale(1);
            opacity: 0.4;
          }
          50% {
            opacity: 0.9;
          }
          100% {
            transform: translateY(-24px) rotate(15deg) scale(1.2);
            opacity: 0.3;
          }
        }
      `}</style>

      <div className="grain" />
      <div className="vignette" />
    </div>
  );
}
