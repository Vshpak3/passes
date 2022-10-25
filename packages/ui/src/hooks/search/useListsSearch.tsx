import {
  GetListsRequestsDtoOrderEnum,
  GetListsRequestsDtoOrderTypeEnum,
  ListApi,
  ListDto
} from "@passes/api-client"
import { useMemo } from "react"

import { useSearch } from "src/hooks/search/useSearch"

export const useListsSearch = (creatorId?: string) => {
  const api = useMemo(() => new ListApi(), [])

  return useSearch<ListDto>(
    async (searchValue: string) => {
      return (
        await api.getLists({
          getListsRequestsDto: {
            search: searchValue,
            order: GetListsRequestsDtoOrderEnum.Asc,
            orderType: GetListsRequestsDtoOrderTypeEnum.Name
          }
        })
      ).data
    },
    [creatorId]
  )
}
