import { FollowApi, ListMemberDto } from "@passes/api-client"
import { debounce } from "lodash"
import { useCallback, useEffect, useState } from "react"

const DEBOUNCE_TIMEOUT = 100
const useFollowerSearch = () => {
  const [search, setSearch] = useState<string>("")
  const fetch = useCallback(async () => {
    const data = await new FollowApi().searchFans({
      searchFollowRequestDto: {
        search: search ? search : undefined,
        order: "asc",
        orderType: "username"
      }
    })
    setFollowing(data.listMembers)
  }, [search])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceChangeInputSearch = useCallback(
    debounce((v) => setSearch(v), DEBOUNCE_TIMEOUT),
    []
  )

  useEffect(() => {
    fetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  const [following, setFollowing] = useState<ListMemberDto[]>([])

  const onChangeInput = (e: any) => {
    debounceChangeInputSearch(e.target.value)
  }

  return {
    following,
    search,
    onChangeInput
  }
}

export default useFollowerSearch
