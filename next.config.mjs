/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // three ships untranspiled ESM; make sure Next compiles it.
  transpilePackages: ["three"],
};

export default nextConfig;
