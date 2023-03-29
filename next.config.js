/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },

  typescript: {
    //TO DO: need to fix this
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
