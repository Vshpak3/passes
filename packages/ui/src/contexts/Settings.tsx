import { useRouter } from "next/router"
import path from "path"
import React, {
  createContext,
  FC,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState
} from "react"

import { SubTabsEnum, subTabToPath } from "src/config/settings"

export interface SettingsContextProps {
  addOrPopStackHandler: (tab: SubTabsEnum) => void
  addTabToStackHandler: (tab: SubTabsEnum) => void
  navFromActiveTab: () => void
  navToActiveTab: (tab: SubTabsEnum) => void
  popTabFromStackHandler: (defaultSubTab?: SubTabsEnum) => void

  // Should only be used by index
  setShowSettingsTab: React.Dispatch<React.SetStateAction<boolean>>
  setSubTabsStack: React.Dispatch<React.SetStateAction<SubTabsEnum[]>>
  showSettingsTab: boolean
  subTabsStack: SubTabsEnum[]
}

const SettingsContext = createContext<Partial<SettingsContextProps>>({})

export const SettingsProvider: FC<PropsWithChildren> = ({ children }) => {
  const [subTabsStack, setSubTabsStack] = useState<SubTabsEnum[]>([])
  const [showSettingsTab, setShowSettingsTab] = useState(false)
  const router = useRouter()

  const setRoute = useCallback(
    (secondaryTabStack: SubTabsEnum[]) => {
      router.replace(
        path.join(
          "/settings",
          secondaryTabStack.length
            ? subTabToPath[secondaryTabStack[secondaryTabStack.length - 1]]
            : ""
        ),
        undefined,
        {
          shallow: true
        }
      )
    },
    [router]
  )

  const navToActiveTab = useCallback(
    (tab: SubTabsEnum) => {
      setShowSettingsTab(true)
      setSubTabsStack([tab])
      setRoute([tab])
    },
    [setRoute]
  )

  const navFromActiveTab = useCallback(() => {
    setShowSettingsTab(false)
    setSubTabsStack([])
    setRoute([])
  }, [setRoute])

  const addTabToStackHandler = useCallback(
    (tab: SubTabsEnum) => {
      if (subTabsStack.includes(tab)) {
        return
      }
      const updatedStack = [...subTabsStack, tab]
      setSubTabsStack(updatedStack)
      setRoute(updatedStack)
    },
    [setRoute, subTabsStack]
  )

  const popTabFromStackHandler = useCallback(
    (defaultSubTab?: SubTabsEnum) => {
      let updatedStack = subTabsStack.slice(0, -1)
      if (updatedStack.length === 0 && defaultSubTab) {
        updatedStack = [defaultSubTab]
      }
      setSubTabsStack(updatedStack)
      setRoute(updatedStack)
    },
    [setRoute, subTabsStack]
  )

  const addOrPopStackHandler = useCallback(
    (tab: SubTabsEnum) => {
      const index = subTabsStack.indexOf(tab)
      if (index > -1) {
        const updatedStack = subTabsStack.slice(0, index + 1)
        setSubTabsStack(updatedStack)
        setRoute(updatedStack)
      } else {
        addTabToStackHandler(tab)
      }
    },
    [addTabToStackHandler, setRoute, subTabsStack]
  )

  const contextValue = useMemo(
    () => ({
      addOrPopStackHandler,
      addTabToStackHandler,
      navFromActiveTab,
      navToActiveTab,
      popTabFromStackHandler,
      setShowSettingsTab,
      setSubTabsStack,
      showSettingsTab,
      subTabsStack
    }),
    [
      addOrPopStackHandler,
      addTabToStackHandler,
      navFromActiveTab,
      navToActiveTab,
      popTabFromStackHandler,
      showSettingsTab,
      subTabsStack
    ]
  )

  return (
    <SettingsContext.Provider value={contextValue}>
      {children}
    </SettingsContext.Provider>
  )
}

export const useSettings = () => useContext(SettingsContext)
