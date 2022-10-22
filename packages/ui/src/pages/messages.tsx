import { ContentBareDto, ContentDto } from "@passes/api-client"
import dynamic from "next/dynamic"
import { useRouter } from "next/router"
import { memo, Suspense, useState } from "react"
import { CenterLoader } from "src/components/atoms/CenterLoader"
import { useUser } from "src/hooks/useUser"
import { WithNormalPageLayout } from "src/layout/WithNormalPageLayout"
const Messages = dynamic(() => import("src/components/organisms/MessagesV2"), {
  suspense: true,
  ssr: false
})

const MessagesPage = () => {
  const router = useRouter()
  const { content } = router.query
  const { user } = useUser()
  const [vaultContent, setVaultContent] = useState<ContentDto[]>(
    JSON.parse((content as string) ?? "[]").map((bare: ContentBareDto) => {
      return { ...bare, user: user?.userId ?? "" }
    })
  )
  return (
    <Suspense fallback={<CenterLoader />}>
      <div className="flex h-screen flex-col">
        <div className="mt-8 ml-5 mb-3 font-bold text-[#ffffff] md:text-[20px] md:leading-[25px]">
          Messages
        </div>
        <Messages
          defaultUserId={router.query.user as string | undefined}
          vaultContent={vaultContent}
          setVaultContent={setVaultContent}
        />
      </div>
    </Suspense>
  )
}

export default WithNormalPageLayout(memo(MessagesPage), {
  header: false,
  sidebar: true
})
