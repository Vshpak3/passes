import { ThemeProvider as Provider } from "next-themes"

const ThemeProvider = ({ Component, children }) => (
  <Provider
    attribute="class"
    forcedTheme={Component.theme || null}
    disableTransitionOnChange
  >
    {children}
  </Provider>
)

export default ThemeProvider
