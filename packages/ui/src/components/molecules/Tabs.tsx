import React, { FC, useState } from "react"

interface TabsElement {
  tabName: string
  icon: React.ReactNode
}
interface TabsProps {
  tabsArray: TabsElement[]
}

export const Tabs: FC<TabsProps> = ({ tabsArray }) => {
  const [activeTab, setActiveTab] = useState(tabsArray[0].tabName)
  return (
    <>
      {tabsArray.map((tab, index) => {
        return (
          <div
            className="flex"
            key={index}
            onClick={() => setActiveTab(tab.tabName)}
          >
            <span
              className={`text-[#ffff]/${activeTab === tab.tabName ? 90 : 60}`}
            >
              {tab.tabName}
            </span>
            {tab.icon}
          </div>
        )
      })}
    </>
  )
}
