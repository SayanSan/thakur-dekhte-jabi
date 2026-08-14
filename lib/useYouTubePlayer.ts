"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Track } from "./pujoPlaylist";

export interface YTPlayerInstance {
  playVideo: () => void;
  pauseVideo: () => void;
  loadVideoById: (id: string) => void;
  cueVideoById: (id: string) => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  setVolume: (v: number) => void;
  getPlayerState: () => number;
  destroy: () => void;
}

interface YTStateChangeEvent {
  data: number;
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
        onStateChange: (e: YTStateChangeEvent) => void;
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

export function loadYouTubeApi(): Promise<YTNamespace> {
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

/**
 * Drives real, full-length audio playback through a hidden YouTube
 * player with automatic song autoplay and seamless continuous queueing.
 */
export function useYouTubePlayer(tracks: Track[]) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayerInstance | null>(null);
  const indexRef = useRef(0);
  const goNextRef = useRef<() => void>(() => {});

  const [ready, setReady] = useState(false);
  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  const goToIndex = useCallback(
    (nextIndex: number, autoplay = true) => {
      const track = tracks[nextIndex];
      if (!track || !playerRef.current) return;
      setIndex(nextIndex);
      setCurrentTime(0);
      if (autoplay) {
        playerRef.current.loadVideoById(track.videoId);
        playerRef.current.playVideo();
      } else {
        playerRef.current.cueVideoById(track.videoId);
      }
    },
    [tracks],
  );

  const goNext = useCallback(() => {
    goToIndex((indexRef.current + 1) % tracks.length, true);
  }, [tracks.length, goToIndex]);

  const goPrev = useCallback(() => {
    goToIndex((indexRef.current - 1 + tracks.length) % tracks.length, true);
  }, [tracks.length, goToIndex]);

  // Keep ref always up-to-date so the player's onStateChange closure never goes stale
  useEffect(() => {
    goNextRef.current = goNext;
  }, [goNext]);

  useEffect(() => {
    let destroyed = false;

    loadYouTubeApi().then((YT) => {
      if (destroyed || !containerRef.current) return;
      playerRef.current = new YT.Player(containerRef.current, {
        height: "1",
        width: "1",
        videoId: tracks[0]?.videoId ?? "",
        playerVars: {
          autoplay: 1,
          controls: 0,
          disablekb: 1,
          playsinline: 1,
          enablejsapi: 1,
        },
        events: {
          onReady: () => {
            setReady(true);
            try {
              playerRef.current?.playVideo();
            } catch {
              // Ignore autoplay restriction, will unlock on first user gesture
            }
          },
          onStateChange: (e) => {
            if (e.data === YT.PlayerState.PLAYING) setIsPlaying(true);
            if (e.data === YT.PlayerState.PAUSED) setIsPlaying(false);
            if (e.data === YT.PlayerState.ENDED) {
              // Use ref so we always call the latest goNext (avoids stale closure)
              goNextRef.current();
            }
          },
        },
      });
    });

    // Auto-resume playback on any user click if paused due to browser policy
    const handleGlobalInteraction = () => {
      if (playerRef.current && !isPlaying) {
        try {
          playerRef.current.playVideo();
        } catch {
          // Ignore
        }
      }
    };

    window.addEventListener("pointerdown", handleGlobalInteraction, { once: true });

    return () => {
      destroyed = true;
      window.removeEventListener("pointerdown", handleGlobalInteraction);
      playerRef.current?.destroy?.();
      playerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isPlaying) return;
    const id = setInterval(() => {
      const p = playerRef.current;
      if (!p) return;
      setCurrentTime(p.getCurrentTime());
      setDuration(p.getDuration());
    }, 500);
    return () => clearInterval(id);
  }, [isPlaying]);

  const play = useCallback(() => playerRef.current?.playVideo(), []);
  const pause = useCallback(() => playerRef.current?.pauseVideo(), []);
  const toggle = useCallback(() => {
    if (isPlaying) pause();
    else play();
  }, [isPlaying, play, pause]);

  const seekToFraction = useCallback((fraction: number) => {
    const p = playerRef.current;
    if (!p) return;
    p.seekTo(fraction * p.getDuration(), true);
  }, []);

  return {
    containerRef,
    ready,
    isPlaying,
    currentTime,
    duration,
    currentIndex: index,
    currentTrack: tracks[index],
    hasMultipleTracks: tracks.length > 1,
    toggle,
    goNext,
    goPrev,
    goToIndex,
    seekToFraction,
  };
}

