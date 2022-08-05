import React, { useState } from "react"
import { classNames } from "src/helpers"

const NewsFeedNavigation = () => {
  const [active, setActive] = useState("post")
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
    {
      id: "events",
      name: "Events",
      href: ""
    },
    {
      id: "passes",
      name: "Passes",
      href: ""
    }
  ]
  return (
    <nav className="flex w-full items-start justify-between border-b border-[#2C282D] p-0">
      {navigation.map((item, index) => (
        <span
          key={index}
          onClick={() => setActive(item.id)}
          className={classNames(
            active === item.id
              ? "border-b-[3px] border-[#9C4DC1]"
              : "border-[#9C4DC1]/60 hover:border-b-[3px] ",
            "group mt-[7px] box-border flex cursor-pointer items-start px-[10px] pb-3"
          )}
        >
          <a
            // href={item.href}
            className={classNames(
              item.id === active
                ? "border-b-2 text-base font-bold text-[#ffffff]/90 opacity-100"
                : "opacity-50 group-hover:opacity-80",
              "inline-flex items-center border border-t-0 border-r-0 border-l-0 border-b-2 border-b-transparent text-base font-bold "
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
