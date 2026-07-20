import { CanvasWrapper } from "@/components/three/CanvasWrapper";
import { Experience } from "@/components/three/Experience";

/**
 * Composition root for the 3D experience. This stays a server component:
 * it wires the client Canvas together with the scene contents but ships
 * no interactivity of its own. Add lights, models, and effects inside
 * <Experience /> as the portfolio grows.
 */
export function Scene() {
  return (
    <CanvasWrapper>
      <Experience />
    </CanvasWrapper>
  );
}
