import { useContext } from "react"

import { ViewPostModalContext } from "src/contexts/ViewPostModal"

// Might be used in the future
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const useViewPostModal = () => {
  return useContext(ViewPostModalContext)
}
