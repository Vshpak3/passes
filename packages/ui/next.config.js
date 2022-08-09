/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    domains: [process.env.NEXT_PUBLIC_DEMO_BUCKET, "images.dog.ceo"]
  },
  reactStrictMode: false,
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
