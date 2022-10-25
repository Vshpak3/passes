import { useContext } from "react"

import { BlockModalContext } from "src/contexts/BlockModal"

export const useBlockModal = () => {
  return useContext(BlockModalContext)
}
