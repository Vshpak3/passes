import { UserApi, UserDisplayInfoDto } from "@passes/api-client"
import { useSearch } from "src/hooks"

const api = new UserApi()

const useCreatorSearch = () =>
  useSearch<UserDisplayInfoDto>(async (searchValue: string) => {
    return (
      await api.searchCreatorByUsername({
        searchCreatorRequestDto: { query: searchValue }
      })
    ).creators
  })

export default useCreatorSearch
