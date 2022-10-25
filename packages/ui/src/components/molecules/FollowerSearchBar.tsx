import { FC, useMemo } from "react"

import { SearchResultOption } from "src/components/atoms/search/user/UserSearchResults"
import { useFollowSearch } from "src/hooks/search/useFollowSearch"
import { SearchBar } from "./SearchBar"

interface FollowerSearchBarProps {
  onSelect: (userId: string) => Promise<void>
}

// Might be used in the future
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const FollowerSearchBar: FC<FollowerSearchBarProps> = ({ onSelect }) => {
  const { results, searchValue, onChangeInput } = useFollowSearch()

  // TODO: Implement correct options
  const searchOptions = useMemo(
    () =>
      results.map((result) => (
        <SearchResultOption key={result.userId} {...result} />
      )),
    [results]
  )

  return (
    <SearchBar
      searchValue={searchValue}
      options={searchOptions}
      onSelect={onSelect}
      onInputChange={onChangeInput}
      placeholder="Add followers"
      emptyText="followers"
    />
  )
}
