import { MessagesApi } from "@passes/api-client"
import {
  ChannelMemberDto,
  ContentDto,
  ListDto,
  PassDto
} from "@passes/api-client/models"
import { useRouter } from "next/router"
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react"

import { ChannelList } from "src/components/molecules/messages/ChannelList"
import { ChannelView } from "src/components/molecules/messages/ChannelView"
import { ChannelMassDM } from "src/components/molecules/messages/mass-dm/ChannelMassDM"
import { ChannelViewMassDM } from "src/components/molecules/messages/mass-dm/ChannelViewMassDM"
import { useUser } from "src/hooks/useUser"
import { useWindowSize } from "src/hooks/useWindowSizeHook"

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
  const [openChannelView, setOpenChannelView] = useState<boolean>(true)

  const [gallery, setGallery] = useState(false)
  const { user } = useUser()

  const { isMobile } = useWindowSize()

  const handleOpenChannelView = () => setOpenChannelView(false)

  const handleChannelClicked = async (channel: ChannelMemberDto) => {
    setSelectedChannel(channel)
    setOpenChannelView(true)
  }

  useEffect(() => {
    if (
      selectedChannel &&
      router.isReady &&
      router.query.user !== selectedChannel.otherUserId
    ) {
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

  useEffect(() => {
    setOpenChannelView(!isMobile)
  }, [isMobile])

  return (
    <div className="flex h-full flex-row border border-r-0 border-[#fff]/10">
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
            selectedChannel={selectedChannel}
          />
          {openChannelView && (
            <ChannelView
              gallery={gallery}
              isCreator={!!user?.isCreator}
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

export default MessagesV2 // eslint-disable-line import/no-default-export
