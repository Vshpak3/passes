import debounce from "lodash.debounce"
import { useEffect, useMemo, useRef, useState } from "react"

import useOnClickOutside from "./useOnClickOutside"

const DEBOUNCE_DELAY = 300

const useSearch = <T,>(fetcher: (searchValue: string) => Promise<T[]>) => {
  const [searchValue, setSearchValue] = useState("")
  const [results, setResults] = useState<T[]>([])
  const [resultsVisible, setResultsVisible] = useState(false)
  const searchRef = useRef(null)

  useOnClickOutside(searchRef, () => setResultsVisible(false))

  const onChangeInput = (e: any) => {
    setResultsVisible(true)
    setSearchValue(e.target.value)
  }

  const onSearchFocus = () => {
    setResultsVisible(true)
  }

  const search = useMemo(
    () =>
      debounce(async (searchValue: string) => {
        if (searchValue.length) {
          const data = await fetcher(searchValue)
          setResults(data)
        } else {
          setResults([])
        }
      }, DEBOUNCE_DELAY),
    [fetcher]
  )

  useEffect(() => {
    search(searchValue)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue])

  return {
    results,
    searchValue,
    resultsVisible,
    onChangeInput,
    onSearchFocus,
    searchRef
  }
}

export default useSearch
