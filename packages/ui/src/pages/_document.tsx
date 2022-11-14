import NextDocument, { Head, Html, Main, NextScript } from "next/document"

class Document extends NextDocument {
  render() {
    return (
      <Html>
        <Head />
        <body id="toast-root" style={{ overscrollBehaviorY: "none" }}>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default Document // no WithNormalPageLayout
