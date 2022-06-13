import { ThemeProvider as Provider } from 'next-themes'
import type { ReactNode } from 'react'

export const ThemeProvider = ({
  Component,
  children,
}: {
  children?: ReactNode
  Component: { theme?: string }
}) => (
  <Provider
    attribute="class"
    forcedTheme={Component.theme}
    disableTransitionOnChange
  >
    {children}
  </Provider>
)
