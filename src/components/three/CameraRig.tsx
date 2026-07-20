"use client";

import { useThree } from "@react-three/fiber";
import { useLayoutEffect } from "react";
import { getCameraTarget } from "@/config/camera";
import { useCameraRig } from "@/hooks/useCameraRig";

/**
 * The camera rig. A <group> that holds the default R3F camera; the rig is
 * what travels through the world while the camera makes subtle relative
 * moves inside it (added later at the Cursor Interaction step).
 *
 * On mount it places the rig at its initial target so there's no visible
 * glide from the origin on first paint.
 */
export function CameraRig() {
  const { rigRef, activeTargetId } = useCameraRig();
  const camera = useThree((s) => s.camera);

  useLayoutEffect(() => {
    const rig = rigRef.current;
    const target = getCameraTarget(activeTargetId);
    if (!rig || !target) return;

    // Snap the rig to the starting target before the first frame renders.
    rig.position.set(target.position[0], target.position[1], target.position[2]);
    // Reset the camera's local offset — it rides the rig, no local transform yet.
    camera.position.set(0, 0, 0);
    camera.lookAt(target.lookAt[0], target.lookAt[1], target.lookAt[2]);
    // Ensure the camera is a child of the rig in the scene graph.
    // (Attachment happens via JSX below; this just guarantees a clean start.)
  }, [rigRef, activeTargetId, camera]);

  return (
    <group ref={rigRef}>
      {/* The default camera is attached to the rig so it inherits rig motion. */}
      <primitive object={camera} />
    </group>
  );
}
