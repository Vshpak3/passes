import { FanWallApi } from "@passes/api-client"
import useSWR from "swr"

const CACHE_KEY_FAN_WALL = "/profile/fan-wall/creator/"

const useFanWall = (userId: string) => {
  const { data: fanWallPosts = [], isValidating: isLoadingFanWallPosts } =
    useSWR([CACHE_KEY_FAN_WALL, userId], async () => {
      const api = new FanWallApi()
      return await api.getFanWallForCreator({
        getFanWallRequestDto: { creatorId: userId }
      })
    })

  return { fanWallPosts, isLoadingFanWallPosts }
}

export default useFanWall
