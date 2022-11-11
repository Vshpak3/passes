import { createContext, useContext } from "react"

export const GlobalCacheContext = createContext({
  usernames: {} as Record<string, string>,
  profileImages: new Set<string>()
})

// A hook to use whenever we need to consume data from GlobalStateProvider so we
// don't need React.useContext everywhere we need data from GlobalStateContext.
export function useGlobalCache() {
  const context = useContext(GlobalCacheContext)

  if (!context) {
    throw new Error("You need to wrap GlobalStateProvider.")
  }

  return context
}
