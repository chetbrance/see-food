import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: [],
  },
  experimental: {
    turbo: true,
  },
};

export default nextConfig;
