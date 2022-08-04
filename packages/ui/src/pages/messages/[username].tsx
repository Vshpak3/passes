import { useRouter } from "next/router"
import Menu, { MenuPortal } from "src/containers/Menu"

import ChatView from "../../components/messages/chat-view"

const ChatViewPage = () => {
  const router = useRouter()
  if (!router.isReady || !router.query.username) {
    return null
  }
  return (
    <div className="relative h-full w-full">
      <MenuPortal />
      <div className="flex">
        <Menu />
        <ChatView
          username={
            Array.isArray(router.query.username)
              ? router.query.username[0]
              : router.query.username
          }
        />
      </div>
    </div>
  )
}

export default ChatViewPage
