import { useContext } from "react"
import { ViewPostModalContext } from "src/contexts/ViewPostModal"

export const useViewPostModal = () => {
  return useContext(ViewPostModalContext)
}
