/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  assetPrefix: process.env.NODE_ENV === "production" ? "/." : "",
  trailingSlash: true,
  // output: "export",
  distDir: "build",
  eslint: {
    ignoreDuringBuilds: process.env.NODE_ENV === "production",
  },
};

module.exports = nextConfig;
