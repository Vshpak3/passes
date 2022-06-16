import SessionProvider from "./session-provider"
import ThemeProvider from "./theme-provider"

const Providers = ({ children, Component, pageProps }) => {
  const providers = [SessionProvider, ThemeProvider]

  return (
    <>
      {providers.reduceRight(
        (accumulator, Provider) => (
          <Provider Component={Component} pageProps={pageProps}>
            {accumulator}
          </Provider>
        ),
        children
      )}
    </>
  )
}

export default Providers
