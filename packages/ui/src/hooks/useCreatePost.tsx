import { CreatePostRequestDto, PostApi } from "@passes/api-client"

const useCreatePost = () => {
  const api = new PostApi()
  const createPost = async (values: CreatePostRequestDto) => {
    console.log(values)
    return await api.createPost({
      createPostRequestDto: { ...values }
    })
  }

  return { createPost }
}

export default useCreatePost
