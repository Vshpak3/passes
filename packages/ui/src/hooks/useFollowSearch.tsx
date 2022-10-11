import { FollowApi, ListMemberDto } from "@passes/api-client"
import { useMemo } from "react"
import { useSearch } from "src/hooks/useSearch"

export const useFollowSearch = () => {
  const api = useMemo(() => new FollowApi(), [])
  return useSearch<ListMemberDto>(async (searchValue: string) => {
    return (
      await api.searchFollowing({
        searchFollowRequestDto: {
          search: searchValue ? searchValue : undefined,
          order: "asc",
          orderType: "username"
        }
      })
    ).data
  })
}
