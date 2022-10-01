import { ThemeProvider as Provider } from "next-themes"

const ThemeProvider = ({ Component, children }: any) => (
  <Provider
    attribute="class"
    forcedTheme={Component.theme || null}
    disableTransitionOnChange
  >
    propert... Remove this comment to see the full error message
    {children}
  </Provider>
)

export default ThemeProvider
