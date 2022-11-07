import "react-toastify/dist/ReactToastify.css"
import "src/styles/global/main.css"
import {
  MessageDto,
  PassDto,
  PostDto,
  SendMessageRequestDto
} from "@passes/api-client"
import debounce from "lodash.debounce"
import ms from "ms"
import { NextPage } from "next"
import { AppProps } from "next/app"
import dynamic from "next/dynamic"
import Router from "next/router"
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
import { BuyMessageModal } from "src/components/organisms/payment/BuyMessageModal"
import TippedMessageModal from "src/components/organisms/payment/TIppedMessageModal"
import { ReportModalData } from "src/components/organisms/ReportModal"
import { SegmentConfig } from "src/config/app/segment"
import { GlobalSWRConfig } from "src/config/app/swr"
import { AppProviders } from "src/contexts/AppProviders"
import { BlockModalContext } from "src/contexts/BlockModal"
import { BuyMessageModalContext } from "src/contexts/BuyMessageModal"
import { BuyPassModalContext } from "src/contexts/BuyPassModal"
import { BuyPostModalContext } from "src/contexts/BuyPostModal"
import { GlobalCacheContext } from "src/contexts/GlobalCache"
import { ReportModalContext } from "src/contexts/ReportModal"
import { SidebarContext } from "src/contexts/SidebarContext"
import { ThreeDSContext, useThreeDS } from "src/contexts/ThreeDS"
import { TippedMessageModalContext } from "src/contexts/TippedMessageModal"
import { TipPostModalContext } from "src/contexts/TipPostModal"
import {
  LANDING_MESSAGES,
  LandingMessageEnum,
  LandingStatusEnum
} from "src/helpers/landing-messages"
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
const TipPostModal = dynamic(
  () => import("../components/organisms/payment/TipPostModal"),
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

// SubApp is to remove the use effect from top level configs
const SubApp = ({ Component, pageProps, getLayout }: SubAppProps) => {
  const [buyPost, setBuyPost] = useState<PostDto | null>(null)
  const [buyMessage, setBuyMessage] = useState<MessageDto | null>(null)
  const [tippedMessage, setTippedMessage] =
    useState<SendMessageRequestDto | null>(null)
  const [tipPost, setTipPost] = useState<PostDto | null>(null)
  const [buyPass, setBuyPass] = useState<PassDto | null>(null)
  const [reportData, setReportData] = useState<ReportModalData | null>(null)
  const [blockData, setBlockData] = useState<BlockModalData | null>(null)
  const [showBottomNav, setShowBottomNav] = useState<boolean>(true)

  const [onModalCallback, setOnModalCallback] = useState<(() => void) | null>(
    null
  )

  const { hasRefreshed, router } = useTokenRefresh()
  const { setPayin } = useThreeDS()

  useEffect(() => {
    if (router.isReady) {
      const query = router.query
      const landingMessage = query.lm as LandingMessageEnum
      const result = query.r as LandingStatusEnum
      if (landingMessage && result && LANDING_MESSAGES[result]) {
        const action =
          result === LandingStatusEnum.SUCCESS ? toast.success : toast.error
        if (LANDING_MESSAGES[result][landingMessage]) {
          action(LANDING_MESSAGES[result][landingMessage])
        }
        // TODO: keep other query params and hashes
        window.history.replaceState(window.history.state, "", "?")
      }
    }
  }, [router])

  useEffect(() => {
    setShowBottomNav(true)
  }, [router, router.route])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const providers: Array<[Provider<any>, Record<string, any>]> = [
    [
      GlobalCacheContext.Provider,
      { usernames: {}, profileImages: new Set<string>() }
    ],
    [BuyPostModalContext.Provider, { setPost: setBuyPost }],
    [BuyMessageModalContext.Provider, { setMessage: setBuyMessage }],
    [
      TippedMessageModalContext.Provider,
      {
        setTippedMessage: setTippedMessage,
        setOnModalCallback: setOnModalCallback
      }
    ],
    [BlockModalContext.Provider, { setBlockData }],
    [ReportModalContext.Provider, { setReportData }],
    [BuyPassModalContext.Provider, { setPass: setBuyPass }],
    [TipPostModalContext.Provider, { setPost: setTipPost }],
    [ThreeDSContext.Provider, { setPayin }],
    [SidebarContext.Provider, { setShowBottomNav, showBottomNav }]
  ]

  return (
    <AppProviders providers={providers}>
      {getLayout(
        <>
          <Component {...pageProps} />
          {buyPost && <BuyPostModal post={buyPost} setPost={setBuyPost} />}
          {buyMessage && (
            <BuyMessageModal message={buyMessage} setMessage={setBuyMessage} />
          )}
          {tippedMessage && (
            <TippedMessageModal
              messageRequest={tippedMessage}
              onSuccess={onModalCallback}
              setMessageRequest={setTippedMessage}
            />
          )}
          {buyPass && <BuyPassModal pass={buyPass} setPass={setBuyPass} />}
          {reportData && (
            <ReportModal
              reportData={reportData}
              setReportData={setReportData}
            />
          )}
          {blockData && (
            <BlockModal blockData={blockData} setBlockData={setBlockData} />
          )}
          {tipPost && <TipPostModal post={tipPost} setPost={setTipPost} />}
          <ToastContainer
            autoClose={ms("4 seconds")}
            closeOnClick
            draggable={false}
            hideProgressBar
            limit={3}
            newestOnTop={false}
            pauseOnFocusLoss
            pauseOnHover
            position="bottom-center"
            rtl={false}
            theme="colored"
          />
        </>,
        hasRefreshed
      )}
    </AppProviders>
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
            getLayout={getLayout}
            pageProps={pageProps}
          />
        </DndProvider>
      </SWRConfig>
    </NextThemeProvider>
  )
}

export default App
