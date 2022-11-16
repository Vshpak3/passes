import classNames from "classnames"
import React, { FC, forwardRef, ReactElement } from "react"

import { SectionTitle } from "src/components/atoms/SectionTitle"
import { AuthWrapper } from "src/components/wrappers/AuthWrapper"
import { isProd } from "src/helpers/env"
import { Header } from "./Header"
import { Sidebar } from "./Sidebar"

class WithNormalPageLayoutOptions {
  skipAuth?: boolean = false
  creatorOnly?: boolean = false
  header?: boolean = true
  headerTitle?: string
  headerClassName?: string
  sidebar?: boolean = true
  background?: boolean = true
  noScroll?: boolean = false

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

  const {
    skipAuth,
    creatorOnly,
    headerTitle,
    sidebar,
    header,
    headerClassName,
    background
  } = options
  return {
    // https://nextjs.org/docs/basic-features/layouts
    // tl;dr: pages that share layout won't re-render on navigation
    getLayout: (page: ReactElement, hasRefreshed: boolean) => (
      <div
        className={classNames(
          "bg-passes-black",
          "min-safe-h-screen relative flex w-full lg:pb-0",
          !options.noScroll && "pb-16"
        )}
      >
        {background && (
          <>
            <div className="background-gradient fixed right-[0vw] top-[0vh] hidden h-[20vh] w-[20vh] blur-[10vh] md:block" />
            <div className="background-gradient fixed right-[5vw] top-[60vh] hidden h-[15vh] w-[15vh] blur-[13vh] md:block" />
          </>
        )}
        <div className="mx-auto block max-w-[3000px] flex-1">
          <div className="relative h-full w-full grid-cols-10 md:grid">
            {sidebar && <Sidebar />}
            <main
              className={classNames(
                sidebar ? "lg:col-span-7" : "lg:col-span-12",
                "col-span-12 flex h-full w-full flex-col"
              )}
            >
              {header && (
                <Header
                  headerClassName={headerClassName}
                  headerTitle={headerTitle}
                />
              )}
              <AuthWrapper
                creatorOnly={!!creatorOnly}
                hasRefreshed={hasRefreshed}
                isPage
                skipAuth={!!skipAuth}
              >
                {!!headerTitle && (
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

export function getComponentName(target: FC) {
  return isProd ? "Component" : target.displayName || target.name
}
