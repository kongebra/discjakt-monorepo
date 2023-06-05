const { PrismaPlugin } = require('@prisma/nextjs-monorepo-workaround-plugin');

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
        protocol: 'https',
        hostname: 'new.sunesport.com',
      },
      {
        protocol: 'https',
        hostname: 'new.sunesport.no',
      },
      {
        protocol: 'https',
        hostname: 'wearediscgolf.no',
      },
      {
        protocol: 'http',
        hostname: 'cdn.shopify.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
      },
      {
        protocol: 'https',
        hostname: '*.mycdn.no',
      },
      {
        protocol: 'https',
        hostname: 'aceshop.no',
      },
      {
        protocol: 'https',
        hostname: 'sendeskive.no',
      },
      {
        protocol: 'https',
        hostname: 'www.krokholdgs.no',
      },
      {
        protocol: 'https',
        hostname: '*.dgshop.no',
      },
      {
        protocol: 'https',
        hostname: 'static.wixstatic.com',
      },
      {
        protocol: 'https',
        hostname: 'usercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'usercontent.one',
      },
      {
        protocol: 'http',
        hostname: 'discshopen.no',
      },
      {
        protocol: 'https',
        hostname: 'discshopen.no',
      },
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com',
      },
    ],
  },
};

module.exports = nextConfig;
