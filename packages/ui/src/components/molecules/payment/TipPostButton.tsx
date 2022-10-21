import classNames from "classnames"
import React, { FC } from "react"

interface TipPostButton {
  isDisabled?: boolean
  isLoading?: boolean
  onClick?: () => void
}

export const TipPostButton: FC<TipPostButton> = ({
  isDisabled = false,
  isLoading = false,
  onClick
}) => {
  return (
    <button
      disabled={isDisabled}
      onClick={onClick}
      className={classNames(
        isDisabled
          ? "flex w-full items-center justify-center rounded-full border border-solid border-passes-pink-100 bg-passes-pink-100 py-[10px] text-base font-semibold text-white opacity-[0.40]"
          : "flex w-full items-center justify-center rounded-full border border-solid border-passes-pink-100 bg-passes-pink-100 py-[10px] text-base font-semibold text-white"
      )}
      type="submit"
    >
      {isLoading ? "Loading..." : "Tip post"}
    </button>
  )
}
