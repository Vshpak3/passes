import classNames from "classnames"
import { useRouter } from "next/router"
import { FC, useCallback, useMemo } from "react"

import { UserSearchResultOption } from "src/components/atoms/search/user/UserSearchResultOption"
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
        <UserSearchResultOption key={result.userId} {...result} />
      )),
    [results]
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
            contentName="creators"
            loading={loading}
            onInputChange={onChangeInput}
            onSelect={goToProfile}
            options={searchOptions}
            searchValue={searchValue}
          />
        </div>
      </div>
    </AuthWrapper>
  )
}
