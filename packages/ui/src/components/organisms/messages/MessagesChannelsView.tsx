import { MessagesApi } from "@passes/api-client"
import { ChannelMemberDto } from "@passes/api-client/models"
import { useRouter } from "next/router"
import { Dispatch, FC, memo, SetStateAction, useEffect, useState } from "react"

import { ChannelList } from "src/components/molecules/messages/ChannelList"
import { ChannelView } from "src/components/molecules/messages/ChannelView"
import { useSidebarContext } from "src/hooks/context/useSidebarContext"
import { useUser } from "src/hooks/useUser"
import { MessagesProps } from "./Messages"

interface MessagesChannelsViewProps
  extends Pick<
    MessagesProps,
    "defaultUserId" | "vaultContent" | "setVaultContent"
  > {
  openChannelView: boolean
  setOpenChannelView: Dispatch<SetStateAction<boolean>>
}

const MessagesChannelsViewUnmemo: FC<MessagesChannelsViewProps> = ({
  defaultUserId,
  vaultContent,
  setVaultContent,
  openChannelView,
  setOpenChannelView
}) => {
  const router = useRouter()
  const [selectedChannel, setSelectedChannel] = useState<ChannelMemberDto>()
  const [bannerPopUp, setBannerPopUp] = useState<boolean>(true)
  const [gallery, setGallery] = useState(false)
  const { user } = useUser()

  const handleOpenChannelView = () => setOpenChannelView(false)

  const handleChannelClicked = async (channel: ChannelMemberDto) => {
    setSelectedChannel(channel)
    setOpenChannelView(true)
  }

  const { showBottomNav, setShowBottomNav, setShowTopNav, showTopNav } =
    useSidebarContext()

  useEffect(() => {
    setShowBottomNav(!openChannelView)
    setShowTopNav(!openChannelView)
  }, [
    openChannelView,
    showBottomNav,
    setShowBottomNav,
    setShowTopNav,
    showTopNav
  ])

  useEffect(() => {
    if (selectedChannel) {
      setOpenChannelView(true)
    }
  }, [selectedChannel, setOpenChannelView])

  useEffect(() => {
    if (selectedChannel && router.isReady) {
      // pushState messes with the ability to go back
      window.history.replaceState(
        window.history.state,
        "",
        router.basePath + "?user=" + selectedChannel.otherUserId
      )
    }
  }, [router, selectedChannel])

  useEffect(() => {
    if (defaultUserId) {
      const fetch = async () => {
        const api = new MessagesApi()
        const channel = await api.getOrCreateChannel({
          getChannelRequestDto: { userId: defaultUserId }
        })
        setSelectedChannel(channel)
      }
      try {
        fetch()
      } catch (err) {
        null
      }
    }
  }, [defaultUserId])

  return (
    <>
      <ChannelList
        onChannelClicked={handleChannelClicked}
        openChannelView={openChannelView}
        selectedChannel={selectedChannel}
      />
      {openChannelView && (
        <ChannelView
          bannerPopUp={bannerPopUp}
          gallery={gallery}
          isCreator={!!user?.isCreator}
          key={selectedChannel?.channelId}
          onBack={handleOpenChannelView}
          selectedChannel={selectedChannel}
          setBannerPopUp={setBannerPopUp}
          setGallery={setGallery}
          setVaultContent={setVaultContent}
          vaultContent={vaultContent}
        />
      )}
    </>
  )
}

export const MessagesChannelsView = memo(MessagesChannelsViewUnmemo)
