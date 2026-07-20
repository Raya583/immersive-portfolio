"use client";

import { Canvas } from "@react-three/fiber";
import type { ReactNode } from "react";
import { SCENE_CONFIG } from "@/config/scene";

interface CanvasWrapperProps {
  children?: ReactNode;
}

/**
 * The single R3F entry point. Renders a fullscreen WebGL canvas that fills
 * its parent container. All 3D content is mounted as children so the scene
 * graph stays declarative and composable.
 */
export function CanvasWrapper({ children }: CanvasWrapperProps) {
  return (
    <Canvas
      className="h-full w-full"
      dpr={SCENE_CONFIG.dpr}
      camera={{
        fov: SCENE_CONFIG.camera.fov,
        near: SCENE_CONFIG.camera.near,
        far: SCENE_CONFIG.camera.far,
        position: SCENE_CONFIG.camera.position,
      }}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
      }}
      // Color management is on by default in R3F; keep it explicit.
      flat={false}
    >
      {children}
    </Canvas>
  );
}
