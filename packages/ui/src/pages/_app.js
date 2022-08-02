import "src/styles/global/main.css"

// import "../components/messages/MomentMessage.scss"
import debounce from "lodash.debounce"
import Router from "next/router"
import nprogress from "nprogress"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import DefaultHead from "src/components/head"
import useMessageToDevelopers from "src/hooks/use-message-to-developers"
import Providers from "src/providers"

// Only show nprogress after 500ms (slow loading)
const start = debounce(nprogress.start, 500)
Router.events.on("routeChangeStart", start)
Router.events.on("routeChangeComplete", () => {
  start.cancel()
  nprogress.done()
  window.scrollTo(0, 0)
})
Router.events.on("routeChangeError", () => {
  start.cancel()
  nprogress.done()
})

const App = ({ Component, pageProps }) => {
  useMessageToDevelopers([
    "Hey developers! We're hiring: https://jobs.lever.co/Moment",
    "Have an awesome day :-)"
  ])

  return (
    <Providers Component={Component} pageProps={pageProps}>
      <DefaultHead />
      <DndProvider backend={HTML5Backend}>
        <Component {...pageProps} />
      </DndProvider>
    </Providers>
  )
}

export default App
