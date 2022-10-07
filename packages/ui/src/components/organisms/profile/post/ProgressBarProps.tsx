import { FC } from "react"

interface ProgressBarProps {
  progressPercentage: any
}

export const ProgressBar: FC<ProgressBarProps> = ({ progressPercentage }) => {
  return (
    <div className="h-[3px] w-full overflow-hidden rounded-[6px] bg-[#FFFFFF]">
      <div
        style={{ width: `${progressPercentage}%` }}
        className="h-full bg-[#EE53C3] "
      ></div>
    </div>
  )
}
