import debounce from "lodash.debounce"
import { useCallback, useEffect, useRef, useState } from "react"
import { useOnClickOutside } from "src/hooks/useOnClickOutside"

const DEBOUNCE_DELAY = 350

export const useSearch = <T,>(
  fetcher: (searchValue: string) => Promise<T[]>,
  debounceDelay = DEBOUNCE_DELAY
) => {
  const [searchValue, setSearchValue] = useState("")
  const [results, setResults] = useState<T[]>([])
  const [resultsVisible, setResultsVisible] = useState(false)
  const searchRef = useRef(null)

  useOnClickOutside(searchRef, () => setResultsVisible(false))

  const onChangeInput = (e: any) => {
    setResultsVisible(true)
    setSearchValue(e.target.value)
  }

  const onSearchFocus = () => setResultsVisible(true)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const search = useCallback(
    debounce(async (searchValue: string) => {
      if (searchValue.length) {
        const data = await fetcher(searchValue)
        setResults(data)
      } else {
        setResults([])
      }
    }, debounceDelay),
    [debounceDelay]
  )

  useEffect(() => {
    search(searchValue)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue])

  return {
    results,
    searchValue,
    setSearchValue,
    resultsVisible,
    onChangeInput,
    onSearchFocus,
    searchRef
  }
}
