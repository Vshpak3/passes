import { PassDto } from "@passes/api-client"
import { FC, useEffect } from "react"

import { usePass } from "src/hooks/entities/usePass"
import { PassCard } from "./PassCard"

export interface PassCardCachedProps {
  pass: PassDto
  isPinnedPass?: boolean
  className?: string
}

export const PassCardCached: FC<PassCardCachedProps> = ({
  pass,
  ...res
}: PassCardCachedProps) => {
  const { pass: cachedPass, update, checkPurchasingPass } = usePass(pass.passId)
  useEffect(() => {
    if (!cachedPass) {
      update(pass)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cachedPass])

  useEffect(() => {
    checkPurchasingPass()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <PassCard pass={cachedPass ?? pass} {...res} paying={cachedPass?.paying} />
  )
}
