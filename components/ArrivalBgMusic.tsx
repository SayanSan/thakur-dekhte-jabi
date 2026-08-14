"use client";

import { useEffect, useRef, useCallback } from "react";
import { loadYouTubeApi, type YTPlayerInstance } from "@/lib/useYouTubePlayer";

const VIDEO_ID = "foyvkqRxM5k";

type ArrivalBgMusicProps = {
  soundOn: boolean;
};

/**
 * Hidden YouTube player that loops a single video as ambient background
 * music on the arrival page. Responds to the global sound toggle.
 *
 * Browsers block unmuted autoplay until a user gesture. This component
 * keeps retrying on every pointerdown / keydown until playback starts.
 */
export default function ArrivalBgMusic({ soundOn }: ArrivalBgMusicProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayerInstance | null>(null);
  const readyRef = useRef(false);
  const playingRef = useRef(false);
  const soundOnRef = useRef(soundOn);

  useEffect(() => {
    soundOnRef.current = soundOn;
  }, [soundOn]);

  const tryPlay = useCallback(() => {
    if (!readyRef.current || !playerRef.current || !soundOnRef.current) return;
    try {
      playerRef.current.playVideo();
    } catch {
      // Blocked — will retry on next gesture
    }
  }, []);

  // Create the player once on mount
  useEffect(() => {
    let destroyed = false;

    loadYouTubeApi().then((YT) => {
      if (destroyed || !containerRef.current) return;

      playerRef.current = new YT.Player(containerRef.current, {
        height: "1",
        width: "1",
        videoId: VIDEO_ID,
        playerVars: {
          autoplay: 1,
          controls: 0,
          disablekb: 1,
          playsinline: 1,
          enablejsapi: 1,
          loop: 1,
          playlist: VIDEO_ID,
        },
        events: {
          onReady: () => {
            readyRef.current = true;
            playerRef.current?.setVolume(40);
            tryPlay();
          },
          onStateChange: (e) => {
            if (e.data === YT.PlayerState.PLAYING) {
              playingRef.current = true;
            }
            if (e.data === YT.PlayerState.PAUSED) {
              playingRef.current = false;
            }
            // Loop fallback
            if (e.data === YT.PlayerState.ENDED) {
              playerRef.current?.playVideo();
            }
          },
        },
      });
    });

    return () => {
      destroyed = true;
      playerRef.current?.destroy?.();
      playerRef.current = null;
    };
  }, [tryPlay]);

  // Keep retrying on user gestures until playback actually starts.
  // Browsers require a user interaction before allowing audio.
  useEffect(() => {
    const handleGesture = () => {
      if (playingRef.current) return; // already playing, no-op
      tryPlay();
    };

    // Listen on multiple events for maximum coverage
    window.addEventListener("pointerdown", handleGesture);
    window.addEventListener("keydown", handleGesture);
    window.addEventListener("click", handleGesture);

    return () => {
      window.removeEventListener("pointerdown", handleGesture);
      window.removeEventListener("keydown", handleGesture);
      window.removeEventListener("click", handleGesture);
    };
  }, [tryPlay]);

  // React to soundOn toggle
  useEffect(() => {
    if (!readyRef.current || !playerRef.current) return;
    if (soundOn) {
      playerRef.current.playVideo();
    } else {
      playerRef.current.pauseVideo();
    }
  }, [soundOn]);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed -left-[9999px] -top-[9999px] h-0 w-0 overflow-hidden opacity-0"
      aria-hidden="true"
    />
  );
}
