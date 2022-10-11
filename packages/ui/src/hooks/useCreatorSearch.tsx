import { UserApi, UserDisplayInfoDto } from "@passes/api-client"
import { useSearch } from "src/hooks/useSearch"

const api = new UserApi()

export const useCreatorSearch = () =>
  useSearch<UserDisplayInfoDto>(async (searchValue: string) => {
    return (
      await api.searchCreatorByUsername({
        searchCreatorRequestDto: { query: searchValue }
      })
    ).creators
  })
