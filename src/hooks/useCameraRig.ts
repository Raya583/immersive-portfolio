"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Vector3 } from "three";
import type { Group } from "three";
import { CAMERA_RIG_CONFIG, getCameraTarget } from "@/config/camera";

interface UseCameraRig {
  /** Ref to attach to the rig <group> that holds the camera. */
  rigRef: React.RefObject<Group | null>;
  /** Id of the target the rig is currently traveling toward. */
  activeTargetId: string;
  /** Command the rig to travel to another declared target. */
  goToTarget: (id: string) => void;
}

/**
 * Owns the camera rig's motion. Every frame it eases the rig's position and
 * the camera's look direction toward the active target.
 *
 * Motion is layered by design:
 *   - This hook moves the RIG (the "where in the world am I" layer).
 *   - Later, cursor drift / idle sway will move the CAMERA *within* the rig,
 *     so the two never fight. Scripted island-to-island flights (GSAP) will
 *     also drive the rig, replacing this passive easing during a transition.
 *
 * Easing is frame-rate independent: we use an exponential approach based on
 * `delta`, so the rig reaches its target in the same wall-clock time at 60Hz
 * or 144Hz. A fixed per-frame lerp factor would move faster on high-refresh
 * displays and quietly wreck cinematic pacing.
 */
export function useCameraRig(): UseCameraRig {
  const camera = useThree((s) => s.camera);
  const rigRef = useRef<Group | null>(null);

  const [activeTargetId, setActiveTargetId] = useState(
    CAMERA_RIG_CONFIG.initialTargetId,
  );

  // Scratch vectors reused across frames — never allocate inside useFrame.
  const desiredPos = useMemo(() => new Vector3(), []);
  const currentLookAt = useMemo(() => new Vector3(), []);
  const desiredLookAt = useMemo(() => new Vector3(), []);

  // Seed the current lookAt from the initial target so the first frames
  // ease from a sensible direction rather than snapping.
  const seeded = useRef(false);

  const goToTarget = useCallback((id: string) => {
    if (!getCameraTarget(id)) {
      if (process.env.NODE_ENV !== "production") {
        // eslint-disable-next-line no-console
        console.warn(`[useCameraRig] Unknown camera target "${id}" — ignored.`);
      }
      return;
    }
    setActiveTargetId(id);
  }, []);

  useFrame((_state, delta) => {
    const rig = rigRef.current;
    if (!rig) return;

    const target = getCameraTarget(activeTargetId);
    if (!target) return;

    // Frame-rate-independent smoothing factor in [0, 1].
    // alpha = 1 - e^(-smoothing * delta)
    const alpha = 1 - Math.exp(-CAMERA_RIG_CONFIG.smoothing * delta);

    // Ease the rig toward the target position.
    desiredPos.set(target.position[0], target.position[1], target.position[2]);
    rig.position.lerp(desiredPos, alpha);

    // Ease the look direction. The camera sits inside the rig, so we point
    // it at the world-space lookAt each frame.
    desiredLookAt.set(target.lookAt[0], target.lookAt[1], target.lookAt[2]);
    if (!seeded.current) {
      currentLookAt.copy(desiredLookAt);
      seeded.current = true;
    }
    currentLookAt.lerp(desiredLookAt, alpha);
    camera.lookAt(currentLookAt);
  });

  return { rigRef, activeTargetId, goToTarget };
}
