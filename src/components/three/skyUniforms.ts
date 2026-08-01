import { Color, Vector2, type ShaderMaterial } from "three";
import { SKY_CONFIG } from "@/config/sky";

/**
 * Initial uniform values for the shared sky gradient (shaders/skyGradient.glsl).
 * Both the sky backdrop and the sky burst build their uniform block from this,
 * which is what guarantees the burst reveals exactly the sky behind it.
 *
 * ⚠️ These are the values the material STARTS with, and nothing more.
 * React Three Fiber CLONES the object passed to the `uniforms` prop when it
 * applies it, so the object you get back here is NOT the one the material ends
 * up holding — mutating it has no effect on what is rendered (which is exactly
 * how the sky ended up stuck at uDay = 0, i.e. black). Anything that changes
 * per frame has to be written through the material itself:
 *
 *     matRef.current.uniforms.uDay.value = ...
 *
 * setSkyUniform() below does that safely.
 */
export function createSkyUniforms() {
  const { gradient, sun } = SKY_CONFIG;
  return {
    uSkyTop: { value: new Color(gradient.top) },
    uSkyMid: { value: new Color(gradient.mid) },
    uSkyHorizon: { value: new Color(gradient.horizon) },
    uSkyBottom: { value: new Color(gradient.bottom) },
    uHorizonStop: { value: gradient.horizonStop },
    uMidStop: { value: gradient.midStop },
    uSunPos: { value: new Vector2(sun.screenPos[0], sun.screenPos[1]) },
    uSunGlowColor: { value: new Color(sun.glowColor) },
    uSunGlow: { value: sun.glow },
    uSunRadius: { value: sun.glowRadius },
    uAspect: { value: 1 },
  };
}

/** Write one numeric uniform through the live material. No-op if not ready. */
export function setSkyUniform(
  material: ShaderMaterial | null,
  name: string,
  value: number,
): void {
  const uniform = material?.uniforms?.[name];
  if (uniform) uniform.value = value;
}
