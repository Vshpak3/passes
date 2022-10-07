import { CreatorInfoDto } from "@passes/api-client"
import { useRouter } from "next/router"
import { FC } from "react"

import { EmptyResult, SearchResult } from "./SearchResults"

interface SearchDropdownProps {
  creatorResults: CreatorInfoDto[]
}

const SearchDropdown: FC<SearchDropdownProps> = ({ creatorResults }) => {
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
    <div className="hidden items-center justify-end gap-2 md:flex">
      <div className="relative flex items-center gap-3">
        <ul className="z-10 max-h-[165px] min-w-[360px] overflow-y-auto rounded-md border border-[#ffffff]/10 bg-[#1b141d]/80 outline-none">
          {renderResults}
        </ul>
      </div>
    </div>
  )
}

export default SearchDropdown
