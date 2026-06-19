import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        // PocketBase local development server
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8090",
        pathname: "/api/files/**",
      },
      {
        // Production PocketBase (update when deployed)
        protocol: "https",
        hostname: "**.pockethost.io",
        pathname: "/**",
      },
      {
        // Allow all localhost for development flexibility
        protocol: "http",
        hostname: "localhost",
        port: "8090",
        pathname: "/api/files/**",
      },
    ],
    // For fallback/placeholder images
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; img-src 'self' data: blob:;",
  },
};

export default nextConfig;
