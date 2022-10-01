import React from "react"

const SidebarContainer = ({ children }: any) => {
  return (
    <header className="hidden h-screen w-full min-w-0 max-w-[120px] items-end md:sticky md:inset-y-0 md:flex md:flex-shrink-0 md:flex-col sidebar-collapse:max-w-[320px]">
      <div className="flex min-h-0 w-full flex-1 flex-col bg-[#120C14] sidebar-collapse:px-[30px]">
        <div className="flex flex-1 flex-col justify-between overflow-y-auto pt-6 pb-4">
          {children}
        </div>
      </div>
    </header>
  )
}

export default SidebarContainer
