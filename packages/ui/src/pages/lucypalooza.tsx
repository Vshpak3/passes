import dynamic from "next/dynamic"
import { Suspense } from "react"
import { withPageLayout } from "src/layout/WithPageLayout"

const LucyPalooza = dynamic(() => import("src/components/pages/lucypalooza"), {
  suspense: true,
  ssr: false
})

LucyPalooza
const LucyPaloozaPage = () => {
  return (
    <Suspense fallback={`Loading...`}>
      <LucyPalooza />
    </Suspense>
  )
}

export default withPageLayout(LucyPaloozaPage, {
  header: false,
  sidebar: false
})
