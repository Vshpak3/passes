import { ContentBareDto, ContentDto } from "@passes/api-client"
import dynamic from "next/dynamic"
import { useRouter } from "next/router"
import MessagesBackIcon from "public/icons/messages-back-icon.svg"
import MessagesPlusIcon from "public/icons/messages-plus-icon.svg"
import { memo, Suspense, useState } from "react"

import { CenterLoader } from "src/components/atoms/CenterLoader"
import { SectionTitle } from "src/components/atoms/SectionTitle"
import { useUser } from "src/hooks/useUser"
import { CreatorSearchBar } from "src/layout/CreatorSearchBar"
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
          <div className="space-between mt-4 ml-5 mb-3 flex min-h-[32px] items-center justify-between lg:w-[95%]">
            {massMessage ? (
              <div className="cursor-pointer">
                <MessagesBackIcon onClick={() => setMassMessage(false)} />
              </div>
            ) : null}
            <div className="flex flex-row items-center justify-between">
              <SectionTitle>
                {massMessage ? "Mass Messaging" : "Messages"}
              </SectionTitle>
              {massMessage && user.isCreator ? null : (
                <div className="mx-6 cursor-pointer lg:mr-0">
                  <MessagesPlusIcon onClick={() => setMassMessage(true)} />
                </div>
              )}
            </div>
            <div className="z-[1000]">
              <CreatorSearchBar />
            </div>
          </div>
        ) : (
          <div className="mt-4 ml-5 mb-3 flex min-h-[32px] min-w-[35%] items-center justify-between gap-4 lg:w-[95%]">
            <span className="pr-56 font-bold text-[#ffffff] md:text-[20px] md:leading-[25px]">
              Messages
            </span>
            <div className="z-[1000]">
              <CreatorSearchBar />
            </div>
          </div>
        )}
        <Messages
          defaultUserId={router.query.user as string | undefined}
          massMessage={massMessage}
          setMassMessage={setMassMessage}
          setVaultContent={setVaultContent}
          vaultContent={vaultContent}
        />
      </div>
    </Suspense>
  )
}

export default WithNormalPageLayout(memo(MessagesPage), {
  header: false,
  sidebar: true
})
