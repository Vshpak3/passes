import React from "react"
import AuthWrapper from "src/components/wrappers/AuthWrapper"
import { useCreatorSearch } from "src/hooks"

import SearchDropdown from "./SearchDropdown"
import SearchInput from "./SearchInput"

const CreatorSearchBar = () => {
  const {
    creatorResults,
    searchValue,
    onChangeInput,
    onSearchFocus,
    resultsVisible,
    searchRef
  } = useCreatorSearch()

  return (
    <AuthWrapper>
      <div ref={searchRef}>
        <SearchInput
          onChangeInput={onChangeInput}
          onSearchFocus={onSearchFocus}
          searchValue={searchValue}
        />
        {resultsVisible && <SearchDropdown creatorResults={creatorResults} />}
      </div>
    </AuthWrapper>
  )
}
export default CreatorSearchBar
