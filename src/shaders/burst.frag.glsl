// Full-screen burst — fragment stage. Prepended with skyGradient.glsl.
//
// A circle of daylight expands from center as uBurst goes 0 → 1, with a bright
// glowing ring. What it fills with is the SAME golden-hour gradient the sky
// backdrop draws, sampled along the same view ray — so when uFade drops the
// quad away there is nothing to see: the burst reveals the real sky.

uniform float uBurst;
uniform float uFade;
uniform vec3 uEdgeColor;

varying vec2 vUv;

void main() {
  vec2 p = vUv - 0.5;
  p.x *= uAspect;
  float dist = length(p) / 0.72;

  float radius = uBurst * 1.25;
  float fill = smoothstep(radius, radius - 0.06, dist);

  float ring = smoothstep(0.10, 0.0, abs(dist - radius));
  ring *= smoothstep(1.0, 0.2, uBurst);

  vec3 sky = skyGradient(vUv);
  vec3 color = mix(sky, uEdgeColor, ring * 0.8);

  float alpha = clamp(fill + ring * 0.9, 0.0, 1.0);
  alpha = max(alpha, smoothstep(0.98, 1.0, uBurst));

  gl_FragColor = vec4(color + skyDither(gl_FragCoord.xy), alpha * uFade);
}
