import { useRouter } from "next/router"
import { useState } from "react"
import MessagesComponent from "src/components/messages"
import { DirectMessage } from "src/components/organisms"
import { withPageLayout } from "src/layout/WithPageLayout"

// import AuthOnlyWrapper from "../components/wrappers/AuthOnly"
// TODO: @Jonathan this component re-renders messages too many times
const Messages = () => {
  const router = useRouter()

  const { contentIds: _contentIds } = router.query
  let contentIds = [""]
  if (_contentIds) {
    if (typeof _contentIds === "string") contentIds = [_contentIds]
    else contentIds = _contentIds
  }
  const [newMessage, setNewMessage] = useState(contentIds?.length > 0)

  return (
    // <AuthOnlyWrapper isPage>
    <>
      {newMessage ? (
        <DirectMessage
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          contentIds={contentIds}
        />
      ) : (
        <MessagesComponent username="" />
      )}
    </>

    // </AuthOnlyWrapper>
  )
}

export default withPageLayout(Messages, { header: false })
