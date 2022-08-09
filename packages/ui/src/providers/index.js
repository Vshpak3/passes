import ThemeProvider from "./theme-provider"

const Providers = ({ children, Component, pageProps }) => {
  const providers = [ThemeProvider]

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
