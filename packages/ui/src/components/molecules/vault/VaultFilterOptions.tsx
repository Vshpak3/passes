import classNames from "classnames"
import { FC } from "react"

interface VaultFilterOptionProps {
  buttonStyle: string
  isActive: boolean
  label: string
  onClick: () => void
}

export const VaultFilterOption: FC<VaultFilterOptionProps> = ({
  buttonStyle,
  isActive,
  label,
  onClick
}) => {
  const buttonClass = classNames(
    isActive ? "bg-[#EDEDED]" : "bg-[#FFFEFF]/10 hover:bg-[#EDEDED]",
    `rounded-[56px] group mr-1 flex h-[32px] min-w-[65px] cursor-pointer place-items-start items-center justify-center ${buttonStyle}`
  )
  const labelClass = classNames(
    isActive ? "text-[#000000]" : "text-white group-hover:text-[#000000]",
    "group cursor-pointer items-center text-center text-xs font-semibold text-white"
  )
  return (
    <span className={buttonClass} onClick={onClick}>
      <div className={labelClass}>{label}</div>
    </span>
  )
}
