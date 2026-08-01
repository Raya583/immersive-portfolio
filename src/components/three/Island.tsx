"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import type { Group } from "three";
import {
  ISLAND_APPEAR_SECONDS,
  ISLAND_STAGGER_SECONDS,
  ISLAND_SPIN_SPEED,
  ISLAND_HOVER_SCALE,
  ISLAND_HOVER_SECONDS,
  type IslandConfig,
} from "@/config/islands";
import { EXPLORE_CONFIG } from "@/config/explore";
import { useCreationStep } from "@/hooks/creationContext";
import { useMapProgress } from "@/hooks/mapContext";
import { useSelection } from "@/hooks/selectionContext";
import { easeAlpha } from "@/hooks/creationMath";

/**
 * Loads and places one island model. It materialises at its `appearAtStep`
 * (staggered by index), then slowly spins in place so the world feels alive
 * as the user orbits around it.
 *
 * Once the map has settled it also becomes CLICKABLE: hovering swells it and
 * shows a pointer, clicking asks the camera to fly in and the scroll to open.
 * Both are gated on the map view being fully arrived and nothing else being
 * open, so a click can never land mid-flight and fight the camera for control.
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
  const mapProgress = useMapProgress();
  const { phase, select } = useSelection();

  const outerRef = useRef<Group>(null);
  const spinRef = useRef<Group>(null);
  const appear = useRef(0);
  const delay = useRef(0);
  const hovered = useRef(false);
  const hover = useRef(0);

  /** Clicking is only live on a settled map with no project already open. */
  const selectable = step >= EXPLORE_CONFIG.unlockAtStep && phase === "idle";

  const setCursor = (value: string) => {
    document.body.style.cursor = value;
  };

  // Drop any hover state the moment interaction is switched off (or the
  // component goes away), so the pointer can't get stuck as a hand.
  useEffect(() => {
    if (selectable) return;
    hovered.current = false;
    setCursor("auto");
  }, [selectable]);

  useEffect(() => () => setCursor("auto"), []);

  const canInteract = () => selectable && mapProgress.current >= 0.999;

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

    const hoverTarget = hovered.current ? 1 : 0;
    hover.current += (hoverTarget - hover.current) *
      easeAlpha(ISLAND_HOVER_SECONDS, delta);

    if (outerRef.current) {
      outerRef.current.visible = a > 0.001;
      const s = a * config.scale * (1 + hover.current * ISLAND_HOVER_SCALE);
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
    <group
      ref={outerRef}
      visible={false}
      onPointerOver={(e) => {
        if (!canInteract()) return;
        e.stopPropagation();
        hovered.current = true;
        setCursor("pointer");
      }}
      onPointerOut={() => {
        hovered.current = false;
        setCursor("auto");
      }}
      onClick={(e) => {
        if (!canInteract()) return;
        e.stopPropagation();
        hovered.current = false;
        setCursor("auto");
        select(config.id);
      }}
    >
      <group ref={spinRef} rotation={config.rotation}>
        <primitive object={model} />
      </group>
    </group>
  );
}
