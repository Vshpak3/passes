import { PayinDto } from "@passes/api-client"
import { FC, useEffect } from "react"

import { usePayin } from "src/hooks/payment/usePayin"
import { Payin } from "./Payin"

export interface PayinCachedProps {
  payin: PayinDto
  ownsPost: boolean
  decrementNumPayins: () => void
}

export const PayinCached: FC<PayinCachedProps> = ({
  payin,
  ...res
}: PayinCachedProps) => {
  const { payin: cachedPayin, update } = usePayin(payin.payinId)
  useEffect(() => {
    if (!cachedPayin) {
      update(payin)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cachedPayin])

  return <Payin payin={cachedPayin ?? payin} {...res} update={update} />
}
