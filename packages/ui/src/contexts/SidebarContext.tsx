import { createContext, Dispatch, SetStateAction } from "react"

interface SidebarContextProps {
  readonly setShowBottomNav: Dispatch<SetStateAction<boolean>>
  readonly showBottomNav: boolean
  readonly setShowTopNav: Dispatch<SetStateAction<boolean>>
  readonly showTopNav: boolean
}

export const SidebarContext = createContext<SidebarContextProps>(
  {} as SidebarContextProps
)
