import PassesLogoWhite from "public/icons/white-passes-logo.svg"
import React from "react"

export const SidebarHeader = () => {
  return (
    <div className="justify-left items-left flex flex-shrink-0">
      <div>
        <PassesLogoWhite className="ml-8 mt-2 hidden h-[30x] w-[30px] fill-current sidebar-collapse:block" />
      </div>
    </div>
  )
}
