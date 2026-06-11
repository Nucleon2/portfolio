import { useMemo } from "react";
import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { mulberry32 } from "@/lib/sceneConfig";

const TREE_COUNT = 72;

/** Dark conifer silhouettes — fog and bloom do the heavy lifting. */
export function Forest() {
  const geometry = useMemo(() => {
    const trunk = new THREE.CylinderGeometry(0.14, 0.32, 7, 6);
    trunk.translate(0, 3.5, 0);
    const tier1 = new THREE.ConeGeometry(1.7, 3.4, 7);
    tier1.translate(0, 5.6, 0);
    const tier2 = new THREE.ConeGeometry(1.2, 2.6, 7);
    tier2.translate(0, 7.5, 0);
    const tier3 = new THREE.ConeGeometry(0.75, 2.0, 7);
    tier3.translate(0, 9.2, 0);
    const merged = mergeGeometries([trunk, tier1, tier2, tier3]);
    [trunk, tier1, tier2, tier3].forEach((g) => g.dispose());
    return merged;
  }, []);

  const mesh = useMemo(() => {
    const material = new THREE.MeshBasicMaterial({ color: "#05170d" });
    const instanced = new THREE.InstancedMesh(geometry, material, TREE_COUNT);
    const rng = mulberry32(1337);
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const up = new THREE.Vector3(0, 1, 0);

    for (let i = 0; i < TREE_COUNT; i++) {
      // Keep a corridor clear along the weaving camera path (|x| > 5).
      const side = i % 2 === 0 ? -1 : 1;
      const x = side * (5.5 + rng() * 30);
      const z = 18 - rng() * 128;
      const scale = 0.65 + rng() * 1.1;
      q.setFromAxisAngle(up, rng() * Math.PI * 2);
      m.compose(
        new THREE.Vector3(x, 0, z),
        q,
        new THREE.Vector3(scale, scale * (0.85 + rng() * 0.4), scale),
      );
      instanced.setMatrixAt(i, m);
    }
    instanced.instanceMatrix.needsUpdate = true;
    instanced.frustumCulled = false;
    return instanced;
  }, [geometry]);

  return <primitive object={mesh} />;
}
