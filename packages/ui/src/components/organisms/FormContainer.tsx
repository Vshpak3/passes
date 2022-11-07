import classNames from "classnames"
import React, { FC, PropsWithChildren } from "react"

interface FormContainerProps {
  className?: string
}

export const FormContainer: FC<PropsWithChildren<FormContainerProps>> = ({
  children,
  className = ""
}) => {
  // items-center -> items-start
  return (
    <div
      className={classNames(
        "flex flex-grow flex-col items-stretch gap-4 border-y-[0.5px] border-gray-600 bg-[#1b141d]/50 px-5 py-5 sm:px-10 md:min-h-[400px] md:px-10 md:pt-5 lg:px-5",
        className
      )}
    >
      {children}
    </div>
  )
}
