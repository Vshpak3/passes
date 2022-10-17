import { DropdownOption } from "./Dropdown"

export const DropDownFanWallCommentDelete = (
  showOption: boolean,
  fanWallCommentId: string,
  deleteFanWallComment: (fanWallCommentId: string) => Promise<void>,
  afterDelete: () => void
): DropdownOption[] => {
  return showOption
    ? [
        {
          text: "Delete comment",
          onClick: async () => {
            await deleteFanWallComment(fanWallCommentId)
            afterDelete()
          }
        }
      ]
    : []
}

export const DropDownFanWallCommentHide = (
  showOption: boolean,
  fanWallCommentId: string,
  hideFanWallComment: (fanWallCommentId: string) => Promise<void>
): DropdownOption[] => {
  return showOption
    ? [
        {
          text: "Hide comment",
          onClick: async () => {
            await hideFanWallComment(fanWallCommentId)
          }
        }
      ]
    : []
}
