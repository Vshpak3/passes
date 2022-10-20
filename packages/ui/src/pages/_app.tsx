import "react-toastify/dist/ReactToastify.css"
import "src/styles/global/main.css"

import { PostDto } from "@passes/api-client"
import * as snippet from "@segment/snippet"
import debounce from "lodash.debounce"
import ms from "ms"
import { NextPage } from "next"
import { AppProps } from "next/app"
import Router, { useRouter } from "next/router"
import Script from "next/script"
import nprogress from "nprogress"
import { ReactElement, ReactNode, useEffect, useRef, useState } from "react"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { ToastContainer } from "react-toastify"
import { DefaultHead } from "src/components/atoms/Head"
import { BlockModal } from "src/components/organisms/BlockModal"
import { BuyPostModal } from "src/components/organisms/payment/BuyPostModal"
import { ViewPostModal } from "src/components/organisms/profile/post/ViewPostModal"
import { ReportModal } from "src/components/organisms/ReportModal"
import { BlockModalContext, BlockModalData } from "src/contexts/BlockModal"
import { BuyPostModalContext } from "src/contexts/BuyPostModal"
import { ReportModalContext, ReportModalData } from "src/contexts/ReportModal"
import { ViewPostModalContext } from "src/contexts/ViewPostModal"
import { refreshAccessToken } from "src/helpers/token"
import { useMessageToDevelopers } from "src/hooks/useMessageToDevelopers"
import { useUser } from "src/hooks/useUser"
import { Providers } from "src/providers"
import { SWRConfig, SWRConfiguration } from "swr"

export const swrConfig: SWRConfiguration = {
  // enable or disable automatic revalidation when component is mounted
  revalidateOnMount: false,

  // automatically revalidate when window gets focused
  revalidateOnFocus: false,

  // only revalidate once during a time span in milliseconds
  focusThrottleInterval: 10000,

  // polling when the window is invisible
  refreshWhenHidden: false,

  // polling when the browser is offline
  refreshWhenOffline: false,

  // automatically revalidate when the browser regains a network connection
  revalidateOnReconnect: false,

  revalidateIfStale: false
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

export type NextPageWithLayout<P = Record<string, unknown>, IP = P> = NextPage<
  P,
  IP
> & {
  getLayout?: (page: ReactElement, hasRefreshed: boolean) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

const App = ({ Component, pageProps }: AppPropsWithLayout) => {
  const [refresh, setRefresh] = useState(0)
  const [hasRefreshed, setHasRefreshed] = useState(false)
  const [viewPost, setViewPost] = useState<PostDto | null>(null)
  const viewPostActiveIndex = useRef(null)
  const [buyPost, setBuyPost] = useState<PostDto | null>(null)

  const [isReportModalOpen, setIsReportModalOpen] = useState(false)
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false)
  const [reportModalData, setReportModalData] =
    useState<ReportModalData | null>(null)
  const [blockModalData, setBlockModalData] = useState<BlockModalData | null>(
    null
  )

  const router = useRouter()
  const { setAccessToken, mutate } = useUser()

  // Refresh once on page load then repeatedly
  useEffect(() => {
    const refreshAuth = async () => {
      await refreshAccessToken()
        .then((r) => {
          if (r) {
            setAccessToken(r)
          }
          return r
        })
        .catch(() => undefined)

      setHasRefreshed(true)
    }

    refreshAuth()
    const interval = setInterval(async () => {
      refreshAuth()
      setRefresh(refresh + 1)
    }, CHECK_FOR_AUTH_REFRESH)

    return () => clearInterval(interval)
  }, [refresh, router, setAccessToken])

  useMessageToDevelopers([
    "Hey developers! We're hiring: https://jobs.lever.co/Passes",
    "Have an awesome day :-)"
  ])

  useEffect(() => {
    mutate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setAccessToken])

  const getLayout = Component.getLayout ?? ((page) => page)
  return getLayout(
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
          <ViewPostModalContext.Provider
            value={{
              setPost: setViewPost,
              viewPostActiveIndex
            }}
          >
            <ReportModalContext.Provider
              value={{ setIsReportModalOpen, setReportModalData }}
            >
              <BlockModalContext.Provider
                value={{ setIsBlockModalOpen, setBlockModalData }}
              >
                <BuyPostModalContext.Provider value={{ setPost: setBuyPost }}>
                  <Component {...pageProps} />
                  {viewPost && (
                    <ViewPostModal post={viewPost} setPost={setViewPost} />
                  )}
                  {buyPost && (
                    <BuyPostModal post={buyPost} setPost={setBuyPost} />
                  )}
                  {isReportModalOpen && (
                    <ReportModal
                      isOpen={isReportModalOpen}
                      setOpen={setIsReportModalOpen}
                      username={reportModalData?.username || ""}
                      userId={reportModalData?.userId || ""}
                    />
                  )}
                  {isBlockModalOpen && (
                    <BlockModal
                      isOpen={isBlockModalOpen}
                      setOpen={setIsBlockModalOpen}
                      username={blockModalData?.username || ""}
                      userId={blockModalData?.userId || ""}
                    />
                  )}
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
                </BuyPostModalContext.Provider>
              </BlockModalContext.Provider>
            </ReportModalContext.Provider>
          </ViewPostModalContext.Provider>
        </DndProvider>
      </SWRConfig>
    </Providers>,
    hasRefreshed
  )
}

export default App // no WithNormalPageLayout
