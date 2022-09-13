import { FanWallApi, GetFanWallForCreatorRequest } from "@passes/api-client"
import useSWR from "swr"

import { wrapApi } from "../helpers/wrapApi"

const useFanWall = ({ userId }: GetFanWallForCreatorRequest) => {
  const { data: fanWallPosts = [], isValidating: isLoadingFanWallPosts } =
    useSWR(["/fan-wall/creator/", userId], async () => {
      const api = wrapApi(FanWallApi)
      return await api.getFanWallForCreator({ userId })
    })

  return { fanWallPosts, isLoadingFanWallPosts }
}

export default useFanWall
