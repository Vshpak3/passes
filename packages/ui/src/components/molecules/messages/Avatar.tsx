import React from "react"

interface Props {
  imageSrc: string
  isOnline?: boolean
}

export const Avatar = ({ imageSrc, isOnline = true }: Props) => {
  return (
    <div className="item-center relative flex pr-[10px]">
      {isOnline && (
        <span className="bg-green absolute top-0.5 right-2 h-[15px] w-[15px] rounded-full bg-[#7AF086]" />
      )}
      <img
        width="50px"
        height="50px"
        className="rounded-full"
        src={imageSrc}
        alt="ProfilePhoto"
      />
    </div>
  )
}
