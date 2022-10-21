import "react-toastify/dist/ReactToastify.css"
import "src/styles/global/main.css"

import { PassDto, PostDto } from "@passes/api-client"
import * as snippet from "@segment/snippet"
import debounce from "lodash.debounce"
import { NextPage } from "next"
import { AppProps } from "next/app"
import Router from "next/router"
import Script from "next/script"
import { ThemeProvider as NextThemeProvider } from "next-themes"
import nprogress from "nprogress"
import { ReactElement, ReactNode, useEffect, useRef, useState } from "react"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { ToastContainer } from "react-toastify"
import { DefaultHead } from "src/components/atoms/Head"
import { BlockModal } from "src/components/organisms/BlockModal"
import { BuyPassModal } from "src/components/organisms/payment/BuyPassModal"
import { BuyPostModal } from "src/components/organisms/payment/BuyPostModal"
import { ViewPostModal } from "src/components/organisms/profile/post/ViewPostModal"
import { ReportModal } from "src/components/organisms/ReportModal"
import { BlockModalContext, BlockModalData } from "src/contexts/BlockModal"
import { BuyPassModalContext } from "src/contexts/BuyPassModal"
import { BuyPostModalContext } from "src/contexts/BuyPostModal"
import { GlobalCacheContext } from "src/contexts/GlobalCache"
import { ReportModalContext, ReportModalData } from "src/contexts/ReportModal"
import { ViewPostModalContext } from "src/contexts/ViewPostModal"
import { useMessageToDevelopers } from "src/hooks/useMessageToDevelopers"
import { useTokenRefresh } from "src/hooks/useTokenRefresh"
import { useUser } from "src/hooks/useUser"
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

type SubAppProps = {
  Component: NextPageWithLayout
  pageProps: any
}

const SubApp = ({ Component, pageProps }: SubAppProps) => {
  const [viewPost, setViewPost] = useState<PostDto | null>(null)
  const viewPostActiveIndex = useRef(null)
  const [buyPost, setBuyPost] = useState<PostDto | null>(null)
  const [buyPass, setBuyPass] = useState<PassDto | null>(null)

  const [isReportModalOpen, setIsReportModalOpen] = useState(false)
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false)
  const [reportModalData, setReportModalData] =
    useState<ReportModalData | null>(null)
  const [blockModalData, setBlockModalData] = useState<BlockModalData | null>(
    null
  )

  return (
    <GlobalCacheContext.Provider value={{ usernames: {} }}>
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
              <BuyPassModalContext.Provider value={{ setPass: setBuyPass }}>
                <Component {...pageProps} />
                {viewPost && (
                  <ViewPostModal post={viewPost} setPost={setViewPost} />
                )}
                {buyPost && (
                  <BuyPostModal post={buyPost} setPost={setBuyPost} />
                )}
                {buyPass && (
                  <BuyPassModal pass={buyPass} setPass={setBuyPass} />
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
              </BuyPassModalContext.Provider>
            </BuyPostModalContext.Provider>
          </BlockModalContext.Provider>
        </ReportModalContext.Provider>
      </ViewPostModalContext.Provider>
    </GlobalCacheContext.Provider>
  )
}

const App = ({ Component, pageProps }: AppPropsWithLayout) => {
  const { hasRefreshed } = useTokenRefresh()
  const { setAccessToken, mutate } = useUser()
  // Refresh once on page load then repeatedly
  useEffect(() => {
    mutate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setAccessToken])
  const getLayout = Component.getLayout ?? ((page) => page)
  useMessageToDevelopers([
    "Hey developers! We're hiring: https://jobs.lever.co/Passes",
    "Have an awesome day :-)"
  ])
  return getLayout(
    <NextThemeProvider attribute="class" disableTransitionOnChange>
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
          <SubApp Component={Component} pageProps={pageProps} />
        </DndProvider>
      </SWRConfig>
    </NextThemeProvider>,
    hasRefreshed
  )
}

export default App
