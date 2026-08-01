/**
 * Void ↔ day visual states. The director eases the scene's fog and lighting
 * between these based on the story's `day` value.
 *
 * The DAY side of the mood — sky gradient, sun angle, warm light colours and
 * the clouds — lives in config/sky.ts. What's left here is the void state, the
 * fog either side of the transition, and the background fallback.
 */
export interface CreationConfig {
  voidColor: string;
  voidFogColor: string;
  voidFogNear: number;
  voidFogFar: number;
  voidAmbient: number;
  voidAmbientColor: string;
  voidSunIntensity: number;
  voidSunColor: string;
  /**
   * Clear colour behind the scene. The sky backdrop (SkyDome) covers the frame
   * once day rises, so this is only ever a fallback — keep it near the sky's
   * horizon colour so any sliver of it reads correctly.
   */
  skyColor: string;
  /** Warm dusk haze on the islands. Matches the gradient's horizon amber. */
  skyFogColor: string;
  skyFogNear: number;
  skyFogFar: number;
}

export const CREATION_CONFIG: CreationConfig = {
  voidColor: "#05040a",
  voidFogColor: "#05040a",
  voidFogNear: 6,
  voidFogFar: 26,
  voidAmbient: 0.4,
  voidAmbientColor: "#8a7fb5",
  voidSunIntensity: 1.1,
  voidSunColor: "#e0d4ff",
  skyColor: "#f7b273",
  skyFogColor: "#e9a878",
  skyFogNear: 45,
  skyFogFar: 200,
} as const;

export const DAY_EASE_SECONDS = 3.0;
