// Ambient void particle field — fragment stage.
// Soft radial glow per point, palette mix, cursor brightening, and a global
// star-fade driven by the creation sequence (stars dissolve as day arrives).

precision mediump float;

uniform vec3 uColorCool;
uniform vec3 uColorWarm;
uniform float uStarFade;   // 1 = full stars, 0 = faded (daytime)

varying float vShimmer;
varying float vColorMix;
varying float vPointer;

void main() {
  vec2 uv = gl_PointCoord - 0.5;
  float dist = length(uv);

  float alpha = smoothstep(0.5, 0.0, dist);
  alpha *= alpha;

  float mixAmount = clamp(vColorMix + vPointer * 0.5, 0.0, 1.0);
  vec3 color = mix(uColorCool, uColorWarm, mixAmount);

  float brightness = vShimmer + vPointer * 0.8;
  color *= brightness;

  gl_FragColor = vec4(color, alpha * brightness * uStarFade);
}
