import { UserApi } from "@passes/api-client"
import { useEffect, useMemo, useRef, useState } from "react"
import { debounce, wrapApi } from "src/helpers"
import { useOnClickOutside } from "src/hooks"

const api = wrapApi(UserApi)
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
      debounce(async () => {
        const data = await api.userSearchCreatorByUsername({
          searchCreatorRequestDto: { query: searchValue }
        })
        setCreatorResults(data.creators)
      }, DEBOUNCE_DELAY),
    [searchValue]
  )

  useEffect(() => {
    if (searchValue.length >= 2) {
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
