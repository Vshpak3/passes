import { CreatorInfoDto } from "@passes/api-client"
import classNames from "classnames"
import { useRouter } from "next/router"
import { FC } from "react"

import { EmptyResult, SearchResult } from "./SearchResults"

interface SearchDropdownProps {
  creatorResults: CreatorInfoDto[]
  isDesktop?: boolean
}

const SearchDropdown: FC<SearchDropdownProps> = ({
  creatorResults,
  isDesktop = true
}) => {
  const router = useRouter()

  const goToProfile = (username: any) => {
    router.push(`/${username}`)
  }

  const resultsExist = creatorResults?.length > 0
  const renderResults = resultsExist ? (
    creatorResults.map((creator: CreatorInfoDto) => (
      <SearchResult
        key={creator.id}
        userId={creator.id}
        displayName={creator?.displayName ?? ""}
        username={creator.username}
        onClick={() => goToProfile(creator.username)}
      />
    ))
  ) : (
    <EmptyResult />
  )

  return (
    <div
      className={classNames(
        isDesktop ? "hidden md:flex" : "",
        "items-center justify-end gap-2"
      )}
    >
      <div
        className={
          isDesktop
            ? "relative flex items-center gap-3"
            : "absolute top-[64px] left-0 flex w-full"
        }
      >
        <ul
          className={
            (classNames(isDesktop ? "max-h-[165px]" : "h-full w-full"),
            "z-10 w-full min-w-[360px] overflow-y-auto rounded-md border border-[#ffffff]/10 bg-[#1b141d]/80 outline-none")
          }
        >
          {renderResults}
        </ul>
      </div>
    </div>
  )
}

export default SearchDropdown
