import {
  FollowApi,
  ListMemberDto,
  SearchFollowRequestDtoOrderEnum,
  SearchFollowRequestDtoOrderTypeEnum
} from "@passes/api-client"
import { useMemo } from "react"

import { useSearch } from "./useSearch"

export const useFollowerSearch = () => {
  const api = useMemo(() => new FollowApi(), [])

  return useSearch<ListMemberDto>(async (searchValue: string) => {
    return (
      await api.searchFans({
        searchFollowRequestDto: {
          search: searchValue,
          order: SearchFollowRequestDtoOrderEnum.Asc,
          orderType: SearchFollowRequestDtoOrderTypeEnum.Username
        }
      })
    ).data
  })
}
