import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { groundVertex, groundFragment } from "../shaders/ground";
import { useAppStore } from "@/lib/store";
import { sections, rangeProgress } from "@/lib/sections";
import { BIO } from "@/lib/sceneConfig";

const XP_RANGE = sections.find((s) => s.id === "experience")!.range;

export function Ground() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(240, 170, 180, 120);
    // Bake the rotation so local coords are world-aligned (x/z plane, y up)
    // and the displacement shader can reason in world space.
    geo.rotateX(-Math.PI / 2);
    return geo;
  }, []);

  const uniforms = useMemo(
    () =>
      THREE.UniformsUtils.merge([
        THREE.UniformsLib.fog,
        {
          uTime: { value: 0 },
          uBase: { value: new THREE.Color("#071c11") },
          uVeinColor: { value: new THREE.Color(BIO) },
          uVeinIntensity: { value: 0.35 },
        },
      ]),
    [],
  );

  useFrame((_, dt) => {
    const mat = materialRef.current;
    if (!mat) return;
    mat.uniforms.uTime.value += dt;

    // Veins surge while the experience section "tracks the timeline".
    const progress = useAppStore.getState().progress;
    const xp = rangeProgress(progress, XP_RANGE);
    const surge = Math.sin(Math.PI * xp) * 0.9;
    mat.uniforms.uVeinIntensity.value = 0.35 + surge;
  });

  return (
    <mesh geometry={geometry} position={[0, 0, -35]} frustumCulled={false}>
      <shaderMaterial
        ref={materialRef}
        vertexShader={groundVertex}
        fragmentShader={groundFragment}
        uniforms={uniforms}
        fog
      />
    </mesh>
  );
}
