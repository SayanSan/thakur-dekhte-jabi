"use client";

import { useEffect, useRef } from "react";
import { useAmbientAudio } from "@/lib/useAmbientAudio";

export type Scene = "arrival" | "transition" | "pandal";

type AmbientLayerProps = {
  scene: Scene;
  muted: boolean;
};

/**
 * Non-visual orchestrator: crossfades ambient audio layers as the
 * experience moves parking -> transition -> pandal, and mirrors the
 * mute toggle. Renders nothing.
 */
export default function AmbientLayer({ scene, muted }: AmbientLayerProps) {
  const { fadeTo, playOneShot, setMuted } = useAmbientAudio();
  const lastScene = useRef<Scene | null>(null);

  useEffect(() => {
    setMuted(muted);
  }, [muted, setMuted]);

  useEffect(() => {
    if (lastScene.current === scene) return;
    lastScene.current = scene;

    if (scene === "arrival") {
      fadeTo("traffic", 0, 1200);
      fadeTo("crowd", 0, 1500);
      fadeTo("dhaak", 0, 800);
      fadeTo("pandal", 0, 800);
    } else if (scene === "transition") {
      fadeTo("traffic", 0, 900);
      fadeTo("dhaak", 0.75, 900);
      playOneShot("flash", 0.7);
    } else if (scene === "pandal") {
      fadeTo("dhaak", 0.22, 2000);
      fadeTo("pandal", 0.5, 1800);
      fadeTo("crowd", 0.25, 2000);
      playOneShot("conch", 0.4);
    }
  }, [scene, fadeTo, playOneShot]);

  return null;
}
