import { useContext } from "react"

import { BuyPostModalContext } from "src/contexts/BuyPostModal"

export const useBuyPostModal = () => {
  return useContext(BuyPostModalContext)
}
