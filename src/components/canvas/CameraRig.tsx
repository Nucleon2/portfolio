import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { damp, damp3 } from "maath/easing";
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
  const parallax = useRef(new THREE.Vector3());
  const parallaxTarget = useRef(new THREE.Vector3());

  useFrame((state, dt) => {
    const target = useAppStore.getState().progress;
    damp(smoothed.current, "p", target, 0.3, dt);
    const p = THREE.MathUtils.clamp(smoothed.current.p, 0, 1);

    positionCurve.getPointAt(p, state.camera.position);
    lookCurve.getPointAt(p, lookTarget.current);

    // Subtle pointer parallax, heavily damped — raw pointer values would
    // snap the camera around on every fast mouse move.
    parallaxTarget.current.set(state.pointer.x * 0.3, state.pointer.y * 0.15, 0);
    damp3(parallax.current, parallaxTarget.current, 0.6, dt);
    state.camera.position.add(parallax.current);

    state.camera.lookAt(lookTarget.current);
  });

  return null;
}
