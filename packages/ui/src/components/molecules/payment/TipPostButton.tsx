import React, { FC } from "react"

import { Button } from "src/components/atoms/button/Button"

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
    <div className="flex w-full flex-row justify-end">
      <Button
        big
        className="mt-4"
        disabled={isDisabled}
        fontSize={16}
        onClick={onClick}
        variant="pink"
      >
        {isLoading ? "Loading..." : "Send Tip"}
      </Button>
    </div>
  )
}
