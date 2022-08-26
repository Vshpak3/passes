import "src/styles/global/main.css"

import * as snippet from "@segment/snippet"
// import "../components/messages/MomentMessage.scss"
import debounce from "lodash.debounce"
import Router from "next/router"
import Script from "next/script"
import nprogress from "nprogress"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { DefaultHead } from "src/components/atoms"
import { useMessageToDevelopers } from "src/hooks"
import Providers from "src/providers"

// Only show nprogress after 500ms (slow loading)
const start = debounce(nprogress.start, 500)
Router.events.on("routeChangeStart", start)
Router.events.on("routeChangeComplete", () => {
  start.cancel()
  nprogress.done()
  window.scrollTo(0, 0)
})
Router.events.on("routeChangeError", () => {
  start.cancel()
  nprogress.done()
})

const App = ({ Component, pageProps }) => {
  useMessageToDevelopers([
    "Hey developers! We're hiring: https://jobs.lever.co/Passes",
    "Have an awesome day :-)"
  ])

  const loadSegment = () => {
    return snippet.min({
      apiKey: process.env.NEXT_PUBLIC_SEGMENT_WRITE_KEY
    })
  }

  return (
    <Providers Component={Component} pageProps={pageProps}>
      <DefaultHead />
      <Script
        dangerouslySetInnerHTML={{ __html: loadSegment() }}
        id="segmentScript"
      />
      <DndProvider backend={HTML5Backend}>
        <Component {...pageProps} />
      </DndProvider>
    </Providers>
  )
}

export default App
