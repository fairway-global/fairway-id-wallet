/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  assetPrefix: process.env.NODE_ENV === "production" ? "/." : "",
  trailingSlash: true,
  output: "export", // Ensures the app is exportable as static files
  distDir: "chrome-extension", // Output folder for the build
};

export default nextConfig;
