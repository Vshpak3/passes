import PassesLogoWhite from "public/icons/white-passes-logo.svg"
import React from "react"

export const SidebarHeader = () => {
  return (
    <div className="justify-left items-left flex flex-shrink-0">
      <div className="">
        <PassesLogoWhite className="ml-8 mt-2 hidden h-[55x] w-[55px] fill-current sidebar-collapse:block" />
      </div>
    </div>
  )
}
