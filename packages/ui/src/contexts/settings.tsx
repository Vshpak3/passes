import React, { createContext, useContext, useEffect, useState } from "react"
import { SubTabsEnum, TabsEnum } from "src/config/settings"

export interface ISettingsContext {
  activeTab: TabsEnum
  subTabsStack: SubTabsEnum[]
  setActiveTab: React.Dispatch<React.SetStateAction<TabsEnum>>
  addTabToStackHandler: (tab: SubTabsEnum) => void
  popTabFromStackHandler: () => void
}

const SettingsContext = createContext<Partial<ISettingsContext>>({})

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [activeTab, setActiveTab] = useState(TabsEnum.AccountSettings)
  const [subTabsStack, setSubTabsStack] = useState<SubTabsEnum[]>([])

  const addTabToStackHandler = (tab: SubTabsEnum) => {
    setSubTabsStack((prevTabs) => [...prevTabs, tab])
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
        activeTab,
        subTabsStack,
        setActiveTab,
        addTabToStackHandler,
        popTabFromStackHandler
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

export const useSettings = () => useContext(SettingsContext)
