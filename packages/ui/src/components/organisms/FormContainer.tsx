import classNames from "classnames"
import React from "react"

interface IFormContainer {
  children: React.ReactNode
  className?: string
}

const FormContainer = ({ children, className = "" }: IFormContainer) => {
  // items-center -> items-start
  return (
    <div
      className={classNames(
        className,
        "flex flex-grow flex-col items-stretch gap-4 bg-[#1b141d]/50 px-10 py-5 md:max-h-[700px] md:min-h-[400px] md:rounded-[20px] md:border md:border-[#ffffff]/10 md:px-5 md:pt-5 md:backdrop-blur-[100px]"
      )}
    >
      {children}
    </div>
  )
}

export default FormContainer
