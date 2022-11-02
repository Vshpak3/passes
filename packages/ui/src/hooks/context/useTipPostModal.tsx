import { useContext } from "react"

import { TipPostModalContext } from "src/contexts/TipPostModal"

export const useTipPostModal = () => {
  return useContext(TipPostModalContext)
}
