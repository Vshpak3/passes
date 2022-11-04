import classNames from "classnames"
import React, { ReactNode } from "react"

interface Props {
  children: ReactNode
  className?: string
}

export const SectionTitle = ({ children, className }: Props) => {
  return (
    <span className={classNames("my-4 flex text-xl font-bold", className)}>
      {children}
    </span>
  )
}
