/** @type {import('next').NextConfig} */

import { withSentryConfig } from '@sentry/nextjs'
import nextTranspileModules from 'next-transpile-modules'

const withTM = nextTranspileModules([
  '@moment/auth-utils',
  '@moment/utils',
  '@moment/api-utils',
])

export default withSentryConfig({
  sentry: {
    disableServerWebpackPlugin: true,
    disableClientWebpackPlugin: true,
  },
  ...withTM({
    reactStrictMode: true,
    i18n: {
      locales: ['en-US'],
      defaultLocale: 'en-US',
    },
    rewrites() {
      return [
        {
          source: '/:username',
          destination: '/creator/:username',
        },
      ]
    },
    redirects() {
      return [
        {
          source: '/@:username',
          destination: '/:username',
          permanent: true,
        },
      ]
    },
    experimental: {
      externalDir: false,
      esmExternals: true,
      externals: true,
    },
    webpack: (config) => {
      config.module.rules.push({
        test: /\.svg$/,
        use: [{ loader: '@svgr/webpack', options: { typescript: true } }],
      })

      return config
    },
  }),
})
