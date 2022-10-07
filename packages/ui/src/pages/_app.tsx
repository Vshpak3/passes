import "react-toastify/dist/ReactToastify.css"
import "src/styles/global/main.css"

import * as snippet from "@segment/snippet"
import debounce from "lodash.debounce"
import ms from "ms"
import { AppProps } from "next/app"
import Router from "next/router"
import Script from "next/script"
import nprogress from "nprogress"
import { FC, useEffect, useState } from "react"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { ToastContainer } from "react-toastify"
import { DefaultHead } from "src/components/atoms"
import { refreshAccessToken } from "src/helpers/token"
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

// Try to refresh the access token every this many minutes
const CHECK_FOR_AUTH_REFRESH = ms("5 minutes")

// Only show nprogress after this many milliseconds (slow loading)
const LOADING_DEBOUNCE_TIME = 500
const start = debounce(nprogress.start, LOADING_DEBOUNCE_TIME)
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

// Refreshes auth token
function refreshAuth(): void {
  refreshAccessToken()
    // eslint-disable-next-line no-console
    .then((r) => r && console.log("Access token was refreshed"))
    .catch(() => null)
}

// Refresh access token on route change (TODO: consider removing this)
Router.events.on("routeChangeStart", async () => {
  refreshAuth()
})

const App: FC<AppProps> = ({ Component, pageProps }) => {
  const [refresh, setRefresh] = useState(0)

  // Refresh once on page load then repeatedly
  useEffect(() => {
    refreshAuth()

    const interval = setInterval(async () => {
      refreshAuth()
      setRefresh(refresh + 1)
    }, CHECK_FOR_AUTH_REFRESH)

    return () => clearInterval(interval)
  }, [refresh])

  useMessageToDevelopers([
    "Hey developers! We're hiring: https://jobs.lever.co/Passes",
    "Have an awesome day :-)"
  ])

  return (
    <Providers Component={Component} pageProps={pageProps}>
      <DefaultHead />
      <Script
        dangerouslySetInnerHTML={{
          __html: snippet.min({
            apiKey: process.env.NEXT_PUBLIC_SEGMENT_WRITE_KEY
          })
        }}
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
