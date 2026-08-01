"use client";

import { Canvas } from "@react-three/fiber";
import type { ReactNode } from "react";
import { SCENE_CONFIG } from "@/config/scene";

interface CanvasWrapperProps {
  children?: ReactNode;
}

/**
 * The single R3F entry point.
 *
 * The canvas is cleared TRANSPARENT rather than to a colour, so the still
 * backdrop images layered behind it in the DOM show through (see
 * config/backdrop.ts). During the opening cinematic there is nothing behind it
 * but the page's black, so the void reads exactly as before.
 */
export function CanvasWrapper({ children }: CanvasWrapperProps) {
  return (
    <Canvas
      dpr={SCENE_CONFIG.dpr}
      camera={{
        fov: SCENE_CONFIG.camera.fov,
        near: SCENE_CONFIG.camera.near,
        far: SCENE_CONFIG.camera.far,
        position: SCENE_CONFIG.camera.position,
      }}
      className="canvas-layer h-full w-full"
      gl={{
        antialias: true,
        alpha: true,
        premultipliedAlpha: false,
        powerPreference: "high-performance",
      }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
      }}
      flat={false}
    >
      {children}
    </Canvas>
  );
}
