import { BlockModalData } from "src/contexts/BlockModal"
import { ReportModalData } from "src/contexts/ReportModal"
import { copyLinkToClipboard } from "src/helpers/clipboard"
import { useBlockModal } from "src/hooks/useBlockModal"
import { useReportModal } from "src/hooks/useReportModal"

import { DropdownOption } from "./Dropdown"

export const DropDownReport = (
  showOption: boolean,
  data: ReportModalData
): DropdownOption[] => {
  const { setIsReportModalOpen, setReportModalData } = useReportModal()

  return showOption
    ? [
        {
          text: "Report",
          onClick: () => {
            setIsReportModalOpen(true)
            setReportModalData(data)
          }
        }
      ]
    : []
}

export const DropDownBlock = (
  showOption: boolean,
  data: BlockModalData
): DropdownOption[] => {
  const { setIsBlockModalOpen, setBlockModalData } = useBlockModal()

  return showOption
    ? [
        {
          text: "Block",
          onClick: () => {
            setIsBlockModalOpen(true)
            setBlockModalData(data)
          }
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
