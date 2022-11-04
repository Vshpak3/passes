import React, { FC } from "react"

import { Button } from "src/components/atoms/Button"

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
    <Button
      className="mt-4"
      disabled={isDisabled}
      onClick={onClick}
      variant="pink"
    >
      {isLoading ? "Loading..." : "Send Tip"}
    </Button>
  )
}
