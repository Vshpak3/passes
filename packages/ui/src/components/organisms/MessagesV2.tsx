import { MessagesApi } from "@passes/api-client"
import { ChannelMemberDto, ListMemberDto } from "@passes/api-client/models"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { ChannelList } from "src/components/molecules/messages/ChannelList"
import { ChannelView } from "src/components/molecules/messages/ChannelView"
import { useUser } from "src/hooks/useUser"

interface MessagesV2Props {
  defaultUserId?: string
}

const MessagesV2 = ({ defaultUserId }: MessagesV2Props) => {
  const router = useRouter()
  const [selectedChannel, setSelectedChannel] = useState<ChannelMemberDto>()
  const [gallery, setGallery] = useState(false)
  const { user } = useUser()
  const handleChannelClicked = async (channel: ChannelMemberDto) => {
    setSelectedChannel(channel)
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

  const createChannel = (userId: string) => {
    const api = new MessagesApi()
    return api.getOrCreateChannel({
      getChannelRequestDto: {
        userId
      }
    })
  }

  const onUserSelect = async (user: ListMemberDto) => {
    const channel = await createChannel(user.userId)
    setSelectedChannel(channel)
  }

  return (
    <div className="flex h-full flex-row border border-r-0 border-[#fff]/10">
      <ChannelList
        onUserSelect={onUserSelect}
        selectedChannel={selectedChannel}
        onChannelClicked={handleChannelClicked}
      />
      {user && user.userId && (
        <ChannelView
          selectedChannel={selectedChannel}
          gallery={gallery}
          setGallery={setGallery}
          isCreator={!!user?.isCreator}
          user={user}
        />
      )}
    </div>
  )
}

export default MessagesV2 // eslint-disable-line import/no-default-export
