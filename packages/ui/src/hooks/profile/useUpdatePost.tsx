import {
  CreatePostRequestDto,
  GetPostsRequestDto,
  PostApi,
  UpdatePostRequestDto
} from "@passes/api-client"

export const useUpdatePost = () => {
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

  const getPosts = async (req: GetPostsRequestDto) => {
    return await api.getPosts({ getPostsRequestDto: req })
  }

  return { createPost, updatePost, removePost, getPosts }
}
