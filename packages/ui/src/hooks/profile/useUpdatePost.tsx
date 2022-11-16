import {
  CreatePostRequestDto,
  GetPostsRequestDto,
  PostApi
} from "@passes/api-client"

export const useUpdatePost = () => {
  const api = new PostApi()

  const createPost = async (post: CreatePostRequestDto) => {
    return await api.createPost({ createPostRequestDto: post })
  }

  const removePost = async (postId: string) => {
    await api.removePost({ postId })
  }

  const hidePost = async (postId: string) => {
    await api.hidePost({ postId })
  }

  const getPosts = async (req: GetPostsRequestDto) => {
    return await api.getPosts({ getPostsRequestDto: req })
  }

  return { createPost, removePost, getPosts, hidePost }
}
