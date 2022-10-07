import { FC, PropsWithChildren } from "react"

interface ConditionRenderingProps {
  condition: boolean
}

const ConditionRendering: FC<PropsWithChildren<ConditionRenderingProps>> = ({
  condition,
  children
}): any => {
  if (condition) {
    return children
  }

  return null
}

export default ConditionRendering
