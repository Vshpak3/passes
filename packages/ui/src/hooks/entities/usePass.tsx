import { PassApi, PassDto } from "@passes/api-client"
import useSWR, { useSWRConfig } from "swr"

export const CACHE_KEY_PASS = "/pass"

const api = new PassApi()

export type PassWithStatusDto = PassDto & { paying?: boolean }

export const usePass = (passId: string) => {
  const { data: pass, mutate } = useSWR<PassWithStatusDto>(
    passId ? [CACHE_KEY_PASS, passId] : null,
    async () => {
      return {
        ...(await api.getPass({
          getPassRequestDto: { passId }
        }))
      }
    }
  )

  const { mutate: _mutateManual } = useSWRConfig()

  const mutateManual = (update: Partial<PassWithStatusDto>) =>
    _mutateManual([CACHE_KEY_PASS, passId], update, {
      populateCache: (
        update: Partial<PassWithStatusDto>,
        original: PassWithStatusDto | undefined
      ) => {
        return { ...original, ...update }
      },
      revalidate: false
    })

  const checkPurchasingPass = async () => {
    mutateManual({
      paying: (await api.checkPurchasingPass({ getPassRequestDto: { passId } }))
        .value
    })
  }

  return {
    pass,
    update: mutateManual,
    checkPurchasingPass,
    mutate
  }
}
