import { FollowApi, ListMemberDto } from "@passes/api-client"
import { useMemo, useRef, useState } from "react"
import { useOnClickOutside, useSearch } from "src/hooks"

const useFollowSearch = () => {
  const api = useMemo(() => new FollowApi(), [])
  const fetcher = useMemo(
    () => async (search: string) => {
      const data = await api.searchFollowing({
        searchFollowRequestDto: {
          search: search ? search : undefined,
          order: "asc",
          orderType: "username"
        }
      })
      setFollowing(data.data)
    },
    [api]
  )
  const { search, setSearch } = useSearch(fetcher)
  const [following, setFollowing] = useState<ListMemberDto[]>([])
  const [resultsVisible, setResultsVisible] = useState(false)
  const searchRef = useRef(null)

  useOnClickOutside(searchRef, () => setResultsVisible(false))

  const onChangeInput = (e: any) => {
    setSearch(e.target.value)
  }

  const onSearchFocus = () => {
    setResultsVisible(true)
  }

  return {
    following,
    search,
    resultsVisible,
    onChangeInput,
    onSearchFocus,
    searchRef
  }
}

export default useFollowSearch
