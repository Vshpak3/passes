import React, { ReactNode } from "react"

interface Props {
  children: ReactNode
}

export const SectionTitle = ({ children }: Props) => {
  return <span className="my-4 ml-4 flex text-xl font-bold">{children}</span>
}
