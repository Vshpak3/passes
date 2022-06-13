import 'src/styles/global/main.css'

import type { AppProps } from 'next/app'
import { DefaultHead } from 'src/components/head'
import { useMessageToDevelopers } from 'src/hooks/use-message-to-developers'
import { Providers } from 'src/providers'

const App = ({ Component, pageProps }: AppProps) => {
  useMessageToDevelopers([
    "Hey developers! We're hiring: https://jobs.lever.co/Moment",
    'Have an awesome day :-)',
  ])

  return (
    <Providers Component={Component} pageProps={pageProps}>
      <DefaultHead />
      <Component {...pageProps} />
    </Providers>
  )
}

export default App
