import React, { useState } from "react"

interface ITabsElement {
  tabName: string
  icon: React.ReactNode
}
interface ITabs {
  tabsArray: ITabsElement[]
}

const Tabs = ({ tabsArray }: ITabs) => {
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

export default Tabs
