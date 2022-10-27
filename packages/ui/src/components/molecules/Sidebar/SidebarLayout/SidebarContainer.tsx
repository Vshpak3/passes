import { FC } from "react"

interface SidebarContainerProps {
  children: any
}

export const SidebarContainer: FC<SidebarContainerProps> = ({ children }) => {
  return (
    <header className="hidden h-screen w-full min-w-0 max-w-[120px] items-end border-r border-gray-600 md:sticky md:inset-y-0 md:flex md:flex-shrink-0 md:flex-col sidebar-collapse:max-w-[330px]">
      <div className="flex min-h-0 w-full flex-1 flex-col bg-[#120C14] sidebar-collapse:pl-16">
        <div className="flex flex-1 flex-col justify-between overflow-y-auto pt-6 pb-4">
          {children}
        </div>
      </div>
    </header>
  )
}
