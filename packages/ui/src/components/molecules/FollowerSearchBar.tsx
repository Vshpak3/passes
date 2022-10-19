import { useFollowSearch } from "src/hooks/search/useFollowSearch"

import { SearchBar } from "./SearchBar"

interface FollowerSearchBarProps {
  onSelect: (userId: string) => Promise<void>
}

export const FollowerSearchBar: React.FC<FollowerSearchBarProps> = ({
  onSelect
}) => {
  const { results, searchValue, onChangeInput } = useFollowSearch()

  return (
    <SearchBar
      searchValue={searchValue}
      results={results}
      onSelect={onSelect}
      onChange={onChangeInput}
      placeholder="Add followers"
      emptyText="following"
    />
  )
}
