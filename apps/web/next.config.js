const { PrismaPlugin } = require("@prisma/nextjs-monorepo-workaround-plugin");

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.plugins = [...config.plugins, new PrismaPlugin()];
    }

    return config;
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "new.sunesport.com",
      },
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
      },
      {
        protocol: "https",
        hostname: "*.mycdn.no",
      },
    ],
    // domains: [
    //   "new.sunesport.no",
    //   "cdn.shopify.com",
    //   "frisbeebutikke-i02.mycdn.no",
    // ],
  },
};

module.exports = nextConfig;
