import { createContext, Dispatch, SetStateAction } from "react"

export interface BlockModalData {
  username: string
  userId: string
}

interface BlockModalContextProps {
  readonly setIsBlockModalOpen: Dispatch<SetStateAction<boolean>>
  readonly setBlockModalData: Dispatch<SetStateAction<BlockModalData | null>>
}

export const BlockModalContext = createContext<BlockModalContextProps>(
  {} as BlockModalContextProps
)
