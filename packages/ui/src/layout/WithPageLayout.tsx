import React from "react"

import CreatorSearchBar from "./CreatorSearchBar"
import Sidebar from "./Sidebar"

type WithPageLayoutOptions = {
  header?: boolean
}

export const withPageLayout = (
  Page: any,
  options: WithPageLayoutOptions = { header: true }
) => {
  const WithPageLayout = React.forwardRef((props, ref) => (
    <div className="relative flex min-h-screen flex-1 bg-black">
      <Sidebar />
      <main className="flex-shrink flex-grow bg-[#000]">
        <div className="cover-image h-[300px]">
          {options.header && <CreatorSearchBar />}
        </div>
        <Page {...props} ref={ref} />
      </main>
    </div>
  ))
  WithPageLayout.displayName = `WithPageLayout(${getComponentName(Page)})`
  return WithPageLayout
}

function getComponentName(target: any) {
  return (
    (process.env.NODE_ENV !== "production"
      ? typeof target === "string" && target
      : false) ||
    target.displayName ||
    target.name ||
    "Component"
  )
}
