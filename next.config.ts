import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath: '/surumebeer',
  assetPrefix: '/surumebeer',
  images: {
    unoptimized: true
  }
};

export default nextConfig;
