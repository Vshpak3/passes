import { ChannelMemberDto } from "@passes/api-client/models"
import classNames from "classnames"
import React, { FC } from "react"

import { Avatar } from "./Avatar"

interface Props {
  onClick: () => void
  channel: ChannelMemberDto
  isSelected?: boolean
}

export const ChannelListItem: FC<Props> = ({
  onClick,
  channel,
  isSelected
}) => {
  return (
    <div
      onClick={onClick}
      className={classNames(
        "m-3 flex cursor-pointer items-center rounded-md py-[7px] px-[10px] hover:bg-[#ffffff]/10",
        isSelected && "bg-[#ffffff]/10"
      )}
    >
      <div className="item-center flex pr-[10px]">
        <Avatar imageSrc="https://www.w3schools.com/w3images/avatar1.png" />
      </div>
      <div className="flex flex-col items-start justify-start">
        <span>{channel.otherUserDisplayName || channel.otherUserUsername}</span>
        <span className="text-sm text-gray-400">
          {channel?.mostRecentMessage?.text}
        </span>
      </div>
    </div>
  )
}
