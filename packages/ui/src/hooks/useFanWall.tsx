import { FanWallApi } from "@passes/api-client"
import useSWR from "swr"

const useFanWall = (userId: string) => {
  const { data: fanWallPosts = [], isValidating: isLoadingFanWallPosts } =
    useSWR(["/fan-wall/creator/", userId], async () => {
      const api = new FanWallApi()
      return await api.getFanWallForCreator({
        getFanWallRequestDto: { creatorId: userId }
      })
    })

  return { fanWallPosts, isLoadingFanWallPosts }
}

export default useFanWall
