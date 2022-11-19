import {
  GetPassesRequestDtoOrderEnum,
  GetPassesRequestDtoOrderTypeEnum,
  PassApi,
  PassDto
} from "@passes/api-client"
import { useMemo } from "react"

import { useSearch } from "src/hooks/search/useSearch"

export const usePassesSearch = (creatorId?: string) => {
  const api = useMemo(() => new PassApi(), [])

  return useSearch<PassDto>(
    async (searchValue: string) => {
      return (
        await api.getCreatorPasses({
          getPassesRequestDto: {
            creatorId,
            search: searchValue,
            orderType: GetPassesRequestDtoOrderTypeEnum.CreatedAt,
            order: GetPassesRequestDtoOrderEnum.Desc
          }
        })
      ).data
    },
    [creatorId]
  )
}
