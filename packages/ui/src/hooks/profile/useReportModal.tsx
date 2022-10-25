import { useContext } from "react"

import { ReportModalContext } from "src/contexts/ReportModal"

export const useReportModal = () => {
  return useContext(ReportModalContext)
}
