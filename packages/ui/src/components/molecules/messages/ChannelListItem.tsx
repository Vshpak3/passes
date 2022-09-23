import classNames from "classnames"
import React from "react"

import { Avatar } from "./index"

export interface Channel {
  channelId: string
  messagePreview: string
  displayName: string
}

interface Props {
  onClick: () => void
  channel: Channel
  isSelected?: boolean
}

export const ChannelListItem = ({ onClick, channel, isSelected }: Props) => {
  return (
    <div
      onClick={onClick}
      className={classNames(
        "m-3 flex cursor-pointer items-center rounded-md py-[7px] px-[10px] hover:bg-[#ffffff]/10",
        isSelected && "bg-[#ffffff]/10"
      )}
    >
      <div className="item-center flex pr-[10px]">
        <Avatar
          imageSrc={`https://www.w3schools.com/w3images/avatar${channel.channelId}.png`}
        />
      </div>
      <div className="flex flex-col items-start justify-start">
        <span>{channel.displayName}</span>
        <span className="text-sm text-gray-400">{channel.messagePreview}</span>
      </div>
    </div>
  )
}
