import { useRouter } from "next/router"
import path from "path"
import React, {
  createContext,
  FC,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
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
  activeTab: TabsEnum
  addOrPopStackHandler: (tab: SubTabsEnum) => void
  addTabToStackHandler: (tab: SubTabsEnum) => void
  clearActiveTab: () => void
  popTabFromStackHandler: () => void
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

  const clearActiveTab = useCallback(() => {
    // setActiveTab(undefined)
    router.replace(`/settings`, undefined, { shallow: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const addTabToStackHandler = useCallback(
    (tab: SubTabsEnum) => {
      if (!subTabsStack.includes(tab)) {
        setSubTabsStack((prevTabs) => [...prevTabs, tab])
      }
    },
    [subTabsStack]
  )

  const popTabFromStackHandler = useCallback(() => {
    const updatedStack = subTabsStack.slice(0, -1)
    setSubTabsStack(updatedStack)
  }, [subTabsStack])

  const addOrPopStackHandler = useCallback(
    (tab: SubTabsEnum) => {
      const index = subTabsStack.indexOf(tab)
      if (index > -1) {
        const updatedStack = subTabsStack.slice(0, index + 1)
        setSubTabsStack(updatedStack)
      } else {
        addTabToStackHandler(tab)
      }
    },
    [addTabToStackHandler, subTabsStack]
  )

  useEffect(() => {
    if (activeTab) {
      router.replace(`/settings/${tabToPath[activeTab]}`, undefined, {
        shallow: true
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab])

  useEffect(() => {
    if (activeTab !== undefined) {
      router.replace(
        path.join(
          "/settings",
          tabToPath[activeTab],
          subTabsStack.map((t) => subTabToPath[t]).join("/")
        ),
        undefined,
        {
          shallow: true
        }
      )
    }
    // Leave out the activeTab and router
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subTabsStack])

  const contextValue = useMemo(
    () => ({
      activeTab,
      addOrPopStackHandler,
      addTabToStackHandler,
      clearActiveTab,
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
      clearActiveTab,
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
