import { createContext, Dispatch, SetStateAction } from "react"

interface BlockModalContextProps {
  readonly setIsBlockModalOpen: Dispatch<SetStateAction<boolean>>
  readonly setBlockModalData: Dispatch<
    SetStateAction<{ userName: string; userId: string } | null>
  >
}

export const BlockModalContext = createContext<BlockModalContextProps>(
  {} as BlockModalContextProps
)
