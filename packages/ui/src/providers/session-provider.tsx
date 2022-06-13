import type { Session } from 'next-auth'
import { SessionProvider as Provider } from 'next-auth/react'
import type { ReactNode } from 'react'

export const SessionProvider = ({
  children,
  pageProps,
}: {
  children?: ReactNode
  pageProps: { session: Session }
}) => <Provider session={pageProps.session}>{children}</Provider>
