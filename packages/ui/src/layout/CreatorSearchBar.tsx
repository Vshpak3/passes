import { UserDisplayInfoDto } from "@passes/api-client"
import { useRouter } from "next/router"
import React, { FC } from "react"
import { UserSearchDropdown } from "src/components/atoms/search/user/UserSearchDropdown"
import { UserSearchInput } from "src/components/atoms/search/user/UserSearchInput"
import { AuthWrapper } from "src/components/wrappers/AuthWrapper"
import { useCreatorSearch } from "src/hooks/useCreatorSearch"

export interface CreatorSearchBarProps {
  isDesktop?: boolean
}

export const CreatorSearchBar: FC<CreatorSearchBarProps> = ({
  isDesktop = true
}) => {
  const {
    results,
    searchValue,
    onChangeInput,
    onSearchFocus,
    resultsVisible,
    searchRef
  } = useCreatorSearch()

  const router = useRouter()

  const goToProfile = (user: UserDisplayInfoDto) => {
    router.push(`/${user.username}`)
  }
  return (
    <AuthWrapper>
      <div ref={searchRef}>
        <UserSearchInput
          onChangeInput={onChangeInput}
          onSearchFocus={onSearchFocus}
          searchValue={searchValue}
          isDesktop={isDesktop}
          placeholder={"Find creator"}
        />
        {resultsVisible && (
          <UserSearchDropdown
            results={results}
            isDesktop={isDesktop}
            emptyText={"creators"}
            onClick={goToProfile}
          />
        )}
      </div>
    </AuthWrapper>
  )
}
