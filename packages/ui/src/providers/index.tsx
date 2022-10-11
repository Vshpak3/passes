import { FC } from "react"

import { ThemeProvider } from "./theme-provider"

interface ProvidersProps {
  children: any
  Component: any
  pageProps: any
}

export const Providers: FC<ProvidersProps> = ({
  children,
  Component,
  pageProps
}) => {
  const providers = [ThemeProvider]

  return providers.reduceRight(
    (accumulator: any, Provider: any) => (
      <Provider Component={Component} pageProps={pageProps}>
        {accumulator}
      </Provider>
    ),
    children
  )
}
