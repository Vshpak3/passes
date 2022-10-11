import LogoSmall from "public/icons/sidebar-logo-small.svg"
import React from "react"

export const SidebarHeader = () => {
  return (
    <div className="flex flex-shrink-0 items-center justify-center">
      <div className="">
        <LogoSmall className="flex-no-shrink fill-current sidebar-collapse:hidden" />
        {/* <UpdatedPassesLogo className="ml-10 hidden h-[26px] w-[136px] fill-current sidebar-collapse:block " /> */}
        <h1 className="font-display ml-2 mt-2 hidden select-none fill-current text-[46px] font-semibold tracking-tight text-white sidebar-collapse:block">
          {/* TODO: replace with new logo passes */}
          Passes
        </h1>
      </div>
    </div>
  )
}
