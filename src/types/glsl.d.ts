// GLSL shader files are imported as raw strings via the webpack rule in
// next.config.mjs (asset/source). These declarations make TypeScript aware.
declare module "*.glsl" {
  const content: string;
  export default content;
}
declare module "*.vert" {
  const content: string;
  export default content;
}
declare module "*.frag" {
  const content: string;
  export default content;
}
