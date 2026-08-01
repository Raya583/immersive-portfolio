"use client";

import { CanvasWrapper } from "@/components/three/CanvasWrapper";
import { Experience } from "@/components/three/Experience";
import { Narration } from "@/components/layout/Narration";
import { StoryProvider, useStory } from "@/hooks/storyContext";

/**
 * Composition root. StoryProvider wraps both layers; the current step is read
 * outside the canvas and passed into <Experience> as a prop (context doesn't
 * cross the R3F canvas boundary, props do).
 */
function SceneInner() {
  const { step } = useStory();
  return (
    <>
      <CanvasWrapper>
        <Experience step={step} />
      </CanvasWrapper>
      <Narration />
    </>
  );
}

export function Scene() {
  return (
    <StoryProvider>
      <SceneInner />
    </StoryProvider>
  );
}
