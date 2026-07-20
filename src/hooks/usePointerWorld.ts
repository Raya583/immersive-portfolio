"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Vector3 } from "three";

/**
 * Tracks the pointer and exposes a smoothed world-space point on the z=0
 * plane (where the particle field is centred). The smoothing (lerp) makes
 * the cursor influence trail the mouse slightly, which reads as "alive".
 *
 * IMPORTANT: the camera is parented inside the CameraRig group, so its LOCAL
 * position is (0,0,0) while its WORLD position is elsewhere (e.g. 0,0,8). We
 * must use the world position for the ray, or the projection aims at the wrong
 * depth and the cursor influence lands on empty space. getWorldPosition()
 * reads the true world transform regardless of parenting.
 */
export function usePointerWorld(smoothing = 8) {
  const { pointer, camera } = useThree();

  const worldPoint = useRef(new Vector3());
  const target = useRef(new Vector3());
  const camWorld = useRef(new Vector3());

  useFrame((_state, delta) => {
    // True world position of the camera (accounts for the rig parent).
    camera.getWorldPosition(camWorld.current);

    // Unproject the pointer (NDC) into world space, then build a ray from
    // the camera through that point and walk it to the z=0 plane.
    target.current.set(pointer.x, pointer.y, 0.5);
    target.current.unproject(camera); // uses world matrices internally
    target.current.sub(camWorld.current).normalize();

    // Guard against a near-parallel ray (avoid divide blow-ups).
    const dirZ = target.current.z;
    if (Math.abs(dirZ) > 1e-5) {
      const distance = -camWorld.current.z / dirZ;
      target.current.multiplyScalar(distance).add(camWorld.current);

      const alpha = 1 - Math.exp(-smoothing * delta);
      worldPoint.current.lerp(target.current, alpha);
    }
  });

  return worldPoint;
}
