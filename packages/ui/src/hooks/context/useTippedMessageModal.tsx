import { useContext } from "react"

import { TippedMessageModalContext } from "src/contexts/TippedMessageModal"

export const useTippedMessageModal = () => {
  return useContext(TippedMessageModalContext)
}
