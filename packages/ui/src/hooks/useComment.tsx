import { CommentApi, CreateCommentRequestDto } from "@passes/api-client"

export const useComment = () => {
  const api = new CommentApi()

  const createComment = async (
    createCommentRequestDto: CreateCommentRequestDto
  ) => {
    return await api.createComment({ createCommentRequestDto })
  }

  const deleteComment = async (postId: string, commentId: string) => {
    await api.deleteComment({ postId, commentId })
  }

  const hideComment = async (postId: string, commentId: string) => {
    await api.hideComment({ postId, commentId })
  }

  return { createComment, deleteComment, hideComment }
}
