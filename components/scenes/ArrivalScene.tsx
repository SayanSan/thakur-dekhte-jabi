"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Image from "next/image";
import { LeftLogos, RightLogos } from "@/components/PartnerLogos";
import MusicPlayer from "@/components/MusicPlayer";
import ContributorsWidget from "@/components/ContributorsWidget";

type ArrivalSceneProps = {
  onEnter: () => void;
  soundOn: boolean;
  onToggleSound: (on: boolean) => void;
  disabled?: boolean;
  player: any;
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
  player,
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
    <div className="relative h-dvh w-full overflow-hidden bg-[#060408] select-none">

      {/* ─── MOBILE LAYOUT (< md) ─────────────────────────────── */}
      <div className="md:hidden absolute inset-0 flex flex-col">
        {/* Outdoor pandal portrait background */}
        <div className="absolute inset-0">
          <Image
            src="/mobile-bg-pandal.jpg"
            alt="Durga Puja Pandal"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          {/* Gradient scrim: dark top for readability, strong bottom for player */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#060408]/50 via-transparent to-[#060408]/88" />
        </div>

        {/* Top bar: logos row + sound toggle */}
        <div className="relative z-10 flex items-center justify-between px-4 pt-10">
          {/* Left logos: Onyo Pujo + Offbeat */}
          <div className="flex items-center gap-2">
            <Image
              src="/onnya-pujo-logo.png"
              alt="Onyo Pujo"
              width={70}
              height={24}
              className="h-6 w-auto object-contain opacity-90"
            />
            <div className="h-5 w-px bg-[#c9a35e]/30" />
            <Image
              src="/offbeat-horizontal-logo.png"
              alt="Offbeat CCU"
              width={80}
              height={28}
              className="h-7 w-auto object-contain opacity-90"
            />
          </div>
          {/* Right logos + sound */}
          <div className="flex items-center gap-2">
            <Image
              src="/mcra-logo.png"
              alt="MCRA"
              width={60}
              height={24}
              className="h-6 w-auto object-contain opacity-90"
            />
            <Image
              src="/smiley-logo.jpg"
              alt="CCU App"
              width={26}
              height={26}
              className="h-6 w-6 rounded-full object-cover opacity-90"
            />
            <button
              type="button"
              onClick={() => onToggleSound(!soundOn)}
              aria-label={soundOn ? "Turn sound off" : "Turn sound on"}
              className="ml-1 flex items-center gap-1 rounded-full border border-[#c9a35e]/30 bg-[#0d0914]/80 px-2.5 py-1 text-[0.58rem] uppercase tracking-[0.18em] text-[#cbb9a8]"
            >
              {soundOn ? "◍" : "◌"}
            </button>
          </div>
        </div>

        {/* Center: Badge + Title + CTA — grows to fill space */}
        <div className="relative z-10 flex flex-1 flex-col items-center justify-end pb-3 px-4 text-center gap-3">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[#c9a35e]/40 bg-[#0d0a12]/80 px-3 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-[#ff9548] animate-pulse" />
            <span className="font-bengali text-[0.6rem] uppercase tracking-[0.2em] text-[#f3ecdf]">
              Digital Pujo
            </span>
          </div>

          <h1 className="font-bengali text-[clamp(2.6rem,12vw,4.2rem)] font-bold leading-[1.05] text-[#f3ecdf] drop-shadow-[0_6px_20px_rgba(0,0,0,0.95)]">
            ঠাকুর দেখতে যাবি?
          </h1>
          <p className="text-[0.68rem] font-bold uppercase tracking-[0.15em] text-[#ffd788]/90 drop-shadow-md">
            Pandal Bangers from 80s, 90s &amp; 2000s
          </p>

          {/* Enter CTA */}
          <button
            type="button"
            onClick={handleEnterClick}
            disabled={disabled}
            aria-label="Enter the pandal"
            className="mt-1 flex items-center gap-3 rounded-full border border-[#c9a35e]/60 bg-gradient-to-r from-[#201529]/95 via-[#3a251e]/95 to-[#201529]/95 px-7 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#f3ecdf] shadow-[0_10px_30px_rgba(0,0,0,0.8)] active:scale-95 transition-transform disabled:opacity-50"
          >
            <span>Enter Pandal</span>
            <span className="flex h-6 w-6 items-center justify-center rounded-full border border-[#c9a35e]/50 bg-[#ff9548]/20 text-xs">→</span>
          </button>
        </div>

        {/* Contributors — in flow, above player, right-aligned */}
        <div className="relative z-20 flex justify-end px-4 pb-2">
          <ContributorsWidget />
        </div>

        {/* Music player — docked at bottom */}
        <div className="relative z-20 w-full px-3 pb-6">
          <MusicPlayer player={player} mode="center" soundOn={soundOn} onToggleSound={onToggleSound} />
        </div>
      </div>


      {/* ─── DESKTOP LAYOUT (md+) ─────────────────────────────── */}
      <div className="hidden md:block absolute inset-0 perspective-1000">
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

        {/* Decorative Night Stars */}
        <div className="pointer-events-none absolute inset-0 z-0 opacity-60">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: "radial-gradient(rgba(255, 215, 120, 0.6) 1.5px, transparent 1.5px)",
              backgroundSize: "44px 44px",
            }}
          />
        </div>

        {/* Main 3D Card Stage */}
        <div className="relative z-10 flex h-full w-full items-center justify-center p-4 md:p-6">
          <div
            ref={cardRef}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="preserve-3d group relative flex h-full w-full flex-col items-center justify-between overflow-hidden rounded-3xl border border-[#c9a35e]/40 bg-[#0d0914]/70 shadow-[0_30px_90px_rgba(0,0,0,0.8)] transition-shadow duration-500 hover:border-[#c9a35e]/70 hover:shadow-[0_45px_120px_rgba(201,163,94,0.35)]"
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Main Artwork */}
            <div className="absolute inset-0 overflow-hidden rounded-3xl">
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
              {/* Glare sheen */}
              <div
                ref={glareRef}
                className="pointer-events-none absolute inset-0 mix-blend-soft-light transition-opacity duration-500"
                style={{
                  background: "radial-gradient(circle at 50% 50%, rgba(255, 220, 160, 0.25) 0%, transparent 55%)",
                }}
              />
            </div>

            {/* Floating Embers */}
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

            {/* Title block */}
            <div
              ref={titleRef}
              className="relative z-30 flex flex-col items-center pt-12 text-center gap-4"
              style={{ transform: "translateZ(90px)", transformStyle: "preserve-3d" }}
            >
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

            {/* CTA Button */}
            <div
              className="relative z-30 flex flex-col items-center pb-12"
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
                  <span className="absolute inset-0 rounded-full bg-gradient-to-r from-[#ff9548]/0 via-[#ffcf73]/30 to-[#ff9548]/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                </button>
              </div>

              <p className="mt-4 text-[0.65rem] uppercase tracking-[0.3em] text-[#cbb9a8]/70">
                Move cursor for 3D depth tilt
              </p>
            </div>
          </div>
        </div>

        {/* Top-left logos */}
        <div className="absolute top-6 left-6 z-40">
          <LeftLogos />
        </div>

        {/* Top-right logos */}
        <div className="absolute top-6 right-6 z-40">
          <RightLogos />
        </div>

        {/* Sound toggle */}
        <button
          type="button"
          onClick={() => onToggleSound(!soundOn)}
          aria-label={soundOn ? "Turn sound off" : "Turn sound on"}
          className="absolute bottom-6 left-6 z-40 flex items-center gap-2 rounded-full border border-[#c9a35e]/30 bg-[#0d0914]/90 px-4 py-2 text-[0.68rem] uppercase tracking-[0.25em] text-[#cbb9a8] transition-all hover:border-[#c9a35e] hover:text-[#f3ecdf]"
        >
          {soundOn ? "◍ Sound On" : "◌ Sound Off"}
        </button>

        {/* Contributors */}
        <div className="absolute bottom-6 right-6 z-40">
          <ContributorsWidget />
        </div>

        {/* Music Player outside 3D card */}
        <div className="absolute left-1/2 top-[58%] z-50 -translate-x-1/2 -translate-y-1/2 w-full max-w-[480px] px-4">
          <MusicPlayer player={player} mode="center" soundOn={soundOn} onToggleSound={onToggleSound} />
        </div>
      </div>

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

