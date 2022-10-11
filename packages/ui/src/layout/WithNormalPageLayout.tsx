import React, { FC } from "react"
import { AuthWrapper } from "src/components/wrappers/AuthWrapper"
import { isProd } from "src/helpers/env"

import { CreatorSearchBar } from "./CreatorSearchBar"
import { Sidebar } from "./Sidebar"

class WithNormalPageLayoutOptions {
  skipAuth?: boolean = false
  creatorOnly?: boolean = false
  header?: boolean = true
  sidebar?: boolean = true

  constructor(init?: Partial<WithNormalPageLayoutOptions>) {
    Object.assign(this, init)
  }
}

export const WithNormalPageLayout = (
  Page: any,
  options: WithNormalPageLayoutOptions = {}
) => {
  options = new WithNormalPageLayoutOptions(options)
  const WithNormalPageLayout = React.forwardRef((props, ref) => (
    <div className="relative flex min-h-screen w-full bg-black">
      {options.sidebar && <Sidebar />}
      <main className="w-full bg-[#000]">
        {options.header && (
          <div className="cover-image h-[300px] pr-10 pt-4">
            <CreatorSearchBar />
          </div>
        )}
        <div className="flex shrink-0 flex-col">
          <AuthWrapper
            isPage
            skipAuth={!!options.skipAuth}
            creatorOnly={!!options.creatorOnly}
          >
            <Page {...props} ref={ref} />
          </AuthWrapper>
        </div>
      </main>
    </div>
  ))
  WithNormalPageLayout.displayName = `WithNormalPageLayout(${getComponentName(
    Page
  )})`
  return WithNormalPageLayout
}

function getComponentName(target: FC) {
  return isProd ? "Component" : target.displayName || target.name
}
