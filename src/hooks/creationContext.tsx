"use client";

import { createContext, useContext } from "react";
import type { ReactNode } from "react";

/**
 * Shares the current STORY step index into the 3D scene. Each visual component
 * eases its own value toward that step's targets, so beats stay in sync while
 * each can have its own easing feel.
 */
const CreationStepContext = createContext<number>(0);

export function CreationStepProvider({
  step,
  children,
}: {
  step: number;
  children: ReactNode;
}) {
  return (
    <CreationStepContext.Provider value={step}>
      {children}
    </CreationStepContext.Provider>
  );
}

export function useCreationStep(): number {
  return useContext(CreationStepContext);
}
