import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  turbopack: {
    root: __dirname
  },
  async rewrites() {
    return [{ source: "/api/:path*", destination: `${process.env.NEXT_PUBLIC_API_URL || "http://backend:8000"}/:path*` }];
  }
};

export default nextConfig;
