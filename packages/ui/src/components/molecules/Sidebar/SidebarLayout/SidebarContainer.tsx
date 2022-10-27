import { FC, PropsWithChildren } from "react"

export const SidebarContainer: FC<PropsWithChildren> = ({ children }) => {
  return (
    <header className="col-span-3 hidden h-screen w-full items-end border-r border-gray-600 md:sticky md:inset-y-0 md:flex md:flex-shrink-0 md:flex-col">
      <div className="flex w-full flex-1 flex-col bg-passes-black">
        <div className="flex flex-1 flex-col items-end justify-between overflow-y-auto py-6 pr-6 lg:pr-8">
          {children}
        </div>
      </div>
    </header>
  )
}
