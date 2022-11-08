import classNames from "classnames"
import { FC } from "react"

import { ButtonTypeEnum } from "./Button"

interface GenericButtonProps {
  name: string
  onClick?: () => void
  type?: ButtonTypeEnum
  className?: string
  isDisabled?: boolean
}

export const PassesPinkButton: FC<GenericButtonProps> = ({
  type,
  name,
  onClick,
  className = "",
  isDisabled = false
}) => {
  return (
    <button
      className={classNames(
        isDisabled && "opacity-[0.40]",
        "flex w-full items-center justify-center rounded-lg border border-solid border-passes-pink-100 bg-passes-pink-100 py-[10px] text-base font-semibold text-white",
        className
      )}
      disabled={isDisabled}
      onClick={onClick}
      type={type}
    >
      {name}
    </button>
  )
}
