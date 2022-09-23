import React from "react"

interface Props {
  imageSrc: string
}

export const Avatar = ({ imageSrc }: Props) => {
  return (
    <div className="item-center flex pr-[10px]">
      <img // eslint-disable-line @next/next/no-img-element
        width="50px"
        height="50px"
        className="rounded-full"
        src={imageSrc}
        alt="ProfilePhoto"
      />
    </div>
  )
}
