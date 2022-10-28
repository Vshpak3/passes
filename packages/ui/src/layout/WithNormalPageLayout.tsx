import classNames from "classnames"
import React, { FC, ReactElement, ReactNode } from "react"

import { AuthWrapper } from "src/components/wrappers/AuthWrapper"
import { isProd } from "src/helpers/env"
import { CreatorSearchBar } from "./CreatorSearchBar"
import { Sidebar } from "./Sidebar"

class WithNormalPageLayoutOptions {
  skipAuth?: boolean = false
  creatorOnly?: boolean = false
  header?: boolean = true
  sidebar?: boolean = true
  sideContent?: ReactNode

  constructor(init?: Partial<WithNormalPageLayoutOptions>) {
    Object.assign(this, init)
  }
}

export const WithNormalPageLayout = (
  Page: any,
  options: WithNormalPageLayoutOptions = {}
) => {
  options = new WithNormalPageLayoutOptions(options)
  const component = React.forwardRef((props, ref) => (
    <Page {...props} ref={ref} />
  ))
  component.displayName = `WithNormalPageLayout(${getComponentName(Page)})`

  return {
    // https://nextjs.org/docs/basic-features/layouts
    // tl;dr: pages that share layout won't re-render on navigation
    getLayout: (page: ReactElement, hasRefreshed: boolean) => (
      <div className="relative grid min-h-screen w-full grid-cols-12 bg-passes-black">
        {options.sidebar && <Sidebar />}
        <main
          className={classNames(
            options.sideContent
              ? "lg:col-span-6"
              : options.sidebar
              ? "lg:col-span-9"
              : "lg:col-span-12",
            "col-span-12 flex w-full flex-col"
          )}
        >
          {options.header && (
            <div className="cover-image h-[200px] pr-10 pt-4">
              <span className="hidden lg:block">
                <CreatorSearchBar />
              </span>
            </div>
          )}
          <div className="flex shrink-0 flex-col">
            <AuthWrapper
              isPage
              skipAuth={!!options.skipAuth}
              creatorOnly={!!options.creatorOnly}
              hasRefreshed={hasRefreshed}
            >
              {page}
            </AuthWrapper>
          </div>
        </main>
        {options.sideContent && (
          <div className="sticky col-span-3 flex flex-col border-l border-gray-600">
            <div className="mt-4">
              <CreatorSearchBar />
            </div>
            {options.sideContent}
          </div>
        )}
      </div>
    ),
    ...component
  }
}

function getComponentName(target: FC) {
  return isProd ? "Component" : target.displayName || target.name
}
