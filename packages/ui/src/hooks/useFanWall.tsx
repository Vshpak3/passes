import { CreateFanWallCommentRequestDto, FanWallApi } from "@passes/api-client"
import useSWR, { useSWRConfig } from "swr"

const CACHE_KEY_FAN_WALL = "/profile/fan-wall/creator/"

const useFanWall = (creatorId: string) => {
  const api = new FanWallApi()

  const { mutate } = useSWRConfig()

  const {
    data: fanWallPosts,
    isValidating: isLoadingFanWallPosts,
    mutate: mutateFanWall
  } = useSWR([CACHE_KEY_FAN_WALL, creatorId], async () => {
    return await api.getFanWallForCreator({
      getFanWallRequestDto: { creatorId }
    })
  })

  const writeToFanWall = async (values: CreateFanWallCommentRequestDto) => {
    const api = new FanWallApi()

    mutate(
      [CACHE_KEY_FAN_WALL, creatorId],
      async () =>
        await api.createFanWallComment({
          createFanWallCommentRequestDto: {
            creatorId: creatorId,
            text: values.text,
            tags: values.tags
          }
        }),
      {
        populateCache: async () => {
          const { comments } = await api.getFanWallForCreator({
            getFanWallRequestDto: { creatorId }
          })
          return { comments }
        },
        revalidate: true
      }
    )
  }

  return { fanWallPosts, isLoadingFanWallPosts, mutateFanWall, writeToFanWall }
}

export default useFanWall
