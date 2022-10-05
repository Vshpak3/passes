import dynamic from "next/dynamic"
import { Suspense } from "react"
import { withPageLayout } from "src/layout/WithPageLayout"

const Messages = dynamic(() => import("src/components/organisms/MessagesV2"), {
  suspense: true,
  ssr: false
})

const MessagesPage = () => {
  return (
    <Suspense fallback={`Loading...`}>
      <div className="flex h-screen flex-col">
        <div className="mt-8 ml-5 mb-3 font-bold text-[#ffffff] md:text-[20px] md:leading-[25px]">
          Messages
        </div>
        <Messages />
      </div>
    </Suspense>
  )
}

export default withPageLayout(MessagesPage, { header: false, sidebar: true })
