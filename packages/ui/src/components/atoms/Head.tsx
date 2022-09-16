import NextHead from "next/head"
import { useRouter } from "next/router"

const TITLE = "Passes"
const DESCRIPTION =
  "A platform for creators to autonomously scale their content and own their audiences."
const PRODUCTION_URL = "https://passes.com"
const DEVELOPMENT_URL = "http://localhost:3000"
const VERCEL_URL =
  process.env.NEXT_PUBLIC_VERCEL_ENV === "production"
    ? PRODUCTION_URL
    : process.env.NODE_ENV === "development"
    ? DEVELOPMENT_URL
    : `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`

const DefaultHead = () => {
  const router = useRouter()

  return (
    <NextHead>
      <title key="title">{TITLE}</title>
      <meta key="description" name="description" content={DESCRIPTION} />
      <meta key="application-name" name="application-name" content={TITLE} />
      <meta
        key="apple-mobile-web-app-title"
        name="apple-mobile-web-app-title"
        content={TITLE}
      />
      <meta key="twitter-title" name="twitter:title" content={TITLE} />
      <meta
        key="twitter-description"
        name="twitter:description"
        content={DESCRIPTION}
      />
      <meta
        key="twitter-card"
        name="twitter:card"
        content="summary_large_image"
      />
      <meta
        key="twitter-image"
        property="twitter:image"
        content={`${VERCEL_URL}/img/open-graph/og-image-300x300.png`}
      />
      <meta
        key="twitter-image-alt"
        property="twitter:image:alt"
        content="Passes wordmark"
      />
      <meta key="og-title" property="og:title" content={TITLE} />
      <meta key="og-site-name" property="og:site_name" content={TITLE} />
      <meta key="og-type" property="og:type" content="website" />
      <meta key="og-locale" property="og:locale" content={router.locale} />
      <meta
        key="og-url"
        property="og:url"
        content={`${VERCEL_URL}${router.asPath}`}
      />
      <meta
        key="og-description"
        property="og:description"
        content={DESCRIPTION}
      />
      <meta
        key="og-image"
        property="og:image"
        content={`${VERCEL_URL}/img/open-graph/og-image-300x300.png`}
      />
      <meta
        key="og-image-alt"
        property="og:image:alt"
        content="Passes wordmark"
      />
      <meta
        key="viewport"
        name="viewport"
        content="minimum-scale=1.0, initial-scale=1.0, width=device-width, viewport-fit=cover"
      />
      <meta key="robots" name="robots" content="follow, index" />
      <meta key="googlebot" name="googlebot" content="follow, index" />
      <meta key="theme-color" name="theme-color" content="#000000" />
      <meta
        key="msapplication-config"
        name="msapplication-config"
        content={`${VERCEL_URL}/browserconfig.xml`}
      />

      <link
        key="canonical"
        rel="canonical"
        href={`${PRODUCTION_URL}${router.asPath}`}
      />
      <link
        key="favicon"
        rel="shortcut icon"
        sizes="any"
        href="/icons/favicon.ico"
      />
      <link
        key="favicon-32"
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/icons/favicon-32x32.png"
      />
      <link
        key="favicon-16"
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/icons/favicon-16x16.png"
      />
    </NextHead>
  )
}

export default DefaultHead
