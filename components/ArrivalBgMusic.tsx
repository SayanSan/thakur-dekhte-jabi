"use client";

import { useEffect, useRef, useCallback } from "react";

const VIDEO_ID = "foyvkqRxM5k";

interface YTPlayerInstance {
  playVideo: () => void;
  pauseVideo: () => void;
  setVolume: (v: number) => void;
  getPlayerState: () => number;
  destroy: () => void;
}

interface YTNamespace {
  Player: new (
    el: HTMLElement,
    opts: {
      height: string;
      width: string;
      videoId: string;
      playerVars: Record<string, number | string>;
      events: {
        onReady: () => void;
        onStateChange: (e: { data: number }) => void;
      };
    },
  ) => YTPlayerInstance;
  PlayerState: { PLAYING: number; PAUSED: number; ENDED: number };
}

declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let apiLoadPromise: Promise<YTNamespace> | null = null;

function loadYouTubeApi(): Promise<YTNamespace> {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (apiLoadPromise) return apiLoadPromise;

  apiLoadPromise = new Promise((resolve) => {
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previous?.();
      resolve(window.YT as YTNamespace);
    };
    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    script.async = true;
    document.head.appendChild(script);
  });
  return apiLoadPromise;
}

type ArrivalBgMusicProps = {
  soundOn: boolean;
};

/**
 * Hidden YouTube player that loops a single video as ambient background
 * music on the arrival page. Responds to the global sound toggle.
 */
export default function ArrivalBgMusic({ soundOn }: ArrivalBgMusicProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayerInstance | null>(null);
  const readyRef = useRef(false);
  const soundOnRef = useRef(soundOn);

  // Keep ref in sync so the onReady callback always sees latest value
  useEffect(() => {
    soundOnRef.current = soundOn;
  }, [soundOn]);

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
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          playsinline: 1,
          enablejsapi: 1,
          loop: 1,
          playlist: VIDEO_ID, // required for loop to work
        },
        events: {
          onReady: () => {
            readyRef.current = true;
            playerRef.current?.setVolume(40); // gentle background level
            if (soundOnRef.current) {
              playerRef.current?.playVideo();
            }
          },
          onStateChange: (e) => {
            // Loop manually as a fallback
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
  }, []);

  // React to soundOn changes
  useEffect(() => {
    if (!readyRef.current || !playerRef.current) return;
    if (soundOn) {
      playerRef.current.playVideo();
    } else {
      playerRef.current.pauseVideo();
    }
  }, [soundOn]);

  // Auto-start on first user gesture if sound is on
  const handleGesture = useCallback(() => {
    if (soundOnRef.current && playerRef.current && readyRef.current) {
      playerRef.current.playVideo();
    }
  }, []);

  useEffect(() => {
    window.addEventListener("pointerdown", handleGesture, { once: true });
    return () => window.removeEventListener("pointerdown", handleGesture);
  }, [handleGesture]);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed -left-[9999px] -top-[9999px] h-0 w-0 overflow-hidden opacity-0"
      aria-hidden="true"
    />
  );
}
