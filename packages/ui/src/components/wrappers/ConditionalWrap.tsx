import { createElement, FC, ReactNode } from "react"

export interface ConditionalWrapProps {
  if?: boolean
  wrapper: typeof createElement.arguments[0]
  wrapperProps: typeof createElement.arguments[1]
  children: NonNullable<ReactNode>
}

const ConditionalWrap: FC<ConditionalWrapProps> = ({
  if: condition,
  wrapper,
  wrapperProps,
  children
}) => {
  if (condition) {
    return createElement(wrapper, wrapperProps, [children])
  }

  return <>{children}</>
}

export default ConditionalWrap
