import "react-toastify/dist/ReactToastify.css"
import "src/styles/global/main.css"
import {
  ChannelMemberDto,
  MessageDto,
  PassDto,
  PostDto,
  SendMessageRequestDto
} from "@passes/api-client"
import debounce from "lodash.debounce"
import { NextPage } from "next"
import { AppProps } from "next/app"
import dynamic from "next/dynamic"
import Router from "next/router"
import { ThemeProvider as NextThemeProvider } from "next-themes"
import nprogress from "nprogress"
import { Provider, ReactElement, useEffect, useState } from "react"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { SWRConfig } from "swr"

import { DefaultHead } from "src/components/atoms/Head"
import { ManageCookiesModal } from "src/components/molecules/ManageCookies"
import { BlockModalData } from "src/components/organisms/BlockModal"
import { CookieBanner } from "src/components/organisms/CookieBanner"
import { BuyMessageModal } from "src/components/organisms/payment/BuyMessageModal"
import TippedMessageModal from "src/components/organisms/payment/TippedMessageModal"
import { ReportModalData } from "src/components/organisms/ReportModal"
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
  acceptAllCookies,
  CookiesProps,
  rejectAllCookies
} from "src/helpers/CookieHelpers"
import { useLocalStorage } from "src/hooks/storage/useLocalStorage"
import { useMessageToDevelopers } from "src/hooks/useMessageToDevelopers"
import { useTokenRefresh } from "src/hooks/useTokenRefresh"
import { usePaymentWebhook } from "src/hooks/webhooks/usePaymentWebhook"
import { gradients } from "src/layout/_gradients"

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
const ToastPortal = dynamic(() => import("src/layout/ToastPortal"), {
  ssr: false
})

// Only show nprogress after this many milliseconds (slow loading)
const LOADING_DEBOUNCE_TIME = 500
const start = debounce(nprogress.start, LOADING_DEBOUNCE_TIME)
Router.events.on("routeChangeStart", start)
Router.events.on("routeChangeComplete", () => {
  start.cancel()
  nprogress.done()
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

const navPaths = ["/messages"]

// SubApp is to remove the use effect from top level configs
const SubApp = ({ Component, pageProps, getLayout }: SubAppProps) => {
  const [buyPost, setBuyPost] = useState<PostDto | null>(null)
  const [manageCookiesModalOpen, setManageCookiesModalOpen] =
    useState<boolean>(false)
  const [buyMessage, setBuyMessage] = useState<MessageDto | null>(null)
  const [selectedChannel, setSelectedChannel] =
    useState<ChannelMemberDto | null>(null)
  const [tippedMessage, setTippedMessage] =
    useState<SendMessageRequestDto | null>(null)
  const [tipPost, setTipPost] = useState<PostDto | null>(null)
  const [buyPass, setBuyPass] = useState<PassDto | null>(null)
  const [reportData, setReportData] = useState<ReportModalData | null>(null)
  const [blockData, setBlockData] = useState<BlockModalData | null>(null)
  const [showBottomNav, setShowBottomNav] = useState<boolean>(true)
  const [showTopNav, setShowTopNav] = useState<boolean>(true)
  const [cookieSettings, setCookieSettings] = useLocalStorage(
    "cookieSettings",
    ""
  )
  const [showCookieBanner, setShowCookieBanner] = useState(false)
  const [onModalCallback, setOnModalCallback] = useState<(() => void) | null>(
    null
  )

  const { hasRefreshed, router, user } = useTokenRefresh()
  const { setPayin, complete, reset } = useThreeDS()
  usePaymentWebhook()

  useEffect(() => {
    if (
      !user &&
      (tipPost ||
        buyPass ||
        buyPost ||
        selectedChannel ||
        tippedMessage ||
        reportData ||
        blockData)
    ) {
      router.push("/login")
      setTipPost(null)
      setBuyPass(null)
      setBuyPost(null)
      setSelectedChannel(null)
      setTippedMessage(null)
      setBlockData(null)
      setReportData(null)
    }
  }, [
    user,
    tipPost,
    buyPass,
    buyPost,
    selectedChannel,
    tippedMessage,
    router,
    reportData,
    blockData
  ])

  useEffect(() => {
    setShowCookieBanner(cookieSettings === "")

    if (typeof cookieSettings === "object") {
      setCookieSettings(JSON.stringify(cookieSettings))
    }
  }, [cookieSettings, setCookieSettings])

  useEffect(() => {
    if (!navPaths.filter((path) => path === router.route).length) {
      setShowBottomNav(true)
      setShowTopNav(true)
    }
  }, [router.route])

  const onSetCookies = (cookieSettings: CookiesProps) => {
    setCookieSettings(JSON.stringify(cookieSettings))
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const providers: Array<[Provider<any>, Record<string, any>]> = [
    [
      GlobalCacheContext.Provider,
      { usernames: {}, profileImages: new Set<string>() }
    ],
    [BuyPostModalContext.Provider, { setPost: setBuyPost }],
    [
      BuyMessageModalContext.Provider,
      { setMessage: setBuyMessage, setSelectedChannel }
    ],
    [
      TippedMessageModalContext.Provider,
      {
        setTippedMessage: setTippedMessage,
        setOnModalCallback: setOnModalCallback,
        setSelectedChannel
      }
    ],
    [BlockModalContext.Provider, { setBlockData }],
    [ReportModalContext.Provider, { setReportData }],
    [BuyPassModalContext.Provider, { setPass: setBuyPass }],
    [TipPostModalContext.Provider, { setPost: setTipPost }],
    [ThreeDSContext.Provider, { setPayin, complete, reset }],
    [
      SidebarContext.Provider,
      { setShowBottomNav, showBottomNav, showTopNav, setShowTopNav }
    ]
  ]

  return (
    <AppProviders providers={providers}>
      {getLayout(
        <>
          {gradients()}
          <Component {...pageProps} />
          {showCookieBanner && (
            <CookieBanner
              onAccept={() =>
                setCookieSettings(JSON.stringify(acceptAllCookies))
              }
              onManage={() => setManageCookiesModalOpen(true)}
              onReject={() =>
                setCookieSettings(JSON.stringify(rejectAllCookies))
              }
            />
          )}
          {manageCookiesModalOpen && (
            <ManageCookiesModal
              isOpen
              onClose={() => setManageCookiesModalOpen(false)}
              onSetCookies={onSetCookies}
            />
          )}
          {buyPost && <BuyPostModal post={buyPost} setPost={setBuyPost} />}
          {buyMessage && selectedChannel && (
            <BuyMessageModal
              message={buyMessage}
              selectedChannel={selectedChannel}
              setMessage={setBuyMessage}
            />
          )}
          {tippedMessage && selectedChannel && (
            <TippedMessageModal
              messageRequest={tippedMessage}
              onSuccess={onModalCallback}
              selectedChannel={selectedChannel}
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
        </>,
        hasRefreshed
      )}
    </AppProviders>
  )
}

// eslint-disable-next-line react/no-multi-comp
const App = ({ Component, pageProps }: AppPropsWithLayout) => {
  useMessageToDevelopers([
    "Hey developers! We're hiring: https://jobs.lever.co/Passes",
    "Have an awesome day :-)"
  ])

  const getLayout = Component.getLayout ?? ((page) => page)
  return (
    <>
      <NextThemeProvider attribute="class" disableTransitionOnChange>
        <DefaultHead />
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
      <ToastPortal />
    </>
  )
}

export default App
