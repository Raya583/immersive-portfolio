// Shared golden-hour sky gradient.
//
// This chunk has NO main() — it is prepended in JS to both sky.frag.glsl and
// burst.frag.glsl (see SkyDome.tsx / SkyBurst.tsx) so the burst paints the
// exact same sky that sits behind it, and fading the burst away causes no
// colour pop. Uniform values come from createSkyUniforms() in skyUniforms.ts.
//
// The gradient runs bottom → top of the SCREEN, not along a world direction.
// That is deliberate: the map camera looks almost straight down, so a true
// directional sky would fill the frame with whatever is below the horizon and
// the golden hour would never be seen. Screen-space keeps the warm wash behind
// the islands at every camera angle, like a matte backdrop.

precision mediump float;

uniform vec3 uSkyTop;
uniform vec3 uSkyMid;
uniform vec3 uSkyHorizon;
uniform vec3 uSkyBottom;
uniform float uHorizonStop;
uniform float uMidStop;
uniform vec2 uSunPos;
uniform vec3 uSunGlowColor;
uniform float uSunGlow;
uniform float uSunRadius;
uniform float uAspect;

/** Sky colour at a screen UV (0,0 = bottom-left, 1,1 = top-right). */
vec3 skyGradient(vec2 uv) {
  float y = clamp(uv.y, 0.0, 1.0);

  // Bottom haze → amber horizon band → rose → dusky lavender at the top.
  vec3 col = mix(uSkyBottom, uSkyHorizon, smoothstep(0.0, uHorizonStop, y));
  col = mix(col, uSkyMid, smoothstep(uHorizonStop, uMidStop, y));
  col = mix(col, uSkyTop, smoothstep(uMidStop, 1.0, y));

  // A soft bloom of light where the sun sits, aspect-corrected so it stays
  // round on any viewport.
  vec2 d = uv - uSunPos;
  d.x *= uAspect;
  float halo = 1.0 - smoothstep(0.0, uSunRadius, length(d));
  return col + uSunGlowColor * halo * halo * uSunGlow;
}

/** Per-pixel noise worth ±half a colour step — kills banding on a gradient
    this wide and this smooth, at no meaningful cost. */
float skyDither(vec2 fragCoord) {
  float n = fract(sin(dot(fragCoord, vec2(12.9898, 78.233))) * 43758.5453);
  return (n - 0.5) / 255.0;
}
