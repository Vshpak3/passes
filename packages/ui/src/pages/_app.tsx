import "src/styles/global/main.css"
import "react-toastify/dist/ReactToastify.css"

import * as snippet from "@segment/snippet"
import debounce from "lodash.debounce"
import { AppProps } from "next/app"
import Router from "next/router"
import Script from "next/script"
import nprogress from "nprogress"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { ToastContainer } from "react-toastify"
import { DefaultHead } from "src/components/atoms"
import { useMessageToDevelopers } from "src/hooks"
import Providers from "src/providers"
import { SWRConfig, SWRConfiguration } from "swr"

const swrConfig: SWRConfiguration = {
  // enable or disable automatic revalidation when component is mounted
  revalidateOnMount: true,

  // automatically revalidate when window gets focused
  revalidateOnFocus: true,

  // only revalidate once during a time span in milliseconds
  focusThrottleInterval: 10000,

  // polling when the window is invisible
  refreshWhenHidden: false,

  // polling when the browser is offline
  refreshWhenOffline: false,

  // automatically revalidate when the browser regains a network connection
  revalidateOnReconnect: false
}

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

const App = ({ Component, pageProps }: AppProps) => {
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
      <SWRConfig value={swrConfig}>
        <DndProvider backend={HTML5Backend}>
          <Component {...pageProps} />
          <ToastContainer
            position="bottom-center"
            autoClose={5000}
            hideProgressBar={true}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable={false}
            pauseOnHover
            limit={3}
            theme="colored"
          />
        </DndProvider>{" "}
      </SWRConfig>
    </Providers>
  )
}

export default App
