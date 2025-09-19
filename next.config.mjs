/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: new URL('.', import.meta.url).pathname, // correct root for Turbopack
  },
  webpack(config) {
    config.resolve.alias['@'] = new URL('.', import.meta.url).pathname; // @ points to project root
    return config;
  },
};

export default nextConfig;
