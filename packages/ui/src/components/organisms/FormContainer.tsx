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
        className,
        "flex flex-grow flex-col items-stretch gap-4 border-y-[0.5px] border-gray-600 bg-[#1b141d]/50 px-10 py-5 md:min-h-[400px] md:px-5 md:pt-5"
      )}
    >
      {children}
    </div>
  )
}
