import { useRouter } from "next/router"
import { FC, useCallback, useMemo } from "react"

import { UserSearchResultOption } from "src/components/atoms/search/user/UserSearchResultOption"
import { SearchBar } from "src/components/molecules/SearchBar"
import { AuthWrapper } from "src/components/wrappers/AuthWrapper"
import { useCreatorSearch } from "src/hooks/search/useCreatorSearch"

export const CreatorSearchBar: FC = () => {
  const { push } = useRouter()
  const { results, loading, searchValue, onChangeInput, setSearchValue } =
    useCreatorSearch()

  const goToProfile = useCallback(
    (username: string) => {
      setSearchValue("")
      push(`/${username}`)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const searchOptions = useMemo(
    () =>
      results.map((result) => (
        <UserSearchResultOption key={result.userId} {...result} />
      )),
    [results]
  )

  return (
    <AuthWrapper>
      <div className="flex w-full min-w-[100%] items-center xl:min-w-[340px]">
        <SearchBar
          contentName="creators"
          loading={loading}
          onInputChange={onChangeInput}
          onSelect={goToProfile}
          options={searchOptions}
          searchValue={searchValue}
        />
      </div>
    </AuthWrapper>
  )
}
