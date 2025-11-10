const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "rdf-canonize-native": path.resolve(
        __dirname,
        "src/shims/rdf-canonize-native.js"
      ),
    };

    if (!isServer) {
      config.resolve.fallback = {
        ...(config.resolve.fallback || {}),
        fs: false,
        crypto: false,
        stream: false,
        path: false,
      };
    }

    return config;
  },
  // async rewrites() {
  //   return [
  //     {
  //       source: "/cloud-agent/:path*",
  //       destination: "http://localhost:8085/:path*",
  //     },
  //     {
  //       source: "/didcomm",
  //       destination: "http://localhost:8090",
  //     },
  //   ];
  // },
};

module.exports = nextConfig;
