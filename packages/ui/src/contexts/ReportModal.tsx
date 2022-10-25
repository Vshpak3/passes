import { createContext, Dispatch, SetStateAction } from "react"

import { ReportModalData } from "src/components/organisms/ReportModal"

interface ReportModalContextProps {
  readonly setReportData: Dispatch<SetStateAction<ReportModalData | null>>
}

export const ReportModalContext = createContext<ReportModalContextProps>(
  {} as ReportModalContextProps
)
