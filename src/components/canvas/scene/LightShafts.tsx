import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { shaftVertex, shaftFragment } from "../shaders/shaft";
import { mulberry32, sampleKeyframes, SPORE } from "@/lib/sceneConfig";
import { useAppStore } from "@/lib/store";

const COUNT = 7;

/** Shafts wake up as the camera climbs toward the canopy. */
const OPACITY_FRAMES: [number, number][] = [
  [0, 0.1],
  [0.5, 0.16],
  [0.72, 0.4],
  [0.85, 0.08], // gone before the camera rises above them (they read as flat cards from up high)
  [1, 0.0],
];

/** Fake god rays: tall additive billboards angled down through the canopy. */
export function LightShafts() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const mesh = useMemo(() => {
    const plane = new THREE.PlaneGeometry(3.2, 20, 1, 1);
    const seeds = new Float32Array(COUNT);

    const material = new THREE.ShaderMaterial({
      vertexShader: shaftVertex,
      fragmentShader: shaftFragment,
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color(SPORE) },
        uOpacity: { value: 0.1 },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    });

    const instanced = new THREE.InstancedMesh(plane, material, COUNT);
    const rng = mulberry32(2024);
    const m = new THREE.Matrix4();
    const euler = new THREE.Euler();
    const q = new THREE.Quaternion();

    for (let i = 0; i < COUNT; i++) {
      const side = i % 2 === 0 ? -1 : 1;
      const x = side * (2.5 + rng() * 9);
      const z = -16 - rng() * 54;
      euler.set(0, (rng() - 0.5) * 0.9, side * (0.12 + rng() * 0.18));
      q.setFromEuler(euler);
      m.compose(new THREE.Vector3(x, 9.5, z), q, new THREE.Vector3(1, 1, 1));
      instanced.setMatrixAt(i, m);
      seeds[i] = rng();
    }
    plane.setAttribute("aSeed", new THREE.InstancedBufferAttribute(seeds, 1));
    instanced.instanceMatrix.needsUpdate = true;
    instanced.frustumCulled = false;
    return instanced;
  }, []);

  useFrame((_, dt) => {
    const mat = mesh.material as THREE.ShaderMaterial;
    mat.uniforms.uTime.value += dt;
    const progress = useAppStore.getState().progress;
    mat.uniforms.uOpacity.value = sampleKeyframes(OPACITY_FRAMES, progress);
  });

  materialRef.current = mesh.material as THREE.ShaderMaterial;

  return <primitive object={mesh} />;
}
