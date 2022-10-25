import { UserApi, UserDisplayInfoDto } from "@passes/api-client"
import { useMemo } from "react"

import { useSearch } from "src/hooks/search/useSearch"

export const useCreatorSearch = () => {
  const api = useMemo(() => new UserApi(), [])

  return useSearch<UserDisplayInfoDto>(async (searchValue: string) => {
    return (
      await api.searchCreator({
        searchCreatorRequestDto: { query: searchValue }
      })
    ).creators
  })
}
