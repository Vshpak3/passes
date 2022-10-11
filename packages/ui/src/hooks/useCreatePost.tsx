import { CreatePostRequestDto, PostApi } from "@passes/api-client"

export const useCreatePost = () => {
  const api = new PostApi()

  const createPost = async (values: CreatePostRequestDto) => {
    return await api.createPost({
      createPostRequestDto: values
    })
  }

  return { createPost }
}
