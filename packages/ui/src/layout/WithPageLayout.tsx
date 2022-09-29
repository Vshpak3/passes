import React from "react"

import AuthWrapper from "../components/wrappers/AuthWrapper"
import { MainContextProvider } from "../context/MainContext"
import { isProd } from "../helpers/env"
import CreatorSearchBar from "./CreatorSearchBar"
import Sidebar from "./Sidebar"

type WithPageLayoutOptions = {
  noAuth?: boolean
  header?: boolean
}

export const withPageLayout = (
  Page: any,
  options: WithPageLayoutOptions = { noAuth: false, header: true }
) => {
  const WithPageLayout = React.forwardRef((props, ref) => (
    <div className="relative flex min-h-screen w-full bg-black">
      <MainContextProvider>
        <Sidebar />
        <main className="w-full bg-[#000]">
          {options.header && (
            <div className="cover-image h-[300px] pr-10 pt-4">
              <CreatorSearchBar />
            </div>
          )}
          <div className="flex shrink-0 flex-col">
            <AuthWrapper isPage skipAuth={options.noAuth}>
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
