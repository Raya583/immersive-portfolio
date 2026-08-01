// Distant cloud plane — vertex stage. Nothing clever: the planes lie flat far
// below the islands, so they need no billboarding.
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
