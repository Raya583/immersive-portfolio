// Distant cloud — fragment stage.
//
// One big soft blob per plane: fbm value-noise shaped by a threshold, then
// multiplied by a RADIAL FEATHER so the quad's own edges can never show. The
// noise domain drifts with uTime, which reads as the cloud slowly evolving and
// sliding without any geometry ever moving (so nothing needs wrapping).

precision mediump float;

uniform float uTime;
uniform float uOpacity;
uniform float uSeed;
uniform vec3 uWarm;
uniform vec3 uCool;
uniform float uNoiseScale;
uniform float uDrift;
uniform float uCoverage;
uniform float uSoftness;

varying vec2 vUv;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p *= 2.03;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 drift = vec2(uTime * uDrift, uTime * uDrift * 0.35);
  vec2 p = vUv * uNoiseScale + vec2(uSeed * 37.0, uSeed * 91.0) + drift;

  float n = fbm(p);
  // Elliptical feather from the plane's centre — 1 in the middle, 0 well
  // before the edge, so there is never a straight line anywhere.
  float feather = smoothstep(0.5, 0.12, length(vUv - 0.5));
  float density = smoothstep(uCoverage, uCoverage + uSoftness, n) * feather;

  if (density < 0.004) discard;

  vec3 color = mix(uCool, uWarm, density);
  gl_FragColor = vec4(color, density * uOpacity);
}
