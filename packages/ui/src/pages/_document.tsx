import NextDocument, { Head, Html, Main, NextScript } from "next/document"

class Document extends NextDocument {
  render() {
    return (
      <Html>
        <Head>
          <meta
            content="width=device-width, initial-scale=1.0"
            name="viewport"
          />
        </Head>
        <body style={{ overscrollBehaviorY: "none" }}>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default Document // no WithNormalPageLayout
