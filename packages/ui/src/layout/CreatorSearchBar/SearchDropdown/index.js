import { EmptyResult, SearchResult } from "./SearchResults"

const SearchDropdown = ({ creatorResults = [] }) => {
  const resultsExist = creatorResults?.length > 0
  const renderResults = resultsExist ? (
    creatorResults.map((result) => (
      <SearchResult
        key={result.id}
        onClick={() => console.log(result)}
        fullName={result.displayName}
        username={result.username}
      />
    ))
  ) : (
    <EmptyResult />
  )

  return (
    <div className=" hidden items-center justify-end gap-2 pr-10 md:flex">
      <div className="relative flex items-center gap-3">
        <ul className="z-10 max-h-[165px] min-w-[360px] overflow-y-auto rounded-md border border-[#ffffff]/10 bg-[#1b141d]/80 outline-none">
          {renderResults}
        </ul>
      </div>
    </div>
  )
}

export default SearchDropdown
