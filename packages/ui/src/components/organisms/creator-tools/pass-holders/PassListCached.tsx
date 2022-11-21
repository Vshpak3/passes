import { PassDto } from "@passes/api-client"
import { FC, useEffect } from "react"

import { usePass } from "src/hooks/entities/usePass"
import { PassList } from "./PassList"

export interface PassListCachedProps {
  pass: PassDto
}

export const PassListCached: FC<PassListCachedProps> = ({
  pass,
  ...res
}: PassListCachedProps) => {
  const { pass: cachedPass, update } = usePass(pass.passId)
  useEffect(() => {
    if (!cachedPass) {
      update(pass)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cachedPass])

  return <PassList pass={cachedPass ?? pass} {...res} />
}
