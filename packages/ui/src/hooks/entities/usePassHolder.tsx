import { PassHolderDto } from "@passes/api-client"
import useSWR, { useSWRConfig } from "swr"

export const CACHE_KEY_PASS_HOLDER = "/passholder"

export const usePassHolder = (passHolderId: string) => {
  const { data: passHolder } = useSWR(
    passHolderId ? [CACHE_KEY_PASS_HOLDER, passHolderId] : null,
    async () => null
  )

  const { mutate: _mutateManual } = useSWRConfig()
  const mutateManual = (update: Partial<PassHolderDto>) =>
    _mutateManual([CACHE_KEY_PASS_HOLDER, passHolderId], update, {
      populateCache: (
        update: Partial<PassHolderDto>,
        original: PassHolderDto | undefined
      ) => {
        return { ...original, ...update }
      },
      revalidate: false
    })

  return {
    passHolder,
    update: mutateManual
  }
}
