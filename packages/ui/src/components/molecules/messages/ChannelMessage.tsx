import classNames from "classnames"
import React from "react"

import { Avatar } from "./index"

export const ChannelMessage = ({ isOwnMessage = false }) => {
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
      <div className="mx-4 rounded border border-[#363037] bg-[#1E1820] p-2">
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Perspiciatis
        nulla itaque nesciunt nemo amet beatae aliquid incidunt, eligendi
        consectetur tempore voluptatem dolorem! Voluptatum quibusdam nesciunt
        non aperiam nemo nam aliquid.
      </div>
    </div>
  )
}
