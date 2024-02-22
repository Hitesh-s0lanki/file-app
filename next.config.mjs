/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "charming-puffin-943.convex.cloud",
      },
    ],
  },
};

export default nextConfig;
