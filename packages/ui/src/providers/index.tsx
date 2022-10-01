import ThemeProvider from "./theme-provider"

const Providers = ({ children, Component, pageProps }: any) => {
  const providers = [ThemeProvider]

  return (
    <>
      {providers.reduceRight(
        (accumulator: any, Provider: any) => (
          <Provider Component={Component} pageProps={pageProps}>
            shorthand propert... Remove this comment to see the full error
            message
            {accumulator}
          </Provider>
        ),
        children
      )}
    </>
  )
}

export default Providers
