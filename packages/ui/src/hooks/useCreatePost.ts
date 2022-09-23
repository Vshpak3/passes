import { PostApi } from "@passes/api-client"
import { useContext } from "react"
import { MainContext } from "src/context/MainContext"

export interface CreatePostValues {
  text: string
  contentIds: Array<any>
}
const useCreatePost = () => {
  const { postTime } = useContext(MainContext)
  const api = new PostApi()
  const createPost = async (values: CreatePostValues) => {
    return await api.createPost({
      createPostRequestDto: {
        text: values.text,
        tags: [],
        contentIds: values.contentIds,
        passIds: [],
        price: 0,
        scheduledAt: postTime?.$d
      }
    })
  }

  return { createPost }
}

export default useCreatePost
