/** @type {import('next').NextConfig} */

const ContentSecurityPolicy = [
  // Default is just self
  `default-src 'self';`,
  // Allows connections to https or wss on all domains
  `connect-src 'self' https: wss:;`,
  // Allows fonts to be loaded from embedded data; TODO: remove google font
  `font-src 'self' data: fonts.gstatic.com;`,
  // Allows images to be loaded from embedded data, blobs (for upload), and the CDN
  `img-src 'self' blob: data: ${process.env.NEXT_PUBLIC_CDN_URL};`,
  // Allows videos to be loaded from blobs (for upload) and the CDN
  `media-src 'self' blob: ${process.env.NEXT_PUBLIC_CDN_URL};`,
  // TODO: figure this out
  `script-src 'self' 'unsafe-eval' 'unsafe-inline' cdn.segment.com;`,
  // Must allow for unsafe-inline because of Tailwind; TODO: remove google font
  `style-src 'self' 'unsafe-inline' fonts.googleapis.com;`
]
// Adjust the CSP in dev
if (process.env.NEXT_PUBLIC_NODE_ENV === "dev") {
  for (var i = 0; i < ContentSecurityPolicy.length; i++) {
    ContentSecurityPolicy[i] = ContentSecurityPolicy[i]
      .replace("https", "http")
      .replace("wss", "ws")
      .replace("/passes", "")
  }
}

// Security headers (docs at https://nextjs.org/docs/advanced-features/security-headers)
// The following headers are not considered standard / best practice:
//  - X-DNS-Prefetch-Control (https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-DNS-Prefetch-Control)
//  - X-XSS-Protection No longer best practice (https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-XSS-Protection)
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
  },

  // This header informs browsers it should only be accessed using HTTPS,
  // instead of using HTTP. Using the configuration below, all present and
  // future subdomains will use HTTPS for a max-age of 2 years. This blocks
  // access to pages or subdomains that can only be served over HTTP.
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload"
  },

  // This header controls how much information the browser includes when
  // navigating from the current website (origin) to another.
  {
    key: "Referrer-Policy",
    value: "origin-when-cross-origin"
  },

  // Prevent cross-site scripting (XSS), clickjacking, and other code injection
  // attacks. Content Security Policy (CSP) can specify allowed origins for
  // content including scripts, stylesheets, images, fonts, objects, media
  // (audio, video), iframes, and more.
  {
    key: "Content-Security-Policy",
    value: ContentSecurityPolicy.join(" ")
  }
]

const nextConfig = {
  images: {
    domains: [process.env.NEXT_PUBLIC_CDN_URL, "localhost"]
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
    return [
      {
        // Apply the security headers to all routes in the application
        source: "/:path*",
        headers: securityHeaders
      }
    ]
  }
}

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true"
})

module.exports = withBundleAnalyzer(nextConfig)
