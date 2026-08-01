"use client";

import { createContext, useContext, useMemo, useRef } from "react";
import type { ReactNode, RefObject } from "react";

/**
 * Shared per-frame map state, held as REFS rather than state: these change
 * every frame, and nothing about them should ever trigger a React render.
 *
 *   progress — "flatten into the map" completion, 0 → 1. ExploreControls
 *              advances it; the labels and trail fade themselves in off it.
 *   revolve  — the constellation's current rotation about the map centre, in
 *              radians. MapOrbit advances it and applies it to the group;
 *              ExploreControls reads it to work out where an island actually
 *              IS right now, since a revolving island is no longer where its
 *              config position says it is.
 */
interface MapState {
  progress: RefObject<number>;
  revolve: RefObject<number>;
}

const MapStateContext = createContext<MapState | null>(null);

export function MapProgressProvider({ children }: { children: ReactNode }) {
  const progress = useRef(0);
  const revolve = useRef(0);
  const value = useMemo<MapState>(() => ({ progress, revolve }), []);

  return (
    <MapStateContext.Provider value={value}>
      {children}
    </MapStateContext.Provider>
  );
}

function useMapState(): MapState {
  const ctx = useContext(MapStateContext);
  if (!ctx) {
    throw new Error("useMapState must be used inside <MapProgressProvider>");
  }
  return ctx;
}

export function useMapProgress(): RefObject<number> {
  return useMapState().progress;
}

export function useRevolveAngle(): RefObject<number> {
  return useMapState().revolve;
}
