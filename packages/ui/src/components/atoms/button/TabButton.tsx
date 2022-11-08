import classNames from "classnames"
import { FC } from "react"

interface TabButtonProps {
  className?: string
  onClick: () => void
  active: boolean
  label: string
}

export const TabButton: FC<TabButtonProps> = ({
  onClick,
  active,
  className = "",
  label
}) => (
  <button
    className={classNames(
      className,
      "rounded-[56px] bg-[#191919] !py-[10px] !px-[30px] font-bold text-white",
      { "bg-[#EDEDED] !text-[#000]": active }
    )}
    onClick={onClick}
  >
    {label}
  </button>
)
