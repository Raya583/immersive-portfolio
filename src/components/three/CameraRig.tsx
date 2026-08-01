"use client";

import { useThree } from "@react-three/fiber";
import { useLayoutEffect } from "react";
import { getCameraTarget } from "@/config/camera";
import { useCameraRig } from "@/hooks/useCameraRig";
import { useCreationStep } from "@/hooks/creationContext";
import { EXPLORE_CONFIG } from "@/config/explore";

/**
 * The camera rig. Holds the default camera during the cinematic, positioning
 * it for the creation sequence. Once free-explore unlocks (final step), it
 * RELEASES the camera so OrbitControls can take over cleanly (a parented camera
 * and OrbitControls would fight).
 */
export function CameraRig() {
  const { rigRef, activeTargetId } = useCameraRig();
  const camera = useThree((s) => s.camera);
  const step = useCreationStep();

  const exploring = step >= EXPLORE_CONFIG.unlockAtStep;

  useLayoutEffect(() => {
    if (exploring) return;
    const rig = rigRef.current;
    const target = getCameraTarget(activeTargetId);
    if (!rig || !target) return;

    rig.position.set(target.position[0], target.position[1], target.position[2]);
    camera.position.set(0, 0, 0);
    camera.lookAt(target.lookAt[0], target.lookAt[1], target.lookAt[2]);
  }, [rigRef, activeTargetId, camera, exploring]);

  return (
    <group ref={rigRef}>
      {!exploring && <primitive object={camera} />}
    </group>
  );
}
