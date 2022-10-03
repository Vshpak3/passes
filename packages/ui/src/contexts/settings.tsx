import React, { createContext, useContext, useEffect, useState } from "react"
import { SubTabsEnum, TabsEnum } from "src/config/settings"

export interface ISettingsContext {
  showSettingsTab: boolean
  setShowSettingsTab: React.Dispatch<React.SetStateAction<boolean>>
  activeTab: TabsEnum
  subTabsStack: SubTabsEnum[]
  setActiveTab: React.Dispatch<React.SetStateAction<TabsEnum>>
  addTabToStackHandler: (tab: SubTabsEnum) => void
  popTabFromStackHandler: () => void
  addOrPopStackHandler: (tab: SubTabsEnum) => void
}

const SettingsContext = createContext<Partial<ISettingsContext>>({})

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [activeTab, setActiveTab] = useState(TabsEnum.AccountSettings)
  const [subTabsStack, setSubTabsStack] = useState<SubTabsEnum[]>([])
  const [showSettingsTab, setShowSettingsTab] = useState(false)

  const addTabToStackHandler = (tab: SubTabsEnum) => {
    console.log(subTabsStack)
    if (!subTabsStack.includes(tab)) {
      setSubTabsStack((prevTabs) => [...prevTabs, tab])
    }
  }

  const addOrPopStackHandler = (tab: SubTabsEnum) => {
    const index = subTabsStack.indexOf(tab)
    if (index > -1) {
      const updatedStack = subTabsStack.slice(0, index + 1)
      setSubTabsStack(updatedStack)
    } else {
      addTabToStackHandler(tab)
    }
  }

  const popTabFromStackHandler = () => {
    const updatedStack = subTabsStack.slice(0, -1)
    setSubTabsStack(updatedStack)
  }

  useEffect(() => {
    setSubTabsStack([])
  }, [activeTab])

  return (
    <SettingsContext.Provider
      value={{
        showSettingsTab,
        setShowSettingsTab,
        activeTab,
        subTabsStack,
        setActiveTab,
        addTabToStackHandler,
        popTabFromStackHandler,
        addOrPopStackHandler
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

export const useSettings = () => useContext(SettingsContext)
