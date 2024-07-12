/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: { ignoreBuildErrors: true },
  images: {
    domains: ["res.cloudinary.com"],
  },
  swcMinify: true
};

module.exports = nextConfig;
