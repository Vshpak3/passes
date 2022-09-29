import { MessageDto } from "@passes/api-client"
import classNames from "classnames"
import React from "react"

import { Avatar, Content } from "./index"

interface Props {
  isOwnMessage?: boolean
  message?: MessageDto
}
export const ChannelMessage = ({ message, isOwnMessage = false }: Props) => {
  return (
    <div
      className={classNames(
        "m-4 flex max-w-[70%] rounded",
        isOwnMessage && "flex-row-reverse self-end"
      )}
    >
      {!isOwnMessage && (
        <div className="flex w-[35%] items-end">
          <Avatar imageSrc="https://www.w3schools.com/w3images/avatar1.png" />
        </div>
      )}
      <div className="mx-4 flex flex-col items-end">
        <div className="rounded border border-[#363037] bg-[#1E1820] py-3 px-4">
          <span>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit.
            Perspiciatis nulla itaque nesciunt nemo amet beatae aliquid
            incidunt, eligendi consectetur tempore voluptatem dolorem!
            Voluptatum quibusdam nesciunt non aperiam nemo nam aliquid.
          </span>
          <Content />
        </div>
        {isOwnMessage && message?.pending && (
          <span className="text-md mt-2 text-gray-500">Pending...</span>
        )}
      </div>
    </div>
  )
}
