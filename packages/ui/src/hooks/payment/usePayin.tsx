import { PayinDto } from "@passes/api-client"
import useSWR, { useSWRConfig } from "swr"

const CACHE_KEY_PAYIN = "/payin"

export const usePayin = (payinId: string) => {
  const { data: payin } = useSWR(
    payinId ? [CACHE_KEY_PAYIN, payinId] : null,
    async () => null
  )

  const { mutate: _mutateManual } = useSWRConfig()
  const mutateManual = (update: Partial<PayinDto>) =>
    _mutateManual([CACHE_KEY_PAYIN, payinId], update, {
      populateCache: (
        update: Partial<PayinDto>,
        original: PayinDto | undefined
      ) => {
        return { ...original, ...update }
      },
      revalidate: false
    })

  return {
    payin,
    update: mutateManual
  }
}
