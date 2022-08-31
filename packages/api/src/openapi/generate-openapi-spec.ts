import { writeFileSync } from 'fs'

import { App } from '../app/app.main'

// Generates OpenAPI JSON file from application
// eslint-disable-next-line @typescript-eslint/no-floating-promises
;(async () => {
  console.log('Generating OpenAPI JSON file') // eslint-disable-line no-console
  const app = new App()
  await app.init()

  // Creates the JSON string from the OpenAPI document and then removes the
  // word "Controller" from operationIds
  let content = JSON.stringify(app.document, null, 2)
  content = content.replace(
    /"operationId": "(.*)Controller_/g,
    '"operationId": "$1_',
  )

  writeFileSync('openapi.json', content, { encoding: 'utf8' })

  await app.app.close()

  process.exit()
})()
