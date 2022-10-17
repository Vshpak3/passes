import { createContext, Dispatch, SetStateAction } from "react"

export interface ReportModalData {
  username: string
  userId: string
}

interface ReportModalContextProps {
  readonly setIsReportModalOpen: Dispatch<SetStateAction<boolean>>
  readonly setReportModalData: Dispatch<SetStateAction<ReportModalData | null>>
}

export const ReportModalContext = createContext<ReportModalContextProps>(
  {} as ReportModalContextProps
)
