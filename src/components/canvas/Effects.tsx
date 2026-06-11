import { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import {
  EffectComposer,
  Bloom,
  Vignette,
  Noise,
  ChromaticAberration,
} from "@react-three/postprocessing";
import type { BloomEffect, ChromaticAberrationEffect } from "postprocessing";
import { useAppStore } from "@/lib/store";

const BASE_BLOOM = 0.82;

/** Drives the live bloom/chromatic response: a one-shot pulse when the contact
 *  CTA is clicked, and a subtle chromatic shift that scales with scroll speed. */
function PostDriver({
  bloomRef,
  caRef,
}: {
  bloomRef: React.RefObject<BloomEffect | null>;
  caRef: React.RefObject<ChromaticAberrationEffect | null>;
}) {
  const pulse = useRef(0);
  const lastPulse = useRef(0);
  const vel = useRef(0);

  useFrame((_, dt) => {
    const { ctaPulse, scrollVelocity } = useAppStore.getState();

    // A click on "Say hello" surges bloom through the whole forest, then settles.
    if (ctaPulse !== lastPulse.current) {
      lastPulse.current = ctaPulse;
      pulse.current = 1;
    }
    pulse.current = THREE.MathUtils.damp(pulse.current, 0, 1.1, dt);
    if (bloomRef.current) bloomRef.current.intensity = BASE_BLOOM + pulse.current * 2.4;

    vel.current = THREE.MathUtils.damp(vel.current, scrollVelocity, 5, dt);
    if (caRef.current) {
      const o = 0.0005 + vel.current * 0.002 + pulse.current * 0.0018;
      caRef.current.offset.set(o, o);
    }
  });

  return null;
}

export function Effects() {
  const quality = useAppStore((s) => s.quality);
  const bloomRef = useRef<BloomEffect>(null);
  const caRef = useRef<ChromaticAberrationEffect>(null);

  return (
    <>
      <EffectComposer multisampling={0}>
        <Bloom
          ref={bloomRef}
          mipmapBlur
          intensity={BASE_BLOOM}
          luminanceThreshold={0.42}
          luminanceSmoothing={0.2}
          radius={0.8}
        />
        {quality !== "low" ? (
          <ChromaticAberration
            ref={caRef}
            offset={new THREE.Vector2(0.0005, 0.0005)}
            radialModulation={false}
            modulationOffset={0}
          />
        ) : (
          <></>
        )}
        {quality === "high" ? <Noise opacity={0.05} /> : <></>}
        {quality !== "low" ? <Vignette eskil={false} offset={0.22} darkness={0.85} /> : <></>}
      </EffectComposer>
      <PostDriver bloomRef={bloomRef} caRef={caRef} />
    </>
  );
}
