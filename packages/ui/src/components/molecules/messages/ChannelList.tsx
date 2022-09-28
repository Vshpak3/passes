import React from "react"
import InfiniteScroll from "react-infinite-scroll-component"

import { Channel } from "./ChannelListItem"
import { ChannelSearchInput } from "./ChannelSearchInput"
import { ChannelListItem } from "./index"

export type Users = {
  name: string
  id: number
  online: boolean
  imageUrl: string
}

interface Props {
  selectedChannelId: string
  channels: Array<Channel>
  onChannelClicked: (channelId: string) => void
  hasMore: boolean
  next: () => void
}

const users = [
  {
    id: 1,
    name: "Leslie Alexander",
    online: true,
    imageUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  },
  {
    id: 2,
    name: "Zoya Ramzanli",
    online: false,
    imageUrl:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  },
  {
    id: 3,
    name: "Kelmend Tairi",
    online: true,
    imageUrl:
      "https://images.unsplash.com/photo-1517365830460-955ce3ccd263?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  },
  {
    id: 4,
    name: "Berat Salija",
    online: false,
    imageUrl:
      "https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  },
  {
    id: 5,
    name: "John Wick",
    online: true,
    imageUrl:
      "https://images.unsplash.com/photo-1505840717430-882ce147ef2d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  },
  {
    id: 6,
    name: "Iron Man",
    online: false,
    imageUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  }

  // More users...
]
export const ChannelList = ({
  selectedChannelId,
  channels,
  onChannelClicked,
  hasMore,
  next
}: Props) => {
  return (
    <div className="min-w-[20vw] border-r border-gray-800">
      <div className="px-[10px] py-[7px]">
        <ChannelSearchInput users={users} />
      </div>
      <InfiniteScroll
        dataLength={channels.length}
        next={next}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>} // TODO: loader
      >
        {channels.map((channel, index) => (
          <ChannelListItem
            onClick={() => {
              onChannelClicked(channel.channelId as string)
            }}
            channel={channel}
            key={index}
            isSelected={selectedChannelId === channel.channelId}
          />
        ))}
      </InfiniteScroll>
    </div>
  )
}
