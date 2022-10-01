import { createElement, FC, PropsWithChildren } from "react"

export interface ConditionalWrapProps {
  if?: boolean
  wrapper: typeof createElement.arguments[0]
  wrapperProps?: typeof createElement.arguments[1]
}

const ConditionalWrap: FC<PropsWithChildren<ConditionalWrapProps>> = ({
  children,
  if: condition,
  wrapper,
  wrapperProps
}) => {
  if (condition) {
    return createElement(wrapper, wrapperProps, [children])
  }

  return <>{children}</>
}

export default ConditionalWrap
