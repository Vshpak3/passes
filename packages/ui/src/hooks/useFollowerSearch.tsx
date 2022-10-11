import { FollowApi, ListMemberDto } from "@passes/api-client"
import { useMemo } from "react"

import useSearch from "./useSearch"

const useFollowerSearch = () => {
  const api = useMemo(() => new FollowApi(), [])
  return useSearch<ListMemberDto>(async (searchValue: string) => {
    return (
      await api.searchFans({
        searchFollowRequestDto: {
          search: searchValue ? searchValue : undefined,
          order: "asc",
          orderType: "username"
        }
      })
    ).data
  })
}

export default useFollowerSearch
