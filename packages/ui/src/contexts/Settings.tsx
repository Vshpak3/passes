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

import {
  SubTabsEnum,
  subTabToPath,
  TabsEnum,
  tabToPath
} from "src/config/settings"

export interface SettingsContextProps {
  addOrPopStackHandler: (tab: SubTabsEnum) => void
  addTabToStackHandler: (tab: SubTabsEnum) => void
  navFromActiveTab: () => void
  navToActiveTab: (tab: TabsEnum) => void
  popTabFromStackHandler: () => void

  // Should only be used by index
  activeTab: TabsEnum
  setActiveTab: React.Dispatch<React.SetStateAction<TabsEnum | undefined>>
  setShowSettingsTab: React.Dispatch<React.SetStateAction<boolean>>
  setSubTabsStack: React.Dispatch<React.SetStateAction<SubTabsEnum[]>>
  showSettingsTab: boolean
  subTabsStack: SubTabsEnum[]
}

const SettingsContext = createContext<Partial<SettingsContextProps>>({})

export const SettingsProvider: FC<PropsWithChildren> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<TabsEnum>()
  const [subTabsStack, setSubTabsStack] = useState<SubTabsEnum[]>([])
  const [showSettingsTab, setShowSettingsTab] = useState(false)
  const router = useRouter()

  const setRoute = useCallback(
    (primaryTab: TabsEnum | undefined, secondaryTabStack: SubTabsEnum[]) => {
      router.replace(
        path.join(
          "/settings",
          primaryTab !== undefined ? tabToPath[primaryTab] : "",
          secondaryTabStack.length
            ? secondaryTabStack.map((t) => subTabToPath[t]).join("/")
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
    (id: TabsEnum) => {
      setShowSettingsTab(true)
      setActiveTab(id)
      setSubTabsStack([])
      setRoute(id, [])
    },
    [setRoute]
  )

  const navFromActiveTab = useCallback(() => {
    setShowSettingsTab(false)
    setActiveTab(undefined)
    setSubTabsStack([])
    setRoute(undefined, [])
  }, [setRoute])

  const addTabToStackHandler = useCallback(
    (tab: SubTabsEnum) => {
      if (subTabsStack.includes(tab)) {
        return
      }
      const updatedStack = [...subTabsStack, tab]
      setSubTabsStack(updatedStack)
      setRoute(activeTab, updatedStack)
    },
    [activeTab, setRoute, subTabsStack]
  )

  const popTabFromStackHandler = useCallback(() => {
    const updatedStack = subTabsStack.slice(0, -1)
    setSubTabsStack(updatedStack)
    setRoute(activeTab, updatedStack)
  }, [activeTab, setRoute, subTabsStack])

  const addOrPopStackHandler = useCallback(
    (tab: SubTabsEnum) => {
      const index = subTabsStack.indexOf(tab)
      if (index > -1) {
        const updatedStack = subTabsStack.slice(0, index + 1)
        setSubTabsStack(updatedStack)
        setRoute(activeTab, updatedStack)
      } else {
        addTabToStackHandler(tab)
      }
    },
    [activeTab, addTabToStackHandler, setRoute, subTabsStack]
  )

  const contextValue = useMemo(
    () => ({
      activeTab,
      addOrPopStackHandler,
      addTabToStackHandler,
      navFromActiveTab,
      navToActiveTab,
      popTabFromStackHandler,
      setActiveTab,
      setShowSettingsTab,
      setSubTabsStack,
      showSettingsTab,
      subTabsStack
    }),
    [
      activeTab,
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
