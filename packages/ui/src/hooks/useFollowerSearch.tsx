import { FollowApi, ListMemberDto } from "@passes/api-client"
import { useMemo, useRef, useState } from "react"
import { useSearch } from "src/hooks"

const useFollowerSearch = () => {
  const api = useMemo(() => new FollowApi(), [])
  const fetch = useMemo(
    () => async (search: string) => {
      const data = await api.searchFans({
        searchFollowRequestDto: {
          search: search ? search : undefined,
          order: "asc",
          orderType: "username"
        }
      })
      setFollowing(data.listMembers)
    },
    [api]
  )
  const { search, setSearch } = useSearch(fetch)
  const [following, setFollowing] = useState<ListMemberDto[]>([])
  const searchRef = useRef(null)
  console.log(following)

  const onChangeInput = (e: any) => {
    setSearch(e.target.value)
  }

  return {
    following,
    search,
    onChangeInput,
    searchRef
  }
}

export default useFollowerSearch
