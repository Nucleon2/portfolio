"use client";

import { useEffect, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import { CameraRig } from "./CameraRig";
import { Effects } from "./Effects";
import { Ground } from "./scene/Ground";
import { Forest } from "./scene/Forest";
import { Mushrooms } from "./scene/Mushrooms";
import { Grass } from "./scene/Grass";
import { Fireflies } from "./scene/Fireflies";
import { Spores } from "./scene/Spores";
import { LightShafts } from "./scene/LightShafts";
import { HorizonGlow } from "./scene/HorizonGlow";
import { useAppStore } from "@/lib/store";
import {
  ABYSS,
  ABYSS_COLOR,
  FOG_KEYFRAMES,
  POINTER,
  SCENE_ACCENT,
  sampleAccent,
  sampleKeyframes,
} from "@/lib/sceneConfig";
import { useReducedMotion } from "@/lib/useReducedMotion";

const _fogTarget = new THREE.Color();

/** Animates fog density + per-room tint, tracks pointer energy, and flags the
 *  scene ready for the preloader. */
function SceneState() {
  const scene = useThree((s) => s.scene);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const id = requestAnimationFrame(() => useAppStore.getState().setSceneReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // Track the cursor in NDC and spike its energy on movement (skipped under
  // reduced motion — no scene disturbance).
  useEffect(() => {
    if (reducedMotion) return;
    const onMove = (e: PointerEvent) => {
      POINTER.x = (e.clientX / window.innerWidth) * 2 - 1;
      POINTER.y = -((e.clientY / window.innerHeight) * 2 - 1);
      POINTER.energy = 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reducedMotion]);

  useFrame((_, dt) => {
    POINTER.energy = THREE.MathUtils.damp(POINTER.energy, 0, 1.6, dt);

    const fog = scene.fog as THREE.FogExp2 | null;
    if (!fog) return;
    const progress = useAppStore.getState().progress;

    const density = sampleKeyframes(FOG_KEYFRAMES, progress);
    fog.density = THREE.MathUtils.damp(fog.density, density, 2.5, dt);

    // Per-project "rooms": shift the accent and bleed a little of it into the
    // fog so each clearing feels like its own color of light.
    sampleAccent(progress, SCENE_ACCENT);
    _fogTarget.copy(ABYSS_COLOR).lerp(SCENE_ACCENT, 0.11);
    fog.color.lerp(_fogTarget, 1 - Math.exp(-3 * dt));
  });

  return null;
}

/** Steps render quality down (and DPR with it) when the frame rate dips. */
function PerfGovernor() {
  const setDpr = useThree((s) => s.setDpr);

  return (
    <PerformanceMonitor
      onDecline={() => {
        const { quality, setQuality } = useAppStore.getState();
        if (quality === "high") {
          setQuality("medium");
          setDpr(1.25);
        } else if (quality === "medium") {
          setQuality("low");
          setDpr(1);
        }
      }}
    />
  );
}

export default function Experience() {
  // Pause the whole render loop while the tab is hidden — no point burning GPU
  // (and battery) animating a forest nobody is looking at.
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    const onVisibility = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  return (
    <Canvas
      frameloop={hidden ? "never" : "always"}
      dpr={[1, 1.5]}
      camera={{ fov: 55, near: 0.1, far: 150, position: [0, 1.4, 10] }}
      gl={{ antialias: false, powerPreference: "high-performance" }}
      style={{ pointerEvents: "none" }}
      eventSource={typeof document !== "undefined" ? document.body : undefined}
    >
      <color attach="background" args={[ABYSS]} />
      <fogExp2 attach="fog" args={[ABYSS, 0.048]} />

      <SceneState />
      <PerfGovernor />
      <CameraRig />

      <Ground />
      <Forest />
      <Mushrooms />
      <Grass />
      <Fireflies />
      <Spores />
      <LightShafts />
      <HorizonGlow />

      <Effects />
    </Canvas>
  );
}
