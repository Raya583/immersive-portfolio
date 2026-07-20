/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // R3F / three.js ship untranspiled ESM; ensure Next compiles them.
  transpilePackages: ["three"],
  webpack: (config) => {
    // Allow importing GLSL shaders as raw strings when needed later.
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      type: "asset/source",
    });
    return config;
  },
};

export default nextConfig;
