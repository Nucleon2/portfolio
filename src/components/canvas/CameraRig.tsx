import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { damp } from "maath/easing";
import { CAMERA_POINTS, LOOKAT_POINTS } from "@/lib/sceneConfig";
import { useAppStore } from "@/lib/store";

/**
 * Cinematic camera: glides along a Catmull-Rom spline as you scroll, with a
 * parallel curve for lookAt targets so it "looks across" the clearings
 * instead of staring down the path. Damping lives here, so even instant
 * anchor jumps become a glide.
 */
export function CameraRig() {
  const { positionCurve, lookCurve } = useMemo(
    () => ({
      positionCurve: new THREE.CatmullRomCurve3(CAMERA_POINTS, false, "catmullrom", 0.5),
      lookCurve: new THREE.CatmullRomCurve3(LOOKAT_POINTS, false, "catmullrom", 0.5),
    }),
    [],
  );

  const smoothed = useRef({ p: 0 });
  const lookTarget = useRef(new THREE.Vector3());

  useFrame((state, dt) => {
    const target = useAppStore.getState().progress;
    damp(smoothed.current, "p", target, 0.3, dt);
    const p = THREE.MathUtils.clamp(smoothed.current.p, 0, 1);

    positionCurve.getPointAt(p, state.camera.position);
    lookCurve.getPointAt(p, lookTarget.current);

    // Subtle pointer parallax so the forest feels alive under the cursor.
    state.camera.position.x += state.pointer.x * 0.35;
    state.camera.position.y += state.pointer.y * 0.18;

    state.camera.lookAt(lookTarget.current);
  });

  return null;
}
