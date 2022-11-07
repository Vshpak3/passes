import { createContext, Dispatch, SetStateAction } from "react"

interface SidebarContextProps {
  readonly setShowBottomNav: Dispatch<SetStateAction<boolean>>
  readonly showBottomNav: boolean
}

export const SidebarContext = createContext<SidebarContextProps>(
  {} as SidebarContextProps
)
