import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['maps.googleapis.com'],
    // If you need to add more domains in the future, you can add them here:
    // domains: ['maps.googleapis.com', 'other.domain.com'],
  },
};

export default nextConfig;