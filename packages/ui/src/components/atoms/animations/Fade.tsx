import classNames from "classnames"
import React, { ReactNode } from "react"

interface Props {
  show: boolean
  children: ReactNode
}

export const Fade = ({ children, show }: Props) => {
  return (
    <div
      className={classNames(
        "transition-opacity delay-75",
        show ? "opacity-100" : "opacity-0"
      )}
    >
      {children}
    </div>
  )
}
