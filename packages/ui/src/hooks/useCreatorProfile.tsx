import { FeedApi } from "@passes/api-client"
import useSWR from "swr"

import { wrapApi } from "../helpers/wrapApi"

interface UseCreatorProfileProps {
  username: string
}

// TODO: This should be extended to get other creator profile data
const useCreatorProfile = ({ username }: UseCreatorProfileProps) => {
  const { data: posts = [], isValidating: isLoadingPosts } = useSWR(
    [`/post/creator/`, username],
    async () => {
      const api = wrapApi(FeedApi)
      return await api.feedGetPostsForCreator({ username, cursor: "" })
    }
  )

  return { posts, isLoadingPosts }
}

export default useCreatorProfile
