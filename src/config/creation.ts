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
   * Kept for reference only. The canvas is cleared transparent now and the sky
   * comes from map-bg.png behind it (config/backdrop.ts), so nothing reads this.
   */
  skyColor: string;
  /** Warm dusk haze on the islands, matched to map-bg.png's pink horizon. */
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
  skyFogColor: "#f0b49e",
  skyFogNear: 45,
  skyFogFar: 200,
} as const;

export const DAY_EASE_SECONDS = 3.0;
