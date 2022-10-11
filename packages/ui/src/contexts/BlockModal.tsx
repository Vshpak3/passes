import { createContext, Dispatch, SetStateAction } from "react"

interface BlockModalContextProps {
  readonly setIsBlockModalOpen: Dispatch<SetStateAction<boolean>>
}

export const BlockModalContext = createContext<BlockModalContextProps>(
  {} as BlockModalContextProps
)
