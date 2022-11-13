import { PaidMessageDto } from "@passes/api-client"
import useSWR, { useSWRConfig } from "swr"

const CACHE_KEY_PAID_MESSAGE = "/paid-message"

export const usePaidMessage = (paidMessageId: string) => {
  const { data: paidMessage } = useSWR(
    paidMessageId ? [CACHE_KEY_PAID_MESSAGE, paidMessageId] : null,
    async () => null
  )

  const { mutate: _mutateManual } = useSWRConfig()
  const mutateManual = (update: Partial<PaidMessageDto>) =>
    _mutateManual([CACHE_KEY_PAID_MESSAGE, paidMessageId], update, {
      populateCache: (
        update: Partial<PaidMessageDto>,
        original: PaidMessageDto | undefined
      ) => {
        return { ...original, ...update }
      },
      revalidate: false
    })

  return {
    paidMessage,
    update: mutateManual
  }
}
