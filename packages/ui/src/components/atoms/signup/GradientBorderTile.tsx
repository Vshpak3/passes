import classNames from "classnames"
import React, { FC, PropsWithChildren } from "react"

interface GradientBorderTileProps {
  className?: string
  innerClass?: string
}

export const GradientBorderTile: FC<
  PropsWithChildren<GradientBorderTileProps>
> = ({ children, className, innerClass }) => {
  return (
    <div
      className={classNames(
        "relative h-32 h-[135px] w-32 w-[135px] select-none overflow-hidden rounded-[15px] bg-[linear-gradient(to_right_bottom,#F2BD6C,#BD499B,#A359D5)]",
        className
      )}
    >
      <div
        className={classNames(
          "absolute inset-px rounded-[15px] bg-[#12070E] backdrop-blur-[36px]",
          innerClass
        )}
      >
        {children}
      </div>
    </div>
  )
}
