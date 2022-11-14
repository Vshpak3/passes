import React, { forwardRef, ReactElement } from "react"

import { StandAlonePage } from "./StandAlonePage"
import { getComponentName } from "./WithNormalPageLayout"

export class WithStandAlonePageLayoutOptions {
  className?: string

  constructor(init?: Partial<WithStandAlonePageLayoutOptions>) {
    Object.assign(this, init)
  }
}

export const WithStandAlonePageLayout = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Page: any,
  options = {} as WithStandAlonePageLayoutOptions
) => {
  options = new WithStandAlonePageLayoutOptions(options)

  const { className } = options
  const component = forwardRef((props, ref) => <Page {...props} ref={ref} />)
  component.displayName = `WithStandAlonePageLayout(${getComponentName(Page)})`

  return {
    // https://nextjs.org/docs/basic-features/layouts
    // tl;dr: pages that share layout won't re-render on navigation
    getLayout: (page: ReactElement) => (
      <StandAlonePage className={className}>{page}</StandAlonePage>
    ),
    ...component
  }
}
