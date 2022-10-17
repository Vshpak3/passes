import { DropdownOption } from "./Dropdown"

export const DropDownDeletePost = (
  showOption: boolean,
  postId: string,
  removePost: (postId: string) => Promise<void>,
  afterDelete: () => void
): DropdownOption[] => {
  return showOption
    ? [
        {
          text: "Delete",
          onClick: async () => {
            await removePost(postId)
            afterDelete()
          }
        }
      ]
    : []
}
