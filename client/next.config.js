/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports = {
  webpack: (nextConfig) => {
    nextConfig.experiments = { topLevelAwait: true };
    return nextConfig;
  },
};