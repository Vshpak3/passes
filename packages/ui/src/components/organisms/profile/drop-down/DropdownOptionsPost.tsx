import { toast } from "react-toastify"

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
  showOption: boolean,
  afterPin: () => void
): DropdownOption[] => {
  return showOption
    ? [
        {
          text: "Pin",
          onClick: async () => {
            await pinPost(postId)
            toast.success("The post has been pinned")
            afterPin()
          }
        }
      ]
    : []
}

export const DropDownUnpinPost = (
  postId: string,
  unpinPost: (postId: string) => Promise<void>,
  showOption: boolean,
  afterUnpin: () => void
): DropdownOption[] => {
  return showOption
    ? [
        {
          text: "Unpin",
          onClick: async () => {
            await unpinPost(postId)
            toast.success("The post has been unpinned")
            afterUnpin()
          }
        }
      ]
    : []
}
