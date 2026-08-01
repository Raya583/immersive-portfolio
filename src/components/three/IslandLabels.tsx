"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { ISLANDS, type IslandConfig } from "@/config/islands";
import { MAP_CONFIG } from "@/config/map";
import { useMapProgress } from "@/hooks/mapContext";
import { easeAlpha } from "@/hooks/creationMath";
import type { Vec3 } from "@/types/three";

/**
 * One floating name label. drei's <Html> (non-transform) projects a plain DOM
 * node to the island's screen position, so it always faces the camera and
 * stays crisp at any orbit angle. The fade is driven straight onto the node's
 * style from useFrame — no per-frame React state, no allocations.
 */
function IslandLabel({ config }: { config: IslandConfig }) {
  const progress = useMapProgress();
  const el = useRef<HTMLDivElement>(null);
  const opacity = useRef(0);

  const position = useMemo<Vec3>(
    () => [
      config.position[0],
      config.position[1] + config.labelHeight,
      config.position[2],
    ],
    [config],
  );

  useFrame((_state, delta) => {
    const node = el.current;
    if (!node) return;

    const target = progress.current > MAP_CONFIG.labels.fadeStart ? 1 : 0;
    opacity.current +=
      (target - opacity.current) *
      easeAlpha(MAP_CONFIG.labels.fadeSeconds, delta);

    node.style.opacity = opacity.current.toFixed(3);
    node.style.visibility = opacity.current > 0.01 ? "visible" : "hidden";
  });

  return (
    <Html
      position={position}
      center
      zIndexRange={[8, 0]}
      style={{ pointerEvents: "none", userSelect: "none" }}
    >
      <div ref={el} className="island-label font-hylia" style={{ opacity: 0 }}>
        {config.name}
      </div>
    </Html>
  );
}

/** The themed name floating above every island once the map view is reached. */
export function IslandLabels() {
  return (
    <>
      {ISLANDS.map((config) => (
        <IslandLabel key={config.id} config={config} />
      ))}
    </>
  );
}
