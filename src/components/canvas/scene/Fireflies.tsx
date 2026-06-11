import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { firefliesVertex, firefliesFragment } from "../shaders/fireflies";
import { mulberry32, sampleKeyframes, BIO_BRIGHT } from "@/lib/sceneConfig";
import { useAppStore } from "@/lib/store";
import { useReducedMotion } from "@/lib/useReducedMotion";

const BASE_COUNT = 2400;
const QUALITY_FACTOR = { high: 1, medium: 0.6, low: 0.35 } as const;

/** Firefly density over the journey — thickest at the hero, calm at the end. */
const INTENSITY_FRAMES: [number, number][] = [
  [0, 1.3],
  [0.3, 1.0],
  [0.8, 0.9],
  [1, 0.45],
];

export function Fireflies() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const reducedMotion = useReducedMotion();
  // Full buffer once; quality tiers shrink the draw range (no rebuild hitch).
  const count = BASE_COUNT;

  const geometry = useMemo(() => {
    const rng = mulberry32(777);
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count * 3);
    const scales = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Volume around the path, denser low to the ground.
      positions[i * 3] = (rng() - 0.5) * 28;
      positions[i * 3 + 1] = 0.4 + Math.pow(rng(), 2) * 5.5;
      positions[i * 3 + 2] = 14 - rng() * 102;
      seeds[i * 3] = rng();
      seeds[i * 3 + 1] = rng();
      seeds[i * 3 + 2] = rng();
      scales[i] = 0.4 + rng() * 1.1;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 3));
    geo.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));
    return geo;
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSize: { value: 130 },
      uPixelRatio: { value: 1 },
      uColor: { value: new THREE.Color(BIO_BRIGHT) },
      uIntensity: { value: 1 },
    }),
    [],
  );

  useFrame((state, dt) => {
    const mat = materialRef.current;
    if (!mat) return;
    mat.uniforms.uTime.value += dt * (reducedMotion ? 0.12 : 1);
    mat.uniforms.uPixelRatio.value = state.gl.getPixelRatio();
    const { progress, quality } = useAppStore.getState();
    mat.uniforms.uIntensity.value = sampleKeyframes(INTENSITY_FRAMES, progress);
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
