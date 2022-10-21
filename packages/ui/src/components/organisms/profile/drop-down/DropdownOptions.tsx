import { BlockModalData } from "src/contexts/BlockModal"
import { ReportModalData } from "src/contexts/ReportModal"
import { copyLinkToClipboard } from "src/helpers/clipboard"
import { useBlockModal } from "src/hooks/profile/useBlockModal"
import { useReportModal } from "src/hooks/profile/useReportModal"

import { DropdownOption } from "./Dropdown"

export const DropDownGeneral = (
  text: string,
  showOption: boolean,
  onClick: () => void
): DropdownOption[] => {
  return showOption ? [{ text, onClick }] : []
}

export const DropDownReport = (
  showOption: boolean,
  data: ReportModalData
): DropdownOption[] => {
  const { setIsReportModalOpen, setReportModalData } = useReportModal()

  return DropDownGeneral("Report", showOption, () => {
    setIsReportModalOpen(true)
    setReportModalData(data)
  })
}

export const DropDownBlock = (
  showOption: boolean,
  data: BlockModalData
): DropdownOption[] => {
  const { setIsBlockModalOpen, setBlockModalData } = useBlockModal()

  return DropDownGeneral("Block", showOption, () => {
    setIsBlockModalOpen(true)
    setBlockModalData(data)
  })
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
