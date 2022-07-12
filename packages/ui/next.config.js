/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ["en-US"],
    defaultLocale: "en-US"
  },
  experimental: {
    externalDir: true
  },
  webpack(config) {
    // needed to use inline svg in JSX/TSX
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"]
    })

    return config
  },
  async redirects() {
    return [
      {
        source: "/@:username",
        destination: "/:username",
        permanent: true
      }
    ]
  }
}

module.exports = nextConfig
