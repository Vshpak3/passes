import { UserApi } from "@passes/api-client"
import useSWR from "swr"

const CACHE_KEY_POST = "/featured"

export const useFeaturedCreators = () => {
  const api = new UserApi()

  const { data } = useSWR([CACHE_KEY_POST], async () => {
    return await api.featuredCreators()
  })

  return { featuredCreators: data?.creators }
}
