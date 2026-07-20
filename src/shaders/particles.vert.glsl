// Ambient void particle field — vertex stage.
// Each particle gets a stable per-particle random seed (aSeed) so its
// shimmer and size are individual but deterministic. Motion is driving
// brightness/size over time, not moving vertices on the CPU.
//
// Cursor interaction is computed HERE, per particle, in parallel on the GPU:
// the pointer is a single uniform and each particle responds to it.

uniform float uTime;
uniform float uBaseSize;
uniform float uShimmerSpeed;

uniform vec3 uPointer;        // smoothed cursor position in world space
uniform float uPointerRadius; // radius of influence
uniform float uPointerPush;   // displacement strength
uniform float uPointerGlow;   // brightness/size boost near cursor

attribute float aSeed;      // per-particle random [0,1)
attribute float aSizeMul;   // per-particle size multiplier
attribute float aColorMix;  // per-particle 0=cool .. 1=warm

varying float vShimmer;
varying float vColorMix;
varying float vPointer;     // 0..1 how strongly this particle feels the cursor

void main() {
  vColorMix = aColorMix;

  // Twinkle: a sine offset per particle so they don't pulse in unison.
  float phase = aSeed * 6.2831853; // seed -> radians
  float twinkle = 0.5 + 0.5 * sin(uTime * uShimmerSpeed + phase);
  // Higher baseline brightness so particles stay visible while twinkling.
  vShimmer = 0.6 + 0.4 * twinkle;

  // --- Cursor influence -----------------------------------------------------
  vec3 worldPos = (modelMatrix * vec4(position, 1.0)).xyz;

  vec3 toParticle = worldPos - uPointer;
  float dist = length(toParticle);
  // Smooth falloff: 1 at the cursor, 0 at the edge of the radius.
  float influence = 1.0 - smoothstep(0.0, uPointerRadius, dist);
  vPointer = influence;

  // Push the particle gently outward from the cursor.
  vec3 pushDir = dist > 0.0001 ? normalize(toParticle) : vec3(0.0);
  vec3 displaced = position + pushDir * (influence * uPointerPush);

  vec4 mvPosition = modelViewMatrix * vec4(displaced, 1.0);

  // Size grows near the cursor for a "gathering light" feel.
  float sizeBoost = 1.0 + influence * uPointerGlow;

  // Perspective-correct point size (smaller with distance), modulated by
  // per-particle size, its shimmer, and the cursor boost.
  gl_PointSize = uBaseSize * aSizeMul * vShimmer * sizeBoost * (1.0 / -mvPosition.z);
  gl_Position = projectionMatrix * mvPosition;
}
