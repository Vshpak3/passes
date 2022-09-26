import { writeFileSync } from 'fs'

import { App } from '../app/app.main'

const OUTPUT_PATH = 'src/openapi/specs'

// Generates OpenAPI JSON file from application
;(async () => {
  console.log('Generating OpenAPI JSON file') // eslint-disable-line no-console
  const app = new App()
  await app.init()

  // Check for optional filename argument
  let filename = 'openapi.json'
  if (process.argv.length === 3) {
    filename = process.argv[2]
  }

  // Creates the JSON string from the OpenAPI document and then removes the
  // word "Controller" from operationIds
  let content = JSON.stringify(app.document, null, 2)
  content = content.replace(
    /"operationId": "(.*)Controller_/g,
    '"operationId": "$1_',
  )

  writeFileSync(`${OUTPUT_PATH}/${filename}`, content, { encoding: 'utf8' })

  await app.app.close()

  process.exit()
})()
