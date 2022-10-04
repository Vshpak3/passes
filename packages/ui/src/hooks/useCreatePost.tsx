import { CreatePostRequestDto, PostApi } from "@passes/api-client"
import { atom, useAtom } from "jotai"

const scheduledPostTimeAtom = atom<Date | null>(null)

const useCreatePost = () => {
  const [scheduledPostTime, setScheduledPostTime] = useAtom(
    scheduledPostTimeAtom
  )
  const api = new PostApi()

  const createPost = async (values: CreatePostRequestDto) => {
    return await api.createPost({
      // should be use Object.assign, to avoid user use this hooks pass the values include scheduledAt property accidently
      createPostRequestDto: Object.assign(values, {
        scheduledAt: scheduledPostTime
      })
    })
  }

  return { createPost, setScheduledPostTime, scheduledPostTime }
}

export default useCreatePost
