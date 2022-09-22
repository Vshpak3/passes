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
    <div className="relative flex min-h-screen w-full bg-black">
      <Sidebar />
      <main className="w-full bg-[#000]">
        {options.header && (
          <div className="cover-image h-[300px] pr-10 pt-4">
            <CreatorSearchBar />
          </div>
        )}
        <div className="flex shrink-0 flex-col">
          <Page {...props} ref={ref} />
        </div>
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
