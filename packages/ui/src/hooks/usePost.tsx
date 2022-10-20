import {
  CreatePostRequestDto,
  PostApi,
  UpdatePostRequestDto
} from "@passes/api-client"

export const usePost = () => {
  const api = new PostApi()

  const createPost = async (post: CreatePostRequestDto) => {
    return await api.createPost({ createPostRequestDto: post })
  }

  const updatePost = async (postId: string, data: UpdatePostRequestDto) => {
    await api.updatePost({ postId, updatePostRequestDto: data })
  }

  const removePost = async (postId: string) => {
    await api.removePost({ postId })
  }

  return { createPost, updatePost, removePost }
}
