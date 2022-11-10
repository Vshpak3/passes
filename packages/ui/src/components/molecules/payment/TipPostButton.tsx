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
    <Button
      big
      disabled={isDisabled || isLoading}
      fontSize={16}
      onClick={onClick}
      variant="pink"
    >
      {isLoading ? "Loading..." : "Send Tip"}
    </Button>
  )
}
