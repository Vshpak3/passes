import React, { FC } from "react"

interface IGradientBorderTile {
  children?: React.ReactNode
}

const GradientBorderTile: FC<IGradientBorderTile> = ({ children }) => {
  return (
    <div className="relative h-32 w-32 select-none overflow-hidden rounded-[15px] bg-[linear-gradient(to_right_bottom,#F2BD6C,#BD499B,#A359D5)] xl:h-[135px] xl:w-[135px]">
      <div className="absolute inset-px rounded-[15px] bg-[#1B141D] backdrop-blur-[36px]">
        {children}
      </div>
    </div>
  )
}

export default GradientBorderTile
