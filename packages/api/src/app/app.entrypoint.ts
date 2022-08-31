import { App } from './app.main'

// eslint-disable-next-line @typescript-eslint/no-floating-promises
;(async () => {
  const app = new App()
  await app.init()
  await app.listen()
})()
