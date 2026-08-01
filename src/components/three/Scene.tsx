"use client";

import { CanvasWrapper } from "@/components/three/CanvasWrapper";
import { Experience } from "@/components/three/Experience";
import { MapBackdrop } from "@/components/layout/MapBackdrop";
import { Narration } from "@/components/layout/Narration";
import { SakuraOverlay } from "@/components/layout/SakuraOverlay";
import { ScrollCurtain } from "@/components/layout/ScrollCurtain";
import { IslandLanding } from "@/components/layout/IslandLanding";
import { StoryProvider, useStory } from "@/hooks/storyContext";
import { SelectionProvider, useSelection } from "@/hooks/selectionContext";

/**
 * Composition root. Both providers wrap both layers; their values are read out
 * here and passed into <Experience> as props (context doesn't cross the R3F
 * canvas boundary, props do — the canvas re-provides them on the inside).
 */
function SceneInner() {
  const { step } = useStory();
  const selection = useSelection();

  return (
    <>
      <MapBackdrop />
      <CanvasWrapper>
        <Experience step={step} selection={selection} />
      </CanvasWrapper>
      <SakuraOverlay />
      <Narration />
      <IslandLanding />
      <ScrollCurtain />
    </>
  );
}

export function Scene() {
  return (
    <StoryProvider>
      <SelectionProvider>
        <SceneInner />
      </SelectionProvider>
    </StoryProvider>
  );
}
