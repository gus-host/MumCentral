import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "maps.gstatic.com",
        port: "",
        pathname: "/mapfiles/**",
        search: "",
      },
    ],
  },
};

export default nextConfig;
