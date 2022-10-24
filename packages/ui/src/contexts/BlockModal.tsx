import { createContext, Dispatch, SetStateAction } from "react"
import { BlockModalData } from "src/components/organisms/BlockModal"

interface BlockModalContextProps {
  readonly setBlockData: Dispatch<SetStateAction<BlockModalData | null>>
}

export const BlockModalContext = createContext<BlockModalContextProps>(
  {} as BlockModalContextProps
)
