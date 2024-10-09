/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: { ignoreBuildErrors: true },
  images: {
    domains: ["res.cloudinary.com"],
  },
  experimental: {
    turbo: {
      resolveAlias: {
        canvas: { browser: "./empty.js" },
      },
    },
  },
};

module.exports = nextConfig;
