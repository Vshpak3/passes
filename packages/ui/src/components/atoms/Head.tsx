import NextHead from "next/head"
import { NextRouter, useRouter } from "next/router"

const TITLE = "Passes"
const DESCRIPTION =
  "A platform for creators to scale their content and own their audiences."
const CLIENT_URL = `https://${process.env.NEXT_PUBLIC_UI_BASE_URL}`

const metaTags = (router: NextRouter) => [
  // Core
  {
    content: TITLE,
    key: "application-name",
    name: "application-name"
  },
  {
    content: DESCRIPTION,
    key: "description",
    name: "description"
  },
  {
    content: [
      "minimum-scale=1.0",
      "initial-scale=1.0",
      "maximum-scale=1.0",
      "user-scalable=0",
      "width=device-width",
      "viewport-fit=cover"
    ].join(" "),
    key: "viewport",
    name: "viewport"
  },

  // Apple
  {
    content: TITLE,
    key: "apple-mobile-web-app-title",
    name: "apple-mobile-web-app-title"
  },

  // Twitter
  {
    content: TITLE,
    key: "twitter-title",
    name: "twitter:title"
  },
  {
    content: DESCRIPTION,
    key: "twitter-description",
    name: "twitter:description"
  },
  {
    content: "summary_large_image",
    key: "twitter-card",
    name: "twitter:card"
  },
  {
    content: `${CLIENT_URL}/other/open-graph/og-image-300x300.png`,
    key: "twitter-image",
    property: "twitter:image"
  },
  {
    content: "Passes wordmark",
    key: "twitter-image-alt",
    property: "twitter:image:alt"
  },

  // Open Graph
  {
    content: TITLE,
    key: "og-title",
    property: "og:title"
  },
  {
    content: TITLE,
    key: "og-site-name",
    property: "og:site_name"
  },
  {
    content: "website",
    key: "og-type",
    property: "og:type"
  },
  {
    content: router.locale,
    key: "og-locale",
    property: "og:lcale"
  },
  {
    content: router.asPath,
    key: "og-url",
    property: "og:url"
  },
  {
    content: DESCRIPTION,
    key: "og-description",
    property: "og:description"
  },
  {
    content: `${CLIENT_URL}/other/open-graph/og-image-300x300.png`,
    key: "og-image",
    property: "og:image"
  },
  {
    content: "Passes wordmark",
    key: "og-image-alt",
    property: "og:image:alt"
  },

  // Misc
  {
    content: "follow, index",
    key: "robots",
    name: "robots"
  },
  {
    content: "follow, index",
    key: "googlebot",
    name: "googlebot"
  },
  {
    content: "#000000",
    key: "theme-color",
    name: "theme-color"
  },
  {
    content: `${CLIENT_URL}/browserconfig.xml`,
    key: "msapplication-config",
    name: "msapplication-config"
  }
]

export const DefaultHead = () => {
  const router = useRouter()

  return (
    <NextHead>
      <title key="title">{TITLE}</title>
      {metaTags(router).map(({ content, key, name, property }) => (
        <meta content={content} key={key} name={name} property={property} />
      ))}
      <link href={router.asPath} key="canonical" rel="canonical" />
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
