"use client";

import "@/lib/gsapConfig";
import { useEffect, useRef, useState } from "react";
import ArrivalScene from "@/components/scenes/ArrivalScene";
import EnterPandalTransition from "@/components/scenes/EnterPandalTransition";
import PandalScene from "@/components/scenes/PandalScene";
import VisitorCounter from "@/components/VisitorCounter";
import MusicPlayer from "@/components/MusicPlayer";
import SoundController from "@/components/SoundController";
import MilestoneNotification from "@/components/MilestoneNotification";
import { usePresence } from "@/lib/usePresence";
import { LeftLogos, RightLogos } from "@/components/PartnerLogos";
import { useYouTubePlayer } from "@/lib/useYouTubePlayer";
import { PUJO_PLAYLIST } from "@/lib/pujoPlaylist";
import ContributorsWidget from "@/components/ContributorsWidget";

const PLAYLIST_URL =
  "https://open.spotify.com/playlist/7jrUOCZwvxp2zWxlHZVF7L";

type Phase = "arrival" | "transitioning" | "pandal";
type BaseVisual = "arrival" | "pandal";

const IDLE_EXIT_MS = 100_000;

export default function Home() {
  const player = useYouTubePlayer(PUJO_PLAYLIST);

  const [phase, setPhase] = useState<Phase>("arrival");
  const [baseVisual, setBaseVisual] = useState<BaseVisual>("arrival");
  const [soundOn, setSoundOn] = useState(true);
  const [showExitPrompt, setShowExitPrompt] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileHint, setShowMobileHint] = useState(false);

  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { count, event } = usePresence(phase === "pandal");

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    // eslint-disable-next-line react-hooks/set-state-in-effect -- matchMedia result is unknown during SSR render
    setIsMobile(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (phase !== "pandal" || !isMobile) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- timed hint synced to a setTimeout, not derived state
    setShowMobileHint(true);
    const t = setTimeout(() => setShowMobileHint(false), 4500);
    return () => clearTimeout(t);
  }, [phase, isMobile]);

  useEffect(() => {
    if (phase !== "pandal") {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- resets UI when leaving the pandal, not derived state
      setShowExitPrompt(false);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      return;
    }

    const resetTimer = () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      idleTimerRef.current = setTimeout(
        () => setShowExitPrompt(true),
        IDLE_EXIT_MS,
      );
    };

    const events = ["pointermove", "keydown", "touchstart", "wheel"];
    events.forEach((ev) => window.addEventListener(ev, resetTimer));
    resetTimer();

    return () => {
      events.forEach((ev) => window.removeEventListener(ev, resetTimer));
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [phase]);

  const handleEnter = () => {
    setSoundOn(true);
    setPhase("transitioning");
  };

  const handleEnterAgain = () => {
    setShowExitPrompt(false);
    setBaseVisual("arrival");
    setPhase("arrival");
  };

  return (
    <div className="relative h-dvh w-full bg-black">
      {/* Real YouTube playback engine (always mounted globally) */}
      <div ref={player.containerRef} className="absolute h-px w-px overflow-hidden opacity-0" />

      {baseVisual === "arrival" ? (
        <ArrivalScene
          onEnter={handleEnter}
          soundOn={soundOn}
          onToggleSound={setSoundOn}
          disabled={phase === "transitioning"}
          player={player}
        />
      ) : (
        <PandalScene />
      )}

      {phase === "transitioning" && (
        <EnterPandalTransition
          onMidpoint={() => setBaseVisual("pandal")}
          onComplete={() => setPhase("pandal")}
        />
      )}

      {phase === "pandal" && (
        <>
          {/* Top bar: logos, title, sound, back */}
          <div className="pointer-events-none fixed inset-x-0 top-0 z-20 flex items-start justify-between p-5 sm:p-7">
            {/* Top-left: Onyo Puja + Offbeat logos, site title, controls */}
            <div className="flex flex-col items-start gap-3">
              <div className="pointer-events-auto hidden md:block">
                <LeftLogos />
              </div>
              <p className="text-[0.78rem] uppercase tracking-[0.22em] text-[#f3ecdf]/85">
                Thakur Dekhte Jabi?
              </p>
              <SoundController
                className="pointer-events-auto"
                soundOn={soundOn}
                onToggle={() => setSoundOn((v) => !v)}
              />
              <button
                type="button"
                onClick={() => setShowExitPrompt(true)}
                className="pointer-events-auto flex items-center gap-2 rounded-full border border-[#c9a35e]/25 bg-[#0c0a10]/60 px-3 py-1.5 text-[0.68rem] uppercase tracking-[0.18em] text-[#cbb9a8]/70 backdrop-blur-sm transition-all hover:border-[#c9a35e]/50 hover:bg-[#c9a35e]/10 hover:text-[#f3ecdf]"
                aria-label="Go back"
              >
                <span className="text-[0.75rem]">←</span>
                <span>Back</span>
              </button>
            </div>

            {/* Top-right: MCRA + Smiley logos + visitor counter */}
            <div className="flex flex-col items-end gap-3">
              <div className="pointer-events-auto hidden md:block">
                <RightLogos />
              </div>
              <VisitorCounter count={count} />
            </div>
          </div>

          {/* Bottom-right: Contributors */}
          <div className="pointer-events-auto fixed bottom-20 right-5 z-30 hidden sm:block sm:right-7">
            <ContributorsWidget />
          </div>

          {/* MusicPlayer at the bottom in Pandal mode */}
          <MusicPlayer soundOn={soundOn} onToggleSound={setSoundOn} player={player} mode="bottom" />

          <MilestoneNotification count={count} event={event} />

          {isMobile && showMobileHint && (
            <div className="toast pointer-events-none fixed bottom-24 left-1/2 z-40 -translate-x-1/2 whitespace-nowrap rounded-full border border-[#c9a35e]/20 bg-[#0c0a10]/85 px-4 py-2 text-[0.68rem] uppercase tracking-[0.2em] text-[#f3ecdf]">
              Turn your sound on.
            </div>
          )}

          {showExitPrompt && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
              <div className="drift-in mx-6 max-w-sm rounded-2xl border border-[#c9a35e]/25 bg-[#0c0a10]/95 px-8 py-9 text-center">
                <p className="font-bengali text-2xl text-[#f3ecdf]">
                  পুজো শেষ?
                </p>
                <p className="mt-3 text-sm text-[#cbb9a8]">
                  Playlist-ta rekhe de.
                </p>
                <a
                  href={PLAYLIST_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-7 inline-flex items-center gap-2 rounded-full border border-[#c9a35e]/50 px-6 py-2.5 text-xs uppercase tracking-[0.2em] text-[#f3ecdf] transition-colors hover:bg-[#c9a35e]/10"
                >
                  Open Pujo Playlist →
                </a>
                <button
                  type="button"
                  onClick={() => setShowExitPrompt(false)}
                  className="mt-5 block w-full text-[0.68rem] uppercase tracking-[0.2em] text-[#cbb9a8]/60 transition-colors hover:text-[#f3ecdf]"
                >
                  Stay a while
                </button>
                <button
                  type="button"
                  onClick={handleEnterAgain}
                  className="mt-2 block w-full text-[0.68rem] uppercase tracking-[0.2em] text-[#cbb9a8]/60 transition-colors hover:text-[#f3ecdf]"
                >
                  Enter Again
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
