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
  showSettingsTab: boolean
  setShowSettingsTab: React.Dispatch<React.SetStateAction<boolean>>
  activeTab: TabsEnum
  subTabsStack: SubTabsEnum[]
  setActiveTab: React.Dispatch<React.SetStateAction<TabsEnum | undefined>>
  setSubTabsStack: React.Dispatch<React.SetStateAction<SubTabsEnum[]>>
  addTabToStackHandler: (tab: SubTabsEnum) => void
  popTabFromStackHandler: () => void
  addOrPopStackHandler: (tab: SubTabsEnum) => void
}

const SettingsContext = createContext<Partial<SettingsContextProps>>({})

export const SettingsProvider: FC<PropsWithChildren> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<TabsEnum>()
  const [subTabsStack, setSubTabsStack] = useState<SubTabsEnum[]>([])
  const [showSettingsTab, setShowSettingsTab] = useState(false)
  const router = useRouter()

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
      showSettingsTab,
      setShowSettingsTab,
      activeTab,
      subTabsStack,
      setActiveTab,
      setSubTabsStack,
      addTabToStackHandler,
      popTabFromStackHandler,
      addOrPopStackHandler
    }),
    [
      activeTab,
      addOrPopStackHandler,
      addTabToStackHandler,
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
