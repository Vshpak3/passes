import { createContext, Dispatch, SetStateAction } from "react"

interface ReportModalContextProps {
  readonly setIsReportModalOpen: Dispatch<SetStateAction<boolean>>
}

export const ReportModalContext = createContext<ReportModalContextProps>(
  {} as ReportModalContextProps
)
