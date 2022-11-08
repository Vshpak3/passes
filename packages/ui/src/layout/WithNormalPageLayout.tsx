import classNames from "classnames"
import React, { FC, forwardRef, ReactElement } from "react"

import { AuthWrapper } from "src/components/wrappers/AuthWrapper"
import { isProd } from "src/helpers/env"
import { CreatorSearchBar } from "./CreatorSearchBar"
import { Sidebar } from "./Sidebar"

class WithNormalPageLayoutOptions {
  skipAuth?: boolean = false
  creatorOnly?: boolean = false
  header?: boolean = true
  sidebar?: boolean = true
  background?: boolean = true

  constructor(init?: Partial<WithNormalPageLayoutOptions>) {
    Object.assign(this, init)
  }
}

export const WithNormalPageLayout = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Page: any,
  options: WithNormalPageLayoutOptions = {}
) => {
  options = new WithNormalPageLayoutOptions(options)
  const component = forwardRef((props, ref) => <Page {...props} ref={ref} />)
  component.displayName = `WithNormalPageLayout(${getComponentName(Page)})`

  return {
    // https://nextjs.org/docs/basic-features/layouts
    // tl;dr: pages that share layout won't re-render on navigation
    getLayout: (page: ReactElement, hasRefreshed: boolean) => (
      <div
        className={classNames(
          options.background ? "background-gradient" : "bg-passes-black",
          "relative w-full "
        )}
      >
        <div className="mx-auto block max-w-[3000px]">
          <div className="relative w-full grid-cols-10 md:grid ">
            {options.sidebar && <Sidebar />}
            <main
              className={classNames(
                options.sidebar ? "lg:col-span-7" : "lg:col-span-12",
                "col-span-12 flex w-full flex-col "
              )}
            >
              {options.header && (
                <div className="cover-image col-span-12 h-[200px] pr-10 pt-4">
                  <span className="hidden lg:block">
                    <CreatorSearchBar />
                  </span>
                </div>
              )}
              <AuthWrapper
                creatorOnly={!!options.creatorOnly}
                hasRefreshed={hasRefreshed}
                isPage
                skipAuth={!!options.skipAuth}
              >
                {page}
              </AuthWrapper>
            </main>
          </div>
        </div>
      </div>
    ),
    ...component
  }
}

function getComponentName(target: FC) {
  return isProd ? "Component" : target.displayName || target.name
}
