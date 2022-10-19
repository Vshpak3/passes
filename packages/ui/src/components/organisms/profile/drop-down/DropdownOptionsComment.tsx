import { DropdownOption } from "./Dropdown"

export const DropDownCommentDelete = (
  showOption: boolean,
  postId: string,
  commentId: string,
  removeComment: (postId: string, commentId: string) => Promise<void>,
  afterDelete: () => void
): DropdownOption[] => {
  return showOption
    ? [
        {
          text: "Delete comment",
          onClick: async () => {
            await removeComment(postId, commentId)
            afterDelete()
          }
        }
      ]
    : []
}

export const DropDownCommentHide = (
  showOption: boolean,
  postId: string,
  commentId: string,
  hideComment: (postId: string, commentId: string) => Promise<void>
): DropdownOption[] => {
  return showOption
    ? [
        {
          text: "Hide comment",
          onClick: async () => {
            await hideComment(postId, commentId)
          }
        }
      ]
    : []
}

export const DropDownCommentUnhide = (
  showOption: boolean,
  postId: string,
  commentId: string,
  unhideComment: (postId: string, commentId: string) => Promise<void>
): DropdownOption[] => {
  return showOption
    ? [
        {
          text: "Unhide comment",
          onClick: async () => {
            await unhideComment(postId, commentId)
          }
        }
      ]
    : []
}
