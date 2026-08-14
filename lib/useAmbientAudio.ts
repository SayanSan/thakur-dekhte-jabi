"use client";

import { useCallback, useEffect, useRef } from "react";

export type AudioLayer =
  | "traffic"
  | "dhaak"
  | "pandal"
  | "crowd"
  | "flash"
  | "conch";

const SOURCES: Record<AudioLayer, string> = {
  traffic: "/audio/traffic.mp3",
  dhaak: "/audio/dhaak.mp3",
  pandal: "/audio/pandal-ambience.mp3",
  crowd: "/audio/crowd-talk.mp3",
  flash: "/audio/transition-flash.mp3",
  conch: "/audio/conch.mp3",
};

const LOOPING: Record<AudioLayer, boolean> = {
  traffic: true,
  dhaak: true,
  pandal: true,
  crowd: true,
  flash: false,
  conch: false,
};

type FadeHandle = ReturnType<typeof setInterval>;

/**
 * Manages a set of looping/one-shot ambient audio layers with smooth
 * fades. Missing audio files (no assets shipped by default — see
 * public/audio/README.md) fail silently so the experience still works
 * with no sound rather than throwing.
 */
export function useAmbientAudio() {
  const elementsRef = useRef<Partial<Record<AudioLayer, HTMLAudioElement>>>(
    {},
  );
  const fadesRef = useRef<Partial<Record<AudioLayer, FadeHandle>>>({});
  const mutedRef = useRef(false);

  const getElement = useCallback((layer: AudioLayer): HTMLAudioElement => {
    let el = elementsRef.current[layer];
    if (!el) {
      el = new Audio(SOURCES[layer]);
      el.loop = LOOPING[layer];
      el.volume = 0;
      el.preload = "auto";
      el.onerror = () => {
        /* asset not present yet — stay silent */
      };
      elementsRef.current[layer] = el;
    }
    return el;
  }, []);

  const clearFade = (layer: AudioLayer) => {
    const handle = fadesRef.current[layer];
    if (handle) {
      clearInterval(handle);
      delete fadesRef.current[layer];
    }
  };

  const fadeTo = useCallback(
    (layer: AudioLayer, target: number, durationMs = 1200) => {
      const el = getElement(layer);
      clearFade(layer);

      if (mutedRef.current) target = 0;

      if (target > 0) {
        el.play().catch(() => {
          /* blocked until user gesture — ENTER PANDAL provides one */
        });
      }

      const steps = Math.max(1, Math.round(durationMs / 50));
      const start = el.volume;
      const delta = (target - start) / steps;
      let i = 0;

      const handle = setInterval(() => {
        i += 1;
        const next = start + delta * i;
        el.volume = Math.min(1, Math.max(0, next));
        if (i >= steps) {
          el.volume = Math.min(1, Math.max(0, target));
          clearInterval(handle);
          delete fadesRef.current[layer];
          if (el.volume === 0) el.pause();
        }
      }, 50);

      fadesRef.current[layer] = handle;
    },
    [getElement],
  );

  const playOneShot = useCallback(
    (layer: AudioLayer, volume = 0.6) => {
      if (mutedRef.current) return;
      const el = getElement(layer);
      el.currentTime = 0;
      el.volume = volume;
      el.play().catch(() => {});
    },
    [getElement],
  );

  const setMuted = useCallback((muted: boolean) => {
    mutedRef.current = muted;
    Object.values(elementsRef.current).forEach((el) => {
      if (!el) return;
      if (muted) {
        el.dataset.prevVolume = String(el.volume);
        el.volume = 0;
      } else {
        const prev = Number(el.dataset.prevVolume || "0");
        el.volume = prev;
        if (prev > 0) el.play().catch(() => {});
      }
    });
  }, []);

  useEffect(() => {
    const fades = fadesRef.current;
    const elements = elementsRef.current;
    return () => {
      Object.values(fades).forEach((h) => h && clearInterval(h));
      Object.values(elements).forEach((el) => {
        el?.pause();
      });
    };
  }, []);

  return { fadeTo, playOneShot, setMuted };
}
