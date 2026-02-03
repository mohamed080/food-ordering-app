import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      // {
      //   protocol: "https",
      //   hostname: "picsum.photos",
      //   pathname: "/**",
      // },
      // {
      //   protocol: "https",
      //   hostname: "next-auth.js.org",
      //   pathname: "/**",
      // }
    ],
  },
};

export default nextConfig;
