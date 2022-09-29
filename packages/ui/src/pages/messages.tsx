import dynamic from "next/dynamic"
import { useRouter } from "next/router"
import { useState } from "react"
import { DirectMessage } from "src/components/organisms"
import { withPageLayout } from "src/layout/WithPageLayout"

const MessagesComponent = dynamic(() => import("src/components/messages"))

// TODO: @Jonathan this component re-renders messages too many times
const Messages = () => {
  const router = useRouter()

  const { contentIds: _contentIds } = router.query
  let contentIds = [""]
  if (_contentIds) {
    if (typeof _contentIds === "string") contentIds = [_contentIds]
    else contentIds = _contentIds
  }
  const [newMessage, setNewMessage] = useState(true)

  return (
    <>
      {newMessage ? (
        <DirectMessage
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          vaultContentIds={contentIds}
        />
      ) : (
        <MessagesComponent username="" />
      )}
    </>
  )
}

export default withPageLayout(Messages, { header: false })
