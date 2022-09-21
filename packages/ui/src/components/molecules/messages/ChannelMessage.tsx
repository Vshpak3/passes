import classNames from "classnames"
import React from "react"

export const ChannelMessage = ({ isOwnMessage = false }) => {
  return (
    <div
      className={classNames(
        "m-4 flex max-w-[70%] rounded",
        isOwnMessage && "flex-row-reverse self-end"
      )}
    >
      {!isOwnMessage && (
        <div className="flex w-[100px] items-end">
          <img // eslint-disable-line @next/next/no-img-element
            className="h-[40px] w-[40px] rounded-full"
            src="https://www.w3schools.com/w3images/avatar1.png"
            alt="Profile picture"
          />
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
