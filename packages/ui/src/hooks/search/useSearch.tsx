import debounce from "lodash.debounce"
import { useCallback, useEffect, useRef, useState } from "react"

import { useOnClickOutside } from "src/hooks/useOnClickOutside"

const DEBOUNCE_DELAY = 350

export const useSearch = <T,>(
  fetcher: (searchValue: string) => Promise<T[]>,
  dependencies: any[] = [],
  debounceDelay = DEBOUNCE_DELAY
) => {
  const [searchValue, setSearchValue] = useState("")
  const [results, setResults] = useState<T[]>([])
  const [resultsVisible, setResultsVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const searchRef = useRef(null)

  useOnClickOutside(searchRef, () => setResultsVisible(false))

  const onChangeInput = (e: any) => {
    setLoading(true)
    setResultsVisible(true)
    setSearchValue(e.target.value)
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const search = useCallback(
    debounce(async (searchValue: string) => {
      const data = await fetcher(searchValue)
      setResults(data)
      setLoading(false)
    }, debounceDelay),
    [debounceDelay, ...dependencies]
  )

  useEffect(() => {
    if (searchValue) {
      search(searchValue)
    } else {
      setResults([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue])

  return {
    results,
    setResults,
    searchValue,
    setSearchValue,
    loading,
    resultsVisible,
    onChangeInput,
    searchRef
  }
}
