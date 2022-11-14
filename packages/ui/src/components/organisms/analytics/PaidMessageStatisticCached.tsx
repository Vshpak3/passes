import { PaidMessageDto } from "@passes/api-client"
import { FC, useEffect } from "react"

import { usePaidMessage } from "src/hooks/entities/usePaidMessage"
import { PaidMessageStatistic } from "./PaidMessageStatistic"

export interface PaidMessageStatisticCachedProps {
  paidMessage: PaidMessageDto
}

export const PaidMessageStatisticCached: FC<
  PaidMessageStatisticCachedProps
> = ({ paidMessage, ...res }: PaidMessageStatisticCachedProps) => {
  const { paidMessage: cachedPaidMessage, update } = usePaidMessage(
    paidMessage.paidMessageId
  )

  useEffect(() => {
    if (!cachedPaidMessage) {
      update(paidMessage)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paidMessage])

  return (
    <PaidMessageStatistic
      paidMessage={cachedPaidMessage ?? paidMessage}
      {...res}
      update={update}
    />
  )
}
