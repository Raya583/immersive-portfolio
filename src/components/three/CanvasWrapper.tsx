"use client";

import { Canvas } from "@react-three/fiber";
import type { ReactNode } from "react";
import { SCENE_CONFIG } from "@/config/scene";

interface CanvasWrapperProps {
  children?: ReactNode;
}

/**
 * The single R3F entry point. GL clear color is the void black so the very
 * first frame (and everything behind the transparent sky-burst) is dark.
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
      onCreated={({ gl }) => {
        gl.setClearColor("#05040a", 1);
      }}
      flat={false}
    >
      {children}
    </Canvas>
  );
}
