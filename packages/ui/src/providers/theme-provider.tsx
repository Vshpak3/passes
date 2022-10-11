import { ThemeProvider as Provider } from "next-themes"
import { FC } from "react"

interface ThemeProviderProps {
  Component: any
  children: any
}

export const ThemeProvider: FC<ThemeProviderProps> = ({
  Component,
  children
}) => (
  <Provider
    attribute="class"
    forcedTheme={Component.theme || null}
    disableTransitionOnChange
  >
    {children}
  </Provider>
)
