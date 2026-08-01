"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import type { Group } from "three";
import {
  ISLAND_APPEAR_SECONDS,
  ISLAND_STAGGER_SECONDS,
  ISLAND_SPIN_SPEED,
  type IslandConfig,
} from "@/config/islands";
import { useCreationStep } from "@/hooks/creationContext";
import { easeAlpha } from "@/hooks/creationMath";

/**
 * Loads and places one island model. It materialises at its `appearAtStep`
 * (staggered by index), then slowly spins in place so the world feels alive
 * as the user orbits around it.
 */
export function Island({
  config,
  index,
}: {
  config: IslandConfig;
  index: number;
}) {
  const { scene } = useGLTF(config.model);
  const model = useMemo(() => scene.clone(), [scene]);

  const step = useCreationStep();
  const outerRef = useRef<Group>(null);
  const spinRef = useRef<Group>(null);
  const appear = useRef(0);
  const delay = useRef(0);

  useFrame((_state, delta) => {
    const reached = step >= config.appearAtStep;

    let target = 0;
    if (reached) {
      delay.current += delta;
      if (delay.current >= index * ISLAND_STAGGER_SECONDS) target = 1;
    } else {
      delay.current = 0;
    }

    appear.current += (target - appear.current) *
      easeAlpha(ISLAND_APPEAR_SECONDS, delta);
    const a = appear.current;

    if (outerRef.current) {
      outerRef.current.visible = a > 0.001;
      const s = a * config.scale;
      outerRef.current.scale.set(s, s, s);
      outerRef.current.position.set(
        config.position[0],
        config.position[1] - (1 - a) * 3,
        config.position[2],
      );
    }
    if (spinRef.current && a > 0.01) {
      spinRef.current.rotation.y += ISLAND_SPIN_SPEED * delta;
    }
  });

  return (
    <group ref={outerRef} visible={false}>
      <group ref={spinRef} rotation={config.rotation}>
        <primitive object={model} />
      </group>
    </group>
  );
}
