import { ListDto } from "@passes/api-client"
import useSWR, { useSWRConfig } from "swr"

const CACHE_KEY_LIST = "/list"

export const useList = (listId: string) => {
  const { data: list } = useSWR(
    listId ? [CACHE_KEY_LIST, listId] : null,
    async () => null
  )

  const { mutate: _mutateManual } = useSWRConfig()
  const mutateManual = (update: Partial<ListDto>) =>
    _mutateManual([CACHE_KEY_LIST, listId], update, {
      populateCache: (
        update: Partial<ListDto>,
        original: ListDto | undefined
      ) => {
        return { ...original, ...update }
      },
      revalidate: false
    })

  return {
    list,
    update: mutateManual
  }
}
