import React from "react"
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
    <div ref={searchRef}>
      <SearchInput
        onChangeInput={onChangeInput}
        onSearchFocus={onSearchFocus}
        searchValue={searchValue}
      />
      {resultsVisible && <SearchDropdown creatorResults={creatorResults} />}
    </div>
  )
}
export default CreatorSearchBar
