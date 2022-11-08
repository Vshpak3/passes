import { MessagesApi } from "@passes/api-client"
import {
  ChannelMemberDto,
  ContentDto,
  ListDto,
  PassDto
} from "@passes/api-client/models"
import { useRouter } from "next/router"
import { Dispatch, FC, memo, SetStateAction, useEffect, useState } from "react"

import { ChannelList } from "src/components/molecules/messages/ChannelList"
import { ChannelView } from "src/components/molecules/messages/ChannelView"
import { ChannelMassDM } from "src/components/molecules/messages/mass-dm/ChannelMassDM"
import { ChannelViewMassDM } from "src/components/molecules/messages/mass-dm/ChannelViewMassDM"
import { useSidebarContext } from "src/hooks/context/useSidebarContext"
import { useUser } from "src/hooks/useUser"

interface MessagesV2Props {
  defaultUserId?: string
  vaultContent: ContentDto[]
  setVaultContent: Dispatch<SetStateAction<ContentDto[]>>
  massMessage: boolean
  setMassMessage: Dispatch<SetStateAction<boolean>>
}

const MessagesV2: FC<MessagesV2Props> = ({
  defaultUserId,
  vaultContent,
  setVaultContent,
  massMessage,
  setMassMessage
}) => {
  const router = useRouter()
  const [selectedChannel, setSelectedChannel] = useState<ChannelMemberDto>()
  const [selectedPasses, setSelectedPasses] = useState<PassDto[]>([])
  const [selectedLists, setSelectedLists] = useState<ListDto[]>([])
  const [excludedLists, setExcludedLists] = useState<ListDto[]>([])
  const [openChannelView, setOpenChannelView] = useState<boolean>(false)

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
    setShowTopNav(false)
  }, [
    openChannelView,
    showBottomNav,
    setShowBottomNav,
    setShowTopNav,
    showTopNav
  ])

  useEffect(() => {
    setShowTopNav(false)
  }, [setShowTopNav, showTopNav])

  useEffect(() => {
    if (selectedChannel) {
      setOpenChannelView(true)
    }
  }, [selectedChannel])

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
    <div className="grid h-full grid-cols-9 flex-row border border-r-0 border-[#fff]/10 lg:h-[calc(100vh-60px)]">
      {massMessage ? (
        <>
          <ChannelMassDM
            excludedLists={excludedLists}
            selectedLists={selectedLists}
            selectedPasses={selectedPasses}
            setExcludedLists={setExcludedLists}
            setSelectedLists={setSelectedLists}
            setSelectedPasses={setSelectedPasses}
          />
          <ChannelViewMassDM
            excludedLists={excludedLists}
            selectedLists={selectedLists}
            selectedPasses={selectedPasses}
            setExcludedLists={setExcludedLists}
            setMassMessage={setMassMessage}
            setSelectedLists={setSelectedLists}
            setSelectedPasses={setSelectedPasses}
            setVaultContent={setVaultContent}
            vaultContent={vaultContent}
          />
        </>
      ) : (
        <>
          <ChannelList
            onChannelClicked={handleChannelClicked}
            openChannelView={openChannelView}
            selectedChannel={selectedChannel}
          />
          {openChannelView && (
            <ChannelView
              gallery={gallery}
              isCreator={!!user?.isCreator}
              key={selectedChannel?.channelId}
              onBack={handleOpenChannelView}
              selectedChannel={selectedChannel}
              setGallery={setGallery}
              setVaultContent={setVaultContent}
              vaultContent={vaultContent}
            />
          )}
        </>
      )}
    </div>
  )
}

export default memo(MessagesV2) // eslint-disable-line import/no-default-export
