// Ambient void particle field — fragment stage.
// Renders each point as a soft radial glow (not a hard square) and mixes
// between the cool and warm palette colors per particle. Particles near the
// cursor brighten and warm slightly, so the void "wakes" where you touch it.

precision mediump float;

uniform vec3 uColorCool;
uniform vec3 uColorWarm;

varying float vShimmer;
varying float vColorMix;
varying float vPointer;   // 0..1 cursor influence from the vertex stage

void main() {
  vec2 uv = gl_PointCoord - 0.5;
  float dist = length(uv);

  float alpha = smoothstep(0.5, 0.0, dist);
  alpha *= alpha;

  // Base color, warmed toward the highlight when near the cursor.
  float mixAmount = clamp(vColorMix + vPointer * 0.5, 0.0, 1.0);
  vec3 color = mix(uColorCool, uColorWarm, mixAmount);

  // Shimmer drives brightness; cursor influence adds an extra glow.
  float brightness = vShimmer + vPointer * 0.8;
  color *= brightness;

  gl_FragColor = vec4(color, alpha * brightness);
}
