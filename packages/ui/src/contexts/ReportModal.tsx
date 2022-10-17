import { createContext, Dispatch, SetStateAction } from "react"

interface ReportModalContextProps {
  readonly setIsReportModalOpen: Dispatch<SetStateAction<boolean>>
  readonly setReportModalData: Dispatch<
    SetStateAction<{ userName: string; userId: string } | null>
  >
}

export const ReportModalContext = createContext<ReportModalContextProps>(
  {} as ReportModalContextProps
)
