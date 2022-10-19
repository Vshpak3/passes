import classNames from "classnames"
import { useRouter } from "next/router"
import { FC, useCallback, useMemo } from "react"
import { SearchBar } from "src/components/molecules/SearchBar"
import { AuthWrapper } from "src/components/wrappers/AuthWrapper"
import { useCreatorSearch } from "src/hooks/useCreatorSearch"

const MAX_RESULTS_MOBILE = 5

export interface CreatorSearchBarProps {
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

  const truncatedResults = useMemo(
    () => (isDesktop ? results : results.slice(0, MAX_RESULTS_MOBILE)),
    [isDesktop, results]
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
          emptyText="Try searching for creators."
          results={truncatedResults}
        />
      </div>
    </AuthWrapper>
  )
}
