import {
  FollowApi,
  ListMemberDto,
  SearchFollowRequestDtoOrderEnum,
  SearchFollowRequestDtoOrderTypeEnum
} from "@passes/api-client"
import { useMemo } from "react"

import { useSearch } from "src/hooks/search/useSearch"

export const useFollowSearch = () => {
  const api = useMemo(() => new FollowApi(), [])

  return useSearch<ListMemberDto>(async (searchValue: string) => {
    return (
      await api.searchFollowing({
        searchFollowRequestDto: {
          search: searchValue,
          order: SearchFollowRequestDtoOrderEnum.Asc,
          orderType: SearchFollowRequestDtoOrderTypeEnum.Username
        }
      })
    ).data
  })
}
