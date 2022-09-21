import React from "react"

import { ChannelList, ChannelView } from "../molecules/messages"

const mockedChannels = [
  { displayName: "Anna DeGuzman", messagePreview: "You: Hey back!..", id: "1" },
  { displayName: "user2938293", messagePreview: "You: Hey back!..", id: "2" },
  { displayName: "Kianna Press", messagePreview: "You: Hey back!..", id: "3" },
  {
    displayName: "Marilyn George",
    messagePreview: "You: Hey back!..",
    id: "4"
  },
  { displayName: "Rayna Calzoni", messagePreview: "You: Hey back!..", id: "5" },
  { displayName: "Kianna Culhane", messagePreview: "You: Hey back!..", id: "6" }
]
const MessagesV2 = () => {
  return (
    <div className="flex h-full flex-row border border-gray-800">
      <ChannelList channels={mockedChannels} />
      <ChannelView />
    </div>
  )
}

export default MessagesV2
