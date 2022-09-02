import { FanWallApi } from "@passes/api-client"
import useSWR from "swr"

import { wrapApi } from "../helpers/wrapApi"

interface UseCreatorProfileProps {
  username: string
}

const useCreatorProfile = ({ username }: UseCreatorProfileProps) => {
  const { data: fanWallPosts = [], isValidating: isLoadingFanWallPosts } =
    useSWR([`/fan-wall/creator/`, username], async () => {
      const api = wrapApi(FanWallApi)
      return await api.fanWallGetFanWallForCreator({ username })
    })

  return { fanWallPosts, isLoadingFanWallPosts }
}

export default useCreatorProfile
