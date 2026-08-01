"use client";

import { createContext, useContext, useRef } from "react";
import type { ReactNode, RefObject } from "react";

/**
 * Shares the "flatten into a map" progress (0 → 1) across the scene as a REF,
 * not state: ExploreControls advances it every frame while the camera flies to
 * its bird's-eye pose, and the labels/trail read it inside their own useFrame.
 * A ref keeps a per-frame value out of React's render cycle entirely.
 */
const MapProgressContext = createContext<RefObject<number> | null>(null);

export function MapProgressProvider({ children }: { children: ReactNode }) {
  const progress = useRef(0);
  return (
    <MapProgressContext.Provider value={progress}>
      {children}
    </MapProgressContext.Provider>
  );
}

export function useMapProgress(): RefObject<number> {
  const progress = useContext(MapProgressContext);
  if (!progress) {
    throw new Error("useMapProgress must be used inside <MapProgressProvider>");
  }
  return progress;
}
