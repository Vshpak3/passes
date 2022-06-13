import type { NextComponentType, NextPageContext } from 'next'
import type { Session } from 'next-auth'
import type { ReactNode } from 'react'

import { SessionProvider } from './session-provider'
import { ThemeProvider } from './theme-provider'

export const Providers = ({
  children,
  Component,
  pageProps,
}: {
  pageProps: { session: Session }
  children: ReactNode
  Component: NextComponentType<NextPageContext, any, { theme?: string }> & {
    theme?: string
  }
}) => {
  const providers = [SessionProvider, ThemeProvider]

  return (
    <>
      {providers.reduceRight(
        (accumulator, Provider) => (
          <Provider Component={Component} pageProps={pageProps}>
            {accumulator}
          </Provider>
        ),
        children,
      )}
    </>
  )
}
