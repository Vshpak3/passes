import classNames from "classnames"
import { useRouter } from "next/router"
import { FC, useCallback, useMemo } from "react"

import { SearchResultOption } from "src/components/atoms/search/user/UserSearchResults"
import { SearchBar } from "src/components/molecules/SearchBar"
import { AuthWrapper } from "src/components/wrappers/AuthWrapper"
import { useCreatorSearch } from "src/hooks/search/useCreatorSearch"

interface CreatorSearchBarProps {
  isDesktop?: boolean
}

export const CreatorSearchBar: FC<CreatorSearchBarProps> = ({
  isDesktop = true
}) => {
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
        <SearchResultOption
          key={result.userId}
          {...result}
          onSelect={() => goToProfile(result.username)}
        />
      )),
    [results, goToProfile]
  )

  return (
    <AuthWrapper>
      <div
        className={classNames(
          isDesktop ? "hidden md:flex" : "mr-2 flex-grow",
          "items-center justify-end md:flex"
        )}
      >
        <div className="mr-[40px] box-border w-full xs:max-w-[360px]">
          <SearchBar
            options={searchOptions}
            loading={loading}
            searchValue={searchValue}
            onInputChange={onChangeInput}
            placeholder="Find creator"
            emptyText="creators"
            isDesktop={isDesktop}
          />
        </div>
      </div>
    </AuthWrapper>
  )
}
