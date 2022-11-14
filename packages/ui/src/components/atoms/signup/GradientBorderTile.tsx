import { FC, PropsWithChildren } from "react"

export const GradientBorderTile: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="relative h-[135px] w-[135px] select-none overflow-hidden rounded-[15px] bg-[linear-gradient(to_right_bottom,#F2BD6C,#BD499B,#A359D5)]">
      <div className="absolute inset-[1px] rounded-[15px] bg-[#12070E] backdrop-blur-[36px]">
        {children}
      </div>
    </div>
  )
}
