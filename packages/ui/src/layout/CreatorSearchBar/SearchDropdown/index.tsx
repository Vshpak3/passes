import { CreatorInfoDto } from "@passes/api-client"
import { useRouter } from "next/router"

import { EmptyResult, SearchResult } from "./SearchResults"

const SearchDropdown = ({
  creatorResults
}: {
  creatorResults: CreatorInfoDto[]
}) => {
  const router = useRouter()

  const goToProfile = (username: any) => {
    router.push(`/${username}`)
  }

  const resultsExist = creatorResults?.length > 0
  const renderResults = resultsExist ? (
    creatorResults.map((creator: any) => (
      <SearchResult
        key={creator.id}
        onClick={() => goToProfile(creator.username)}
        userId={creator.id}
        fullName={creator.display_name}
        username={creator.username}
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
