import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: false,
  },
  turbopack: {
    // Explicitly set the root to avoid Turbopack scanning parent directories (like user home)
    root: process.cwd(),
  },
};

export default nextConfig;
