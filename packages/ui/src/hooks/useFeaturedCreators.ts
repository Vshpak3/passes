import { UserApi } from "@passes/api-client"
import { useEffect } from "react"
import useSWR from "swr"

const CACHE_KEY_POST = "/featured"

export const useFeaturedCreators = () => {
  const api = new UserApi()

  const { data, mutate } = useSWR([CACHE_KEY_POST], async () => {
    return await api.featuredCreators()
  })

  useEffect(() => {
    if (!data) {
      mutate()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { featuredCreators: data?.creators }
}
