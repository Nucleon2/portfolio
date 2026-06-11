import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { grassVertex, grassFragment } from "../shaders/grass";
import { mulberry32 } from "@/lib/sceneConfig";
import { useAppStore } from "@/lib/store";

const BASE_COUNT = 2800;
const QUALITY_FACTOR = { high: 1, medium: 0.6, low: 0.35 } as const;

export function Grass() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  // Always build the full set; quality tiers shrink the rendered count via
  // mesh.count — rebuilding the geometry mid-scroll causes visible hitches.
  const count = BASE_COUNT;

  const mesh = useMemo(() => {
    const blade = new THREE.PlaneGeometry(0.07, 0.55, 1, 3);
    blade.translate(0, 0.275, 0);

    const rng = mulberry32(9001);
    const phases = new Float32Array(count);
    const leans = new Float32Array(count);

    const material = new THREE.ShaderMaterial({
      vertexShader: grassVertex,
      fragmentShader: grassFragment,
      uniforms: THREE.UniformsUtils.merge([
        THREE.UniformsLib.fog,
        {
          uTime: { value: 0 },
          uRoot: { value: new THREE.Color("#06140c") },
          uTip: { value: new THREE.Color("#1e8a4c") },
          uGlow: { value: new THREE.Color("#3fdc77") },
        },
      ]),
      fog: true,
      side: THREE.DoubleSide,
    });

    const instanced = new THREE.InstancedMesh(blade, material, count);
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const up = new THREE.Vector3(0, 1, 0);

    for (let i = 0; i < count; i++) {
      // Bias blades toward the camera corridor where they're actually seen.
      const spread = Math.pow(rng(), 1.6);
      const x = (rng() < 0.5 ? -1 : 1) * spread * 11;
      const z = 14 - rng() * 86;
      const scale = 0.6 + rng() * 0.9;
      q.setFromAxisAngle(up, rng() * Math.PI * 2);
      m.compose(new THREE.Vector3(x, 0, z), q, new THREE.Vector3(scale, scale, scale));
      instanced.setMatrixAt(i, m);
      phases[i] = rng() * Math.PI * 2;
      leans[i] = (rng() - 0.5) * 2;
    }
    blade.setAttribute("aPhase", new THREE.InstancedBufferAttribute(phases, 1));
    blade.setAttribute("aLean", new THREE.InstancedBufferAttribute(leans, 1));
    instanced.instanceMatrix.needsUpdate = true;
    instanced.frustumCulled = false;
    return instanced;
  }, [count]);

  useFrame((_, dt) => {
    (mesh.material as THREE.ShaderMaterial).uniforms.uTime.value += dt;
    const visible = Math.floor(BASE_COUNT * QUALITY_FACTOR[useAppStore.getState().quality]);
    if (mesh.count !== visible) mesh.count = visible;
  });

  materialRef.current = mesh.material as THREE.ShaderMaterial;

  return <primitive object={mesh} />;
}
