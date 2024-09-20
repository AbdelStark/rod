/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  transpilePackages: ["@repo/ui"],
  images: {
    // loader: 'custom', // Set loader to custom
    domains: [
      "avatars.githubusercontent.com"
    ], // Leave this empty, custom loader will handle all domains
  },
};
