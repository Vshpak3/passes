import "react-toastify/dist/ReactToastify.css"
import "src/styles/global/main.css"
import { PassDto, PostDto } from "@passes/api-client"
import debounce from "lodash.debounce"
import ms from "ms"
import { NextPage } from "next"
import { AppProps } from "next/app"
import dynamic from "next/dynamic"
import Router, { useRouter } from "next/router"
import Script from "next/script"
import { ThemeProvider as NextThemeProvider } from "next-themes"
import nprogress from "nprogress"
import { Provider, ReactElement, useEffect, useState } from "react"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { toast, ToastContainer } from "react-toastify"
import { SWRConfig } from "swr"

import { DefaultHead } from "src/components/atoms/Head"
import { BlockModalData } from "src/components/organisms/BlockModal"
import { ReportModalData } from "src/components/organisms/ReportModal"
import { SegmentConfig } from "src/config/app/segment"
import { GlobalSWRConfig } from "src/config/app/swr"
import { AppProviders } from "src/contexts/AppProviders"
import { BlockModalContext } from "src/contexts/BlockModal"
import { BuyPassModalContext } from "src/contexts/BuyPassModal"
import { BuyPostModalContext } from "src/contexts/BuyPostModal"
import { GlobalCacheContext } from "src/contexts/GlobalCache"
import { ReportModalContext } from "src/contexts/ReportModal"
import { ThreeDSContext, useThreeDS } from "src/contexts/ThreeDS"
import { useMessageToDevelopers } from "src/hooks/useMessageToDevelopers"
import { useTokenRefresh } from "src/hooks/useTokenRefresh"

const BlockModal = dynamic(
  () => import("src/components/organisms/BlockModal"),
  { ssr: false }
)
const BuyPassModal = dynamic(
  () => import("src/components/organisms/payment/BuyPassModal"),
  { ssr: false }
)
const BuyPostModal = dynamic(
  () => import("../components/organisms/payment/BuyPostModal"),
  { ssr: false }
)
const ReportModal = dynamic(
  () => import("src/components/organisms/ReportModal"),
  { ssr: false }
)

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

type GetLayout = (page: ReactElement, hasRefreshed: boolean) => JSX.Element

export type NextPageWithLayout<P = Record<string, unknown>, IP = P> = NextPage<
  P,
  IP
> & { getLayout?: GetLayout }

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

type SubAppProps = {
  Component: NextPageWithLayout
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pageProps: any
  getLayout: GetLayout
}

const LANDING_MESSAGES: Record<string, Record<string, string>> = {
  success: {
    passPurchase:
      "Thank you for you purchase, your membership card is minting now"
  },
  failure: {
    passPurchase:
      "Thank you for you purchase, your membership card is minting now"
  }
}

// SubApp is to remove the use effect from top level configs
const SubApp = ({ Component, pageProps, getLayout }: SubAppProps) => {
  const [buyPost, setBuyPost] = useState<PostDto | null>(null)
  const [buyPass, setBuyPass] = useState<PassDto | null>(null)
  const [reportData, setReportData] = useState<ReportModalData | null>(null)
  const [blockData, setBlockData] = useState<BlockModalData | null>(null)
  const { hasRefreshed, mutate, user } = useTokenRefresh()
  const { setPayin } = useThreeDS()
  const router = useRouter()

  // additional mutate on route change due to strange login issues
  // where user change does not globablly propagate
  useEffect(() => {
    if (!user) {
      mutate()
    }
  }, [mutate, router.route, user])

  useEffect(() => {
    if (router.isReady) {
      const query = router.query
      const landingMessage = query.lm as string
      const result = query.r as string
      if (landingMessage && result) {
        if (LANDING_MESSAGES[result][landingMessage]) {
          toast.success(LANDING_MESSAGES[result][landingMessage])
        }
        // TODO: keep other query params and hashes
        window.history.replaceState("", "", "?")
      }
    }
  }, [router])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const providers: Array<[Provider<any>, Record<string, any>]> = [
    [GlobalCacheContext.Provider, { usernames: {} }],
    [BuyPostModalContext.Provider, { setPost: setBuyPost }],
    [BlockModalContext.Provider, { setBlockData }],
    [ReportModalContext.Provider, { setReportData }],
    [BuyPassModalContext.Provider, { setPass: setBuyPass }],
    [ThreeDSContext.Provider, { setPayin }]
  ]

  return getLayout(
    <AppProviders providers={providers}>
      <Component {...pageProps} />
      {buyPost && <BuyPostModal post={buyPost} setPost={setBuyPost} />}
      {buyPass && <BuyPassModal pass={buyPass} setPass={setBuyPass} />}
      {reportData && (
        <ReportModal reportData={reportData} setReportData={setReportData} />
      )}
      {blockData && (
        <BlockModal blockData={blockData} setBlockData={setBlockData} />
      )}
      <ToastContainer
        position="bottom-center"
        autoClose={ms("4 seconds")}
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
    </AppProviders>,
    hasRefreshed
  )
}

const App = ({ Component, pageProps }: AppPropsWithLayout) => {
  useMessageToDevelopers([
    "Hey developers! We're hiring: https://jobs.lever.co/Passes",
    "Have an awesome day :-)"
  ])

  const getLayout = Component.getLayout ?? ((page) => page)
  return (
    <NextThemeProvider attribute="class" disableTransitionOnChange>
      <DefaultHead />
      <Script
        dangerouslySetInnerHTML={{ __html: SegmentConfig }}
        id="segmentScript"
      />
      <SWRConfig value={GlobalSWRConfig}>
        <DndProvider backend={HTML5Backend}>
          <SubApp
            Component={Component}
            pageProps={pageProps}
            getLayout={getLayout}
          />
        </DndProvider>
      </SWRConfig>
    </NextThemeProvider>
  )
}

export default App
