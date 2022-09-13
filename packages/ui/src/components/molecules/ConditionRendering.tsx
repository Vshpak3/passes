import { FC, ReactNode } from "react"

const ConditionRendering: FC<{ condition: boolean; children: ReactNode }> = ({
  condition,
  children
}): any => {
  if (condition) {
    return children
  }

  return null
}

export default ConditionRendering
