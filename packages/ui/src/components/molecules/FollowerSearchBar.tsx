import { UserDisplayInfoDto } from "@passes/api-client"
import React from "react"
import UserSearchDropdown from "src/components/atoms/search/user/UserSearchDropdown"
import UserSearchInput from "src/components/atoms/search/user/UserSearchInput"
import { useFollowSearch } from "src/hooks"
interface IFollowSearchModal {
  onSelect: (userId: string) => Promise<void>
}

const FollowerSearchBar = ({ onSelect }: IFollowSearchModal) => {
  const {
    results,
    searchValue,
    onChangeInput,
    onSearchFocus,
    resultsVisible,
    searchRef
  } = useFollowSearch()

  return (
    <div ref={searchRef}>
      <UserSearchInput
        onChangeInput={onChangeInput}
        onSearchFocus={onSearchFocus}
        searchValue={searchValue}
        placeholder={"Add followers"}
      />
      {resultsVisible && (
        <UserSearchDropdown
          results={results}
          emptyText={"following"}
          onClick={(userInfo: UserDisplayInfoDto) => {
            onSelect(userInfo.userId)
          }}
        />
      )}
    </div>
  )
}
export default React.memo(FollowerSearchBar)
