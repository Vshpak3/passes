import { App } from './app.main'
;(async () => {
  const app = new App()
  await app.init()
  await app.listen()
})()
