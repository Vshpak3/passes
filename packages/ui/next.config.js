/** @type {import('next').NextConfig} */

const env = process.env.NEXT_PUBLIC_NODE_ENV

// Prevent cross-site scripting (XSS), clickjacking and other code injection
// attacks. Content Security Policy (CSP) can specify allowed origins for
// content including scripts, stylesheets, images, fonts, objects, media
// (audio, video), iframes, and more.
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self';
  child-src ${process.env.NEXT_PUBLIC_UI_BASE_URL};
  style-src 'self' ${process.env.NEXT_PUBLIC_UI_BASE_URL};
  font-src 'self';
`

// https://nextjs.org/docs/advanced-features/security-headers
const securityHeaders = [
  // This header prevents the browser from attempting to guess the type of
  // content if the Content-Type header is not explicitly set. This can prevent
  // XSS exploits for websites that allow users to upload and share files.
  {
    key: "X-Content-Type-Options",
    value: "nosniff"
  },

  // This header indicates whether the site should be allowed to be displayed
  // within an iframe. This can prevent against clickjacking attacks.
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN"
  }

  // Prevent cross-site scripting (XSS), clickjacking and other code injection attacks.
  // https://buildmoment.atlassian.net/browse/PASS-604
  // {
  //   key: "Content-Security-Policy",
  //   value: ContentSecurityPolicy.replace(/\s{2,}/g, " ").trim()
  // }
]

const nextConfig = {
  images: {
    domains: [
      process.env.NEXT_PUBLIC_CDN_URL,
      "localhost",
      "upload.wikimedia.org"
    ]
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
  },
  async headers() {
    if (env === "prod" || env === "stage") {
      return [
        {
          // Apply the security headers to all routes in the application
          source: "/:path*",
          headers: securityHeaders
        }
      ]
    }

    return []
  }
}

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true"
})

module.exports = withBundleAnalyzer(nextConfig)
