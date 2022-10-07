import classNames from "classnames"
import React, { FC, PropsWithChildren } from "react"

interface IFormContainer {
  className?: string
}

const FormContainer: FC<PropsWithChildren<IFormContainer>> = ({
  children,
  className = ""
}) => {
  // items-center -> items-start
  return (
    <div
      className={classNames(
        className,
        "flex flex-grow flex-col items-stretch gap-4 bg-[#1b141d]/50 px-10 py-5 md:min-h-[400px] md:rounded-[20px] md:border md:border-[#ffffff]/10 md:px-5 md:pt-5"
      )}
    >
      {children}
    </div>
  )
}

export default FormContainer
