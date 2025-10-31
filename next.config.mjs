/** @type {import('next').NextConfig} */
const nextConfig = {
    distDir: 'mando-tool',
    // output: 'export',

    webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
};

export default nextConfig;
