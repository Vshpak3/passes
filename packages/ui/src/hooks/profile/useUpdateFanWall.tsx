import { CreateFanWallCommentRequestDto, FanWallApi } from "@passes/api-client"

export const useFanWall = () => {
  const api = new FanWallApi()

  const createFanWallComment = async (
    createFanWallCommentRequestDto: CreateFanWallCommentRequestDto
  ) => {
    return await api.createFanWallComment({ createFanWallCommentRequestDto })
  }

  const deleteFanWallComment = async (fanWallCommentId: string) => {
    await api.deleteFanWallComment({ fanWallCommentId })
  }

  const hideFanWallComment = async (fanWallCommentId: string) => {
    await api.hideFanWallComment({ fanWallCommentId })
  }

  const unhideFanWallComment = async (fanWallCommentId: string) => {
    await api.unhideFanWallComment({ fanWallCommentId })
  }

  return {
    createFanWallComment,
    deleteFanWallComment,
    hideFanWallComment,
    unhideFanWallComment
  }
}
