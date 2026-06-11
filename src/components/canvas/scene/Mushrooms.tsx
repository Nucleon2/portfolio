import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { mushroomVertex, mushroomFragment } from "../shaders/fresnelGlow";
import { CLEARINGS, mulberry32, BIO } from "@/lib/sceneConfig";

const PER_CLEARING = 5;
const AMBIENT = 22;
const COUNT = CLEARINGS.length * PER_CLEARING + AMBIENT;

/** Glowing mushroom clusters — one tinted clearing per project, plus ambient stragglers. */
export function Mushrooms() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const { capGeometry, stemGeometry, matrices, phases, tints } = useMemo(() => {
    const profile: THREE.Vector2[] = [
      new THREE.Vector2(0.03, 0),
      new THREE.Vector2(0.3, 0.06),
      new THREE.Vector2(0.43, 0.2),
      new THREE.Vector2(0.32, 0.36),
      new THREE.Vector2(0.06, 0.44),
    ];
    const cap = new THREE.LatheGeometry(profile, 14);
    cap.translate(0, 0.3, 0);
    const stem = new THREE.CylinderGeometry(0.055, 0.09, 0.36, 8);
    stem.translate(0, 0.18, 0);

    const rng = mulberry32(4242);
    const m: THREE.Matrix4[] = [];
    const phaseArr = new Float32Array(COUNT);
    const tintArr = new Float32Array(COUNT * 3);
    const q = new THREE.Quaternion();
    const up = new THREE.Vector3(0, 1, 0);
    const ambientTint = new THREE.Color(BIO).multiplyScalar(0.7);

    let i = 0;
    for (const clearing of CLEARINGS) {
      for (let k = 0; k < PER_CLEARING; k++) {
        const angle = rng() * Math.PI * 2;
        const radius = 0.3 + rng() * 1.3;
        const pos = new THREE.Vector3(
          clearing.position.x + Math.cos(angle) * radius,
          0,
          clearing.position.z + Math.sin(angle) * radius,
        );
        const scale = k === 0 ? 1.5 + rng() * 0.6 : 0.5 + rng() * 0.8;
        q.setFromAxisAngle(up, rng() * Math.PI * 2);
        const mat = new THREE.Matrix4().compose(pos, q, new THREE.Vector3(scale, scale, scale));
        m.push(mat);
        phaseArr[i] = rng() * Math.PI * 2;
        clearing.tint.toArray(tintArr, i * 3);
        i++;
      }
    }
    for (let k = 0; k < AMBIENT; k++) {
      const side = k % 2 === 0 ? -1 : 1;
      const pos = new THREE.Vector3(side * (3.2 + rng() * 6), 0, 14 - rng() * 95);
      const scale = 0.35 + rng() * 0.5;
      q.setFromAxisAngle(up, rng() * Math.PI * 2);
      m.push(new THREE.Matrix4().compose(pos, q, new THREE.Vector3(scale, scale, scale)));
      phaseArr[i] = rng() * Math.PI * 2;
      ambientTint.toArray(tintArr, i * 3);
      i++;
    }

    return { capGeometry: cap, stemGeometry: stem, matrices: m, phases: phaseArr, tints: tintArr };
  }, []);

  const { caps, stems } = useMemo(() => {
    capGeometry.setAttribute("aPhase", new THREE.InstancedBufferAttribute(phases, 1));
    capGeometry.setAttribute("aTint", new THREE.InstancedBufferAttribute(tints, 3));

    const capMaterial = new THREE.ShaderMaterial({
      vertexShader: mushroomVertex,
      fragmentShader: mushroomFragment,
      uniforms: THREE.UniformsUtils.merge([
        THREE.UniformsLib.fog,
        {
          uTime: { value: 0 },
          uBase: { value: new THREE.Color("#0a2618") },
          uGlowBoost: { value: 1 },
        },
      ]),
      fog: true,
    });
    const capMesh = new THREE.InstancedMesh(capGeometry, capMaterial, COUNT);
    const stemMesh = new THREE.InstancedMesh(
      stemGeometry,
      new THREE.MeshBasicMaterial({ color: "#11301f" }),
      COUNT,
    );
    matrices.forEach((mat, idx) => {
      capMesh.setMatrixAt(idx, mat);
      stemMesh.setMatrixAt(idx, mat);
    });
    capMesh.instanceMatrix.needsUpdate = true;
    stemMesh.instanceMatrix.needsUpdate = true;
    capMesh.frustumCulled = false;
    stemMesh.frustumCulled = false;
    return { caps: capMesh, stems: stemMesh };
  }, [capGeometry, stemGeometry, matrices, phases, tints]);

  useFrame((_, dt) => {
    (caps.material as THREE.ShaderMaterial).uniforms.uTime.value += dt;
  });

  // Keep a ref for potential external tuning; material lives on the mesh.
  materialRef.current = caps.material as THREE.ShaderMaterial;

  return (
    <group>
      <primitive object={caps} />
      <primitive object={stems} />
    </group>
  );
}
