import { FeedApi } from "@passes/api-client"
import useSWR from "swr"

import useUser from "./useUser"

interface UseCreatorProfileProps {
  username: string
}

// TODO: This should be extended to get other creator profile data
const useCreatorProfile = ({ username }: UseCreatorProfileProps) => {
  const { accessToken } = useUser()

  const { data: posts = [], isValidating: isLoadingPosts } = useSWR(
    [`/post/creator/`, username],
    async () => {
      const api = new FeedApi()
      return await api.feedGetPostsForCreator(
        { username, cursor: "" },
        {
          headers: { Authorization: "Bearer " + accessToken }
        }
      )
    }
  )

  return { posts, isLoadingPosts }
}

export default useCreatorProfile
