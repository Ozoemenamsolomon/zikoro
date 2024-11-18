/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: { ignoreBuildErrors: true },
  images: {
    domains: ["res.cloudinary.com"],
  },

  webpack: (config, { isServer }) => {
    if (isServer && process.env.NODE_ENV !== "production") {
      config.externals = [
        ...config.externals,
        { canvas: "canvas" }, // Only in development
      ];
    }
    return config;
  },
};

module.exports = nextConfig;
