import React from "react"

import { classNames } from "../../helpers"

interface IFormContainer {
  children: React.ReactNode
  className?: string
}

const FormContainer = ({ children, className = "" }: IFormContainer) => {
  // items-center -> items-start
  return (
    <div
      className={classNames(
        "flex min-h-[360px] flex-grow flex-col items-stretch gap-4 rounded-[20px] bg-[#1b141d]/50 px-2 pt-3 pb-5 backdrop-blur-[100px] md:border md:border-[#ffffff]/10 md:px-5 md:pt-8",
        className
      )}
    >
      {children}
    </div>
  )
}

export default FormContainer
