/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ["en-US"],
    defaultLocale: "en-US"
  },
  async rewrites() {
    return [
      {
        source: "/:username",
        destination: "/creator/:username"
      }
    ]
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
