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

export const DropDownPinPost = (
  postId: string,
  pinPost: (postId: string) => Promise<void>,
  showOption?: boolean
): DropdownOption[] => {
  return showOption
    ? [
        {
          text: "Pin",
          onClick: async () => {
            await pinPost(postId)
          }
        }
      ]
    : []
}

export const DropDownUnpinPost = (
  postId: string,
  unpinPost: (postId: string) => Promise<void>,
  showOption?: boolean
): DropdownOption[] => {
  return showOption
    ? [
        {
          text: "Unpin",
          onClick: async () => {
            await unpinPost(postId)
          }
        }
      ]
    : []
}
