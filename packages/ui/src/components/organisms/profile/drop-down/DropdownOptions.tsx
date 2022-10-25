import { BlockModalData } from "src/components/organisms/BlockModal"
import { ReportModalData } from "src/components/organisms/ReportModal"
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
  const { setReportData } = useReportModal()

  return DropDownGeneral("Report", showOption, () => {
    setReportData(data)
  })
}

export const DropDownBlock = (
  showOption: boolean,
  data: BlockModalData
): DropdownOption[] => {
  const { setBlockData } = useBlockModal()

  return DropDownGeneral("Block", showOption, () => {
    setBlockData(data)
  })
}

export const DropDownCopyLink = (
  showOption: boolean,
  username: string,
  postId: string
): DropdownOption[] => {
  return DropDownGeneral("Copy link to post", showOption, () => {
    copyLinkToClipboard(username, postId)
  })
}
