import { useContext } from "react"

import { SidebarContext } from "src/contexts/SidebarContext"

export const useSidebarContext = () => {
  return useContext(SidebarContext)
}
