import React from "react"
import { classNames } from "src/helpers"

const NewsFeedNavigation = ({ setActiveTab, activeTab }) => {
  const navigation = [
    {
      id: "post",
      name: "Post",
      href: ""
    },
    {
      id: "fanWall",
      name: "Fan Wall",
      href: ""
    },
    // {
    //   id: "events",
    //   name: "Events",
    //   href: ""
    // },
    {
      id: "passes",
      name: "Passes",
      href: ""
    }
  ]
  return (
    <nav className="flex w-full items-start border-b border-[#2C282D] p-0">
      {navigation.map((item, index) => (
        <span
          key={index}
          onClick={() => setActiveTab(item.id)}
          className={classNames(
            activeTab === item.id
              ? "border-b-[3px] border-[#9C4DC1]"
              : "border-[#9C4DC1]/60 hover:border-b-[3px] ",
            "group mt-[7px] mr-8 box-border flex cursor-pointer items-start px-[10px] pb-3"
          )}
        >
          <a
            // href={item.href}
            className={classNames(
              item.id === activeTab
                ? "border-b-2 text-base font-bold opacity-100"
                : "opacity-50 group-hover:opacity-80",
              "inline-flex items-center border border-t-0 border-r-0 border-l-0 border-b-2 border-b-transparent text-base font-bold text-[#ffffff]/90 "
            )}
          >
            {item.name}
          </a>
        </span>
      ))}
      <div></div>
    </nav>
  )
}

export default NewsFeedNavigation
