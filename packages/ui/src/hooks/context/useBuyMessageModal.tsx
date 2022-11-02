import { useContext } from "react"

import { BuyMessageModalContext } from "src/contexts/BuyMessageModal"

export const useBuyMessageModal = () => {
  return useContext(BuyMessageModalContext)
}
