import { ContentBareDto, ContentDto } from "@passes/api-client"
import dynamic from "next/dynamic"
import { useRouter } from "next/router"
import MessagesBackIcon from "public/icons/messages-back-icon.svg"
import MessagesPlusIcon from "public/icons/messages-plus-icon.svg"
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
  const [massMessage, setMassMessage] = useState(!!vaultContent.length)

  return (
    <Suspense fallback={<CenterLoader />}>
      <div className="flex h-screen flex-col">
        {user?.isCreator ? (
          <div className="space-between mt-8 ml-5 mb-3 flex min-h-[32px] min-w-[35%] items-center gap-4">
            {massMessage ? (
              <div className="cursor-pointer">
                <MessagesBackIcon onClick={() => setMassMessage(false)} />
              </div>
            ) : null}
            <span className="pr-56 font-bold text-[#ffffff] md:text-[20px] md:leading-[25px] ">
              {massMessage ? "Mass Messaging" : "Messages"}
            </span>
            {massMessage ? null : (
              <div className="cursor-pointer">
                <MessagesPlusIcon onClick={() => setMassMessage(true)} />
              </div>
            )}
          </div>
        ) : (
          <div className="space-between mt-8 ml-5 mb-3 flex min-h-[32px] min-w-[35%] items-center gap-4">
            <span className="pr-56 font-bold text-[#ffffff] md:text-[20px] md:leading-[25px] ">
              Messages
            </span>
          </div>
        )}
        <Messages
          defaultUserId={router.query.user as string | undefined}
          vaultContent={vaultContent}
          setVaultContent={setVaultContent}
          massMessage={massMessage}
          setMassMessage={setMassMessage}
        />
      </div>
    </Suspense>
  )
}

export default WithNormalPageLayout(memo(MessagesPage), {
  header: false,
  sidebar: true
})
