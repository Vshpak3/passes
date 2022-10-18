import { UserApi, UserDisplayInfoDto } from "@passes/api-client"
import { useSearch } from "src/hooks/search/useSearch"

const api = new UserApi()

export const useCreatorSearch = () =>
  useSearch<UserDisplayInfoDto>(async (searchValue: string) => {
    return (
      await api.searchCreator({
        searchCreatorRequestDto: { query: searchValue }
      })
    ).creators
  })
