import React from "react"

import { Avatar } from "./index"

export const ChannelHeader = () => {
  return (
    <div className="flex flex-row items-center bg-[#1a141c] px-5 py-4">
      <Avatar imageSrc="https://www.w3schools.com/w3images/avatar1.png" />
      <span className="text-brand-600 pl-2">Anna DeGuzman</span>
    </div>
  )
}
