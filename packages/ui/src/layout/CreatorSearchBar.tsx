import classNames from "classnames"
import { useRouter } from "next/router"
import { FC, useCallback } from "react"
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
  const { results, searchValue, onChangeInput, setSearchValue } =
    useCreatorSearch()

  const goToProfile = useCallback(
    (username: string) => {
      setSearchValue("")
      push(`/${username}`)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  return (
    <AuthWrapper>
      <div
        className={classNames(
          isDesktop ? "hidden md:flex" : "mr-2 flex-grow",
          "items-center justify-end md:flex"
        )}
      >
        <SearchBar
          isDesktop={isDesktop}
          searchValue={searchValue}
          onSelect={(creator: string) => goToProfile(creator)}
          onChange={onChangeInput}
          placeholder="Find creator"
          emptyText="creators"
          results={results}
        />
      </div>
    </AuthWrapper>
  )
}
