import { FC, useMemo } from "react"

import { UserSearchResultOption } from "src/components/atoms/search/user/UserSearchResultOption"
import { useFollowSearch } from "src/hooks/search/useFollowSearch"
import { SearchBar } from "./SearchBar"

interface FollowerSearchBarProps {
  onSelect: (userId: string) => void
}

// Might be used in the future
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const FollowerSearchBar: FC<FollowerSearchBarProps> = ({ onSelect }) => {
  const { results, searchValue, loading, onChangeInput } = useFollowSearch()

  // TODO: Implement correct options
  const searchOptions = useMemo(
    () =>
      results.map((result) => (
        <UserSearchResultOption key={result.userId} {...result} />
      )),
    [results]
  )

  return (
    <SearchBar
      searchValue={searchValue}
      loading={loading}
      options={searchOptions}
      onSelect={onSelect}
      onInputChange={onChangeInput}
      contentName="followers"
    />
  )
}
