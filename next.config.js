/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: { ignoreBuildErrors: true },
  images: {
    domains: ["res.cloudinary.com"],
  },
  webpack(config) {
    config.externals.push("canvas");
    return config;
  },
};

module.exports = nextConfig;
