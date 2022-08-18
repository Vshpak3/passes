import React from "react"

type CssTileProps = {
  fill: boolean
}

const CssTile = ({ fill }: CssTileProps) => {
  return (
    <div
      className={`h-[122px] w-[130px] rounded-[20px] border border-[#a8c9ff] ${
        fill ? "bg-[#a8c9ff]" : ""
      } opacity-60`}
    />
  )
}

export default CssTile
