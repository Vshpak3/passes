import React, { ReactNode } from "react"

type PropsType = {
  children: ReactNode
}

export const ModalOverlay = ({ children }: PropsType) => {
  return (
    <div className="bg-[rgba(0, 0, 0, 0.5)] fixed top-0 left-0 flex h-full w-full items-center justify-center">
      {children}
    </div>
  )
}
