import classNames from "classnames"
import React, { FC, forwardRef, ReactElement } from "react"

import { SectionTitle } from "src/components/atoms/SectionTitle"
import { AuthWrapper } from "src/components/wrappers/AuthWrapper"
import { isProd } from "src/helpers/env"
import { CreatorSearchBar } from "./CreatorSearchBar"
import { Sidebar } from "./Sidebar"

class WithNormalPageLayoutOptions {
  skipAuth?: boolean = false
  creatorOnly?: boolean = false
  header?: boolean = true
  headerTitle?: string
  headerClassName?: string
  sidebar?: boolean = true
  background?: boolean = true
  consistent?: boolean = true

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

  const { headerTitle, sidebar, header, headerClassName } = options
  return {
    // https://nextjs.org/docs/basic-features/layouts
    // tl;dr: pages that share layout won't re-render on navigation
    getLayout: (page: ReactElement, hasRefreshed: boolean) => (
      <div
        className={classNames(
          options.background ? "background-gradient" : "bg-passes-black",
          "relative w-full lg:pb-0",
          options.consistent && "pb-16"
        )}
      >
        <div className="mx-auto block max-w-[3000px]">
          <div className="relative min-h-screen w-full grid-cols-10 md:grid">
            {sidebar && <Sidebar />}
            <main
              className={classNames(
                sidebar ? "lg:col-span-7" : "lg:col-span-12",
                "col-span-12 flex h-full w-full flex-col"
              )}
            >
              {header && (
                <div
                  className={classNames(
                    "col-span-12 flex h-16 justify-between border-b-[0.5px] border-passes-gray pt-2 lg:col-span-7",
                    headerClassName
                  )}
                >
                  <div className="flex-1">
                    {headerTitle && (
                      <SectionTitle className="ml-4 mt-3 hidden lg:block">
                        {headerTitle}
                      </SectionTitle>
                    )}
                  </div>
                  <span className="mr-8 hidden lg:block">
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
                {headerTitle && (
                  <SectionTitle className="ml-4 mt-3 lg:hidden">
                    {headerTitle}
                  </SectionTitle>
                )}
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
