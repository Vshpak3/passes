import { ContentBareDto, ContentDto } from "@passes/api-client"
import { useRouter } from "next/router"
import MessagesPlusIcon from "public/icons/messages-plus-icon.svg"
import { memo, Suspense, useState } from "react"

import { CenterLoader } from "src/components/atoms/CenterLoader"
import { SectionTitle } from "src/components/atoms/SectionTitle"
import Messages from "src/components/organisms/Messages"
import { useUser } from "src/hooks/useUser"
import { ArrowLeft } from "src/icons/ArrowLeft"
import { CreatorSearchBar } from "src/layout/CreatorSearchBar"
import { WithNormalPageLayout } from "src/layout/WithNormalPageLayout"

const MessagesPage = () => {
  const router = useRouter()
  const { content } = router.query
  const { user } = useUser()
  const [vaultContent, setVaultContent] = useState<ContentDto[]>(
    JSON.parse((content as string) ?? "[]").map((bare: ContentBareDto) => {
      return { ...bare, userId: user?.userId ?? "" }
    })
  )
  const [massMessage, setMassMessage] = useState(!!vaultContent.length)

  return (
    <Suspense fallback={<CenterLoader />}>
      <div className="safe-h-screen max-safe-h-screen flex flex-col overflow-y-hidden">
        <div className="hidden h-16 lg:flex">
          {user?.isCreator ? (
            <div className="flex flex-1 items-center">
              {massMessage ? (
                <div
                  className="ml-4 cursor-pointer"
                  onClick={() => setMassMessage(false)}
                >
                  <ArrowLeft height="16" width="16" />
                </div>
              ) : null}
              <div className="flex flex-row items-center">
                <SectionTitle className="ml-4">
                  {massMessage ? "Mass Messaging" : "Messages"}
                </SectionTitle>
                {!!user.isCreator && !massMessage && (
                  <div className="mx-6 cursor-pointer lg:mr-0">
                    <MessagesPlusIcon onClick={() => setMassMessage(true)} />
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="ml-4 flex flex-1">
              <SectionTitle>Messages</SectionTitle>
            </div>
          )}
          <div className="z-[1000] mr-8 pt-2">
            <CreatorSearchBar />
          </div>
        </div>
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
  sidebar: true,
  noScroll: true
})
