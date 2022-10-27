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
import {
  Provider,
  ReactElement,
  ReactNode,
  useEffect,
  useRef,
  useState
} from "react"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { ToastContainer } from "react-toastify"
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
import { ViewPostModalContext } from "src/contexts/ViewPostModal"
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
const ViewPostModal = dynamic(
  () => import("src/components/organisms/profile/post/ViewPostModal"),
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
  getLayout: any
}

const SubApp = ({ Component, pageProps, getLayout }: SubAppProps) => {
  const [viewPost, setViewPost] = useState<PostDto | null>(null)
  const viewPostActiveIndex = useRef(null)
  const [buyPost, setBuyPost] = useState<PostDto | null>(null)
  const [buyPass, setBuyPass] = useState<PassDto | null>(null)
  const [reportData, setReportData] = useState<ReportModalData | null>(null)
  const [blockData, setBlockData] = useState<BlockModalData | null>(null)
  const { hasRefreshed, mutate } = useTokenRefresh()
  const router = useRouter()
  useEffect(() => {
    mutate()
  }, [mutate, router.route])

  const providers: Array<[Provider<any>, Record<string, any>]> = [
    [GlobalCacheContext.Provider, { usernames: {} }],
    [
      ViewPostModalContext.Provider,
      { setPost: setViewPost, viewPostActiveIndex }
    ],
    [BuyPostModalContext.Provider, { setPost: setBuyPost }],
    [BlockModalContext.Provider, { setBlockData }],
    [ReportModalContext.Provider, { setReportData }],
    [BuyPassModalContext.Provider, { setPass: setBuyPass }]
  ]

  return getLayout(
    <AppProviders providers={providers}>
      <Component {...pageProps} />
      {viewPost && <ViewPostModal post={viewPost} setPost={setViewPost} />}
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
