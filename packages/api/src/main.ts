import { App } from './app.Main'
;(async () => {
  const app = new App()
  await app.init()
  await app.listen()
})()
