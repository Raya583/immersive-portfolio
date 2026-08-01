"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";
import { STORY } from "@/config/story";

interface StoryState {
  step: number;
  advance: () => void;
  isLast: boolean;
  canAdvance: boolean;
}

const StoryContext = createContext<StoryState | null>(null);

export function StoryProvider({ children }: { children: ReactNode }) {
  const [step, setStep] = useState(0);

  const advance = useCallback(() => {
    setStep((s) => Math.min(s + 1, STORY.length - 1));
  }, []);

  const value = useMemo<StoryState>(
    () => ({
      step,
      advance,
      isLast: step >= STORY.length - 1,
      canAdvance: step < STORY.length - 1,
    }),
    [step, advance],
  );

  return <StoryContext.Provider value={value}>{children}</StoryContext.Provider>;
}

export function useStory(): StoryState {
  const ctx = useContext(StoryContext);
  if (!ctx) throw new Error("useStory must be used within <StoryProvider>");
  return ctx;
}
