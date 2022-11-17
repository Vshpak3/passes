import { ContentDto } from "@passes/api-client/models"
import { Dispatch, FC, memo, SetStateAction, useEffect, useState } from "react"

import { useSidebarContext } from "src/hooks/context/useSidebarContext"
import { MessagesChannelsView } from "./MessagesChannelsView"
import { MessagesMassDMView } from "./MessagesMassDMView"

export interface MessagesProps {
  defaultUserId?: string
  vaultContent: ContentDto[]
  setVaultContent: Dispatch<SetStateAction<ContentDto[]>>
  massMessage: boolean
  setMassMessage: (massMessage: boolean) => void
}

const Messages: FC<MessagesProps> = ({ massMessage, ...res }) => {
  const [openChannelView, setOpenChannelView] = useState<boolean>(false)

  const { showBottomNav, setShowBottomNav, setShowTopNav, showTopNav } =
    useSidebarContext()

  useEffect(() => {
    setShowBottomNav(massMessage || !openChannelView)
    setShowTopNav(massMessage || !openChannelView)
  }, [
    openChannelView,
    showBottomNav,
    setShowBottomNav,
    setShowTopNav,
    showTopNav,
    massMessage
  ])

  return (
    <div className="grid h-full grid-cols-9 flex-row border-[0.5px] border-x-0 border-passes-gray lg:h-[calc(100vh-5rem)]">
      {massMessage ? (
        <MessagesMassDMView {...res} />
      ) : (
        <MessagesChannelsView
          {...res}
          openChannelView={openChannelView}
          setOpenChannelView={setOpenChannelView}
        />
      )}
    </div>
  )
}

export default memo(Messages) // eslint-disable-line import/no-default-export
