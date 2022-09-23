import { UserApi } from "@passes/api-client"
import debounce from "lodash.debounce"
import { useEffect, useMemo, useRef, useState } from "react"
import { useOnClickOutside } from "src/hooks"

const api = new UserApi()
const DEBOUNCE_DELAY = 300

const useCreatorSearch = () => {
  const [searchValue, setSearchValue] = useState("")
  const [creatorResults, setCreatorResults] = useState<string[]>([])
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

  const searchCreators = useMemo(
    () =>
      debounce(async (searchValue: string) => {
        const data = await api.searchCreatorByUsername({
          searchCreatorRequestDto: { query: searchValue }
        })
        setCreatorResults(data.creators)
      }, DEBOUNCE_DELAY),
    []
  )

  useEffect(() => {
    if (searchValue.length) {
      searchCreators(searchValue)
    } else {
      setCreatorResults([])
    }
  }, [searchValue, searchCreators])

  return {
    creatorResults,
    searchValue,
    resultsVisible,
    onChangeInput,
    onSearchFocus,
    searchRef
  }
}

export default useCreatorSearch
