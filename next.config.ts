/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  assetPrefix: process.env.NODE_ENV === "production" ? "/." : "",
  trailingSlash: true,
  // output: "export", // Ensures the app is exportable as static files
  distDir: "build", // Output folder for the build

  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: process.env.NODE_ENV === "production",
  },
};

export default nextConfig;
