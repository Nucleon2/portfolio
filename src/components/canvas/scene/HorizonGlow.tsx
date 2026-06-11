import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { horizonVertex, horizonFragment } from "../shaders/shaft";
import { BIO_BRIGHT } from "@/lib/sceneConfig";
import { useAppStore } from "@/lib/store";

/** The payoff above the treeline: a soft dawn-like glow on the horizon. */
export function HorizonGlow() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uColor: { value: new THREE.Color(BIO_BRIGHT) },
      uOpacity: { value: 0 },
    }),
    [],
  );

  useFrame(() => {
    const mat = materialRef.current;
    if (!mat) return;
    const progress = useAppStore.getState().progress;
    // Fades in only for the final contact beat.
    const t = THREE.MathUtils.smoothstep(progress, 0.82, 1);
    mat.uniforms.uOpacity.value = t * 0.4;
  });

  return (
    <mesh position={[0, 17, -118]} frustumCulled={false}>
      <planeGeometry args={[90, 42]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={horizonVertex}
        fragmentShader={horizonFragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}
