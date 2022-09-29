import React from "react"

import AuthOnlyWrapper from "../components/wrappers/AuthOnly"
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
  console.log(getComponentName(Page), options)
  const AuthedPage = options.noAuth
    ? Page
    : () => <AuthOnlyWrapper isPage>{Page}</AuthOnlyWrapper>

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
            <AuthedPage {...props} ref={ref} />
          </div>
        </main>
      </MainContextProvider>
    </div>
  ))
  WithPageLayout.displayName = `WithPageLayout(${getComponentName(AuthedPage)})`
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
