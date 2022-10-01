import debounce from "lodash.debounce"
import { useEffect, useMemo, useState } from "react"

const DEBOUNCE_DELAY = 300

const useSearch = (fetcher: (searchValue: string) => any) => {
  const [search, setSearch] = useState("")

  const searchFunction = useMemo(
    () => debounce(fetcher, DEBOUNCE_DELAY),
    [fetcher]
  )

  useEffect(() => {
    searchFunction(search)
  }, [search, searchFunction])

  return {
    search,
    setSearch
  }
}

export default useSearch
