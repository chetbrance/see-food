import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: [],
  },
  experimental: {
    turbo: {
      loaders: {},
    },
  },
};

export default nextConfig;
