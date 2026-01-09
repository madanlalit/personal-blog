import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Using Vercel's native SSG - no need for `output: 'export'`
  // This allows automatic image optimization and simpler route handling
  trailingSlash: false,
};

export default nextConfig;
