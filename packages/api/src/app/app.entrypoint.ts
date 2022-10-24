import { App } from './app.main'

// eslint-disable-next-line import/newline-after-import
;(async () => {
  const app = new App()
  await app.init()
  await app.listen()
})()
