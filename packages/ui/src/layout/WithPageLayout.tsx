import React from "react"
import AuthWrapper from "src/components/wrappers/AuthWrapper"
import { MainContextProvider } from "src/context/MainContext"
import { isProd } from "src/helpers/env"

import CreatorSearchBar from "./CreatorSearchBar"
import Sidebar from "./Sidebar"

type WithPageLayoutOptions = {
  skipAuth?: boolean
  header?: boolean
  sidebar?: boolean
}

export const withPageLayout = (
  Page: any,
  options: WithPageLayoutOptions = {
    skipAuth: false,
    header: true,
    sidebar: true
  }
) => {
  const WithPageLayout = React.forwardRef((props, ref) => (
    <div className="relative flex min-h-screen w-full bg-black">
      <MainContextProvider>
        {options.sidebar && <Sidebar />}
        <main className="w-full bg-[#000]">
          {options.header && (
            <div className="cover-image h-[300px] pr-10 pt-4">
              <CreatorSearchBar />
            </div>
          )}
          <div className="flex shrink-0 flex-col">
            <AuthWrapper isPage skipAuth={!!options.skipAuth}>
              <Page {...props} ref={ref} />
            </AuthWrapper>
          </div>
        </main>
      </MainContextProvider>
    </div>
  ))
  WithPageLayout.displayName = `WithPageLayout(${getComponentName(Page)})`
  return WithPageLayout
}

function getComponentName(target: any) {
  return (
    (!isProd ? typeof target === "string" && target : false) ||
    target.displayName ||
    target.name ||
    "Component"
  )
}
