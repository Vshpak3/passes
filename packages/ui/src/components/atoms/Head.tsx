import NextHead from "next/head"
import { useRouter } from "next/router"

const TITLE = "Passes"
const DESCRIPTION =
  "A platform for creators to scale their content and own their audiences."
const CLIENT_URL = process.env.NEXT_PUBLIC_UI_BASE_URL

export const DefaultHead = () => {
  const router = useRouter()

  return (
    <NextHead>
      <title key="title">{TITLE}</title>
      <meta content={DESCRIPTION} key="description" name="description" />
      <meta content={TITLE} key="application-name" name="application-name" />
      <meta
        content={TITLE}
        key="apple-mobile-web-app-title"
        name="apple-mobile-web-app-title"
      />
      <meta content={TITLE} key="twitter-title" name="twitter:title" />
      <meta
        content={DESCRIPTION}
        key="twitter-description"
        name="twitter:description"
      />
      <meta
        content="summary_large_image"
        key="twitter-card"
        name="twitter:card"
      />
      <meta
        content={`${CLIENT_URL}/other/open-graph/og-image-300x300.png`}
        key="twitter-image"
        property="twitter:image"
      />
      <meta
        content="Passes wordmark"
        key="twitter-image-alt"
        property="twitter:image:alt"
      />
      <meta content={TITLE} key="og-title" property="og:title" />
      <meta content={TITLE} key="og-site-name" property="og:site_name" />
      <meta content="website" key="og-type" property="og:type" />
      <meta content={router.locale} key="og-locale" property="og:locale" />
      <meta
        content={`${CLIENT_URL}${router.asPath}`}
        key="og-url"
        property="og:url"
      />
      <meta
        content={DESCRIPTION}
        key="og-description"
        property="og:description"
      />
      <meta
        content={`${CLIENT_URL}/other/open-graph/og-image-300x300.png`}
        key="og-image"
        property="og:image"
      />
      <meta
        content="Passes wordmark"
        key="og-image-alt"
        property="og:image:alt"
      />
      <meta
        content="minimum-scale=1.0, initial-scale=1.0, maximum-scale=1.0, user-scalable=0, width=device-width, viewport-fit=cover"
        key="viewport"
        name="viewport"
      />
      <meta content="follow, index" key="robots" name="robots" />
      <meta content="follow, index" key="googlebot" name="googlebot" />
      <meta content="#000000" key="theme-color" name="theme-color" />
      <meta
        content={`${CLIENT_URL}/browserconfig.xml`}
        key="msapplication-config"
        name="msapplication-config"
      />

      <link href={CLIENT_URL} key="canonical" rel="canonical" />
      <link
        href="/other/favicon/favicon.ico"
        key="favicon"
        rel="shortcut icon"
        sizes="any"
      />
      <link
        href="/other/favicon/favicon-32x32.png"
        key="favicon-32"
        rel="icon"
        sizes="32x32"
        type="image/png"
      />
      <link
        href="/other/favicon/favicon-16x16.png"
        key="favicon-16"
        rel="icon"
        sizes="16x16"
        type="image/png"
      />
    </NextHead>
  )
}
