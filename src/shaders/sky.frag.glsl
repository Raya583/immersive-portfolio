// The sky backdrop — fragment stage. Prepended with skyGradient.glsl.
//
// Drawn first (renderOrder) with no depth test or write, so it behaves like a
// background the rest of the scene paints over. Opaque on purpose: a
// transparent material would sort into the transparent pass and end up drawn
// OVER the islands. uDay does the fading instead, from the void's black to
// full golden hour.

uniform float uDay;
uniform vec3 uVoidColor;

varying vec2 vUv;

void main() {
  vec3 sky = skyGradient(vUv);
  vec3 col = mix(uVoidColor, sky, uDay);
  gl_FragColor = vec4(col + skyDither(gl_FragCoord.xy), 1.0);
}
