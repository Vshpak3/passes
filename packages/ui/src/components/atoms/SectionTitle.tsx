import classNames from "classnames"
import { FC, PropsWithChildren } from "react"

interface SectionTitleProps {
  className?: string
}

export const SectionTitle: FC<PropsWithChildren<SectionTitleProps>> = ({
  children,
  className
}) => {
  return (
    <h2 className={classNames("my-4 flex text-xl font-bold", className)}>
      {children}
    </h2>
  )
}
