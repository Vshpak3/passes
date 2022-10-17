import { Dispatch, SetStateAction } from "react"
import { copyLinkToClipboard } from "src/helpers/clipboard"

import { DropdownOption } from "./Dropdown"

export const DropDownReport = (
  showOption: boolean,
  setIsReportModalOpen: Dispatch<SetStateAction<boolean>>
): DropdownOption[] => {
  return showOption
    ? [
        {
          text: "Report",
          onClick: () => setIsReportModalOpen(true)
        }
      ]
    : []
}

export const DropDownBlock = (
  showOption: boolean,
  setIsBlockModalOpen: Dispatch<SetStateAction<boolean>>
): DropdownOption[] => {
  return showOption
    ? [
        {
          text: "Block",
          onClick: () => setIsBlockModalOpen(true)
        }
      ]
    : []
}

export const DropDownCopyLink = (
  username: string,
  postId: string
): DropdownOption => {
  return {
    text: "Copy link to post",
    onClick: () => copyLinkToClipboard(username, postId)
  }
}
