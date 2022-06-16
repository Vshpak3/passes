import { SessionProvider as Provider } from "next-auth/react"

const SessionProvider = ({ children, pageProps }) => (
  <Provider session={pageProps.session}>{children}</Provider>
)

export default SessionProvider
