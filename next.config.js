/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },

  typescript: {
    //TO DO: need to fix this
    ignoreBuildErrors: true,
  },

  env: {
    STRIPE_PUBLIC_KEY: process.env.STRIPE_PUBLIC_KEY,
  },
};

module.exports = nextConfig;
