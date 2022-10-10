import React from "react"
import AuthWrapper from "src/components/wrappers/AuthWrapper"
import { useCreatorSearch } from "src/hooks"

import SearchDropdown from "./SearchDropdown"
import SearchInput from "./SearchInput"

export interface CreatorSearchBarProps {
  isDesktop?: boolean
}

const CreatorSearchBar = ({ isDesktop = true }: CreatorSearchBarProps) => {
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
          isDesktop={isDesktop}
        />
        {resultsVisible && (
          <SearchDropdown
            creatorResults={creatorResults}
            isDesktop={isDesktop}
          />
        )}
      </div>
    </AuthWrapper>
  )
}

export default CreatorSearchBar
