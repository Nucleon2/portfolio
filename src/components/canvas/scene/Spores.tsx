import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { firefliesVertex, firefliesFragment } from "../shaders/fireflies";
import { mulberry32, sampleKeyframes, POINTER, SPORE } from "@/lib/sceneConfig";
import { useAppStore } from "@/lib/store";
import { useReducedMotion } from "@/lib/useReducedMotion";

const BASE_COUNT = 550;
const QUALITY_FACTOR = { high: 1, medium: 0.6, low: 0.35 } as const;

/** Spores peak as the camera rises through the canopy (skills section). */
const INTENSITY_FRAMES: [number, number][] = [
  [0, 0.35],
  [0.6, 0.5],
  [0.82, 1.1],
  [1, 0.5],
];

/** Slow, dim drifting motes — same shader as fireflies, gentler settings. */
export function Spores() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const reducedMotion = useReducedMotion();
  // Full buffer once; quality tiers shrink the draw range (no rebuild hitch).
  const count = BASE_COUNT;

  const geometry = useMemo(() => {
    const rng = mulberry32(31415);
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count * 3);
    const scales = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (rng() - 0.5) * 30;
      positions[i * 3 + 1] = 1 + rng() * 11;
      positions[i * 3 + 2] = 14 - rng() * 104;
      seeds[i * 3] = rng();
      seeds[i * 3 + 1] = rng();
      seeds[i * 3 + 2] = rng();
      scales[i] = 1.2 + rng() * 2.2;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 3));
    geo.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));
    return geo;
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 100 }, // offset so spores desync from fireflies
      uSize: { value: 90 },
      uPixelRatio: { value: 1 },
      uColor: { value: new THREE.Color(SPORE).multiplyScalar(0.55) },
      uIntensity: { value: 0.5 },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uPointerStrength: { value: 0 },
      uVelocity: { value: 0 },
    }),
    [],
  );

  useFrame((state, dt) => {
    const mat = materialRef.current;
    if (!mat) return;
    mat.uniforms.uTime.value += dt * (reducedMotion ? 0.08 : 0.45);
    mat.uniforms.uPixelRatio.value = state.gl.getPixelRatio();
    const { progress, quality } = useAppStore.getState();
    mat.uniforms.uIntensity.value = sampleKeyframes(INTENSITY_FRAMES, progress);
    (mat.uniforms.uPointer.value as THREE.Vector2).set(POINTER.x, POINTER.y);
    mat.uniforms.uPointerStrength.value = POINTER.energy * 0.6;
    const visible = Math.floor(BASE_COUNT * QUALITY_FACTOR[quality]);
    if (geometry.drawRange.count !== visible) geometry.setDrawRange(0, visible);
  });

  return (
    <points geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={materialRef}
        vertexShader={firefliesVertex}
        fragmentShader={firefliesFragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
