// Full-screen quad — vertex stage. Shared by the sky backdrop and the sky burst.
// The quad is written straight to clip space, so it always covers the viewport
// no matter where the camera is or what it is looking at.
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
