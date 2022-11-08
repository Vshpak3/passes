import { WINSTON_MODULE_PROVIDER } from 'nest-winston'

import { App } from '../app/app.main'
import { TaskDirectory } from '../batch/batch.directory'
import { closeSentry } from '../monitoring/sentry/sentry.helper'
// eslint-disable-next-line import/newline-after-import
;(async () => {
  const args = process.argv.slice(2)
  const batchTaskName = args[0]
  const batchTaskArgs = args.slice(1)

  // Instantiate the app
  const app = await App.initStandalone()
  const logger = app.get(WINSTON_MODULE_PROVIDER)

  logger.info(
    `Running batch task '${batchTaskName}' with args: ${batchTaskArgs}`,
  )

  if (TaskDirectory[batchTaskName] === undefined) {
    throw new Error(
      `A batch task with name '${batchTaskName}' is not in the task directory`,
    )
  }

  // Run the task
  try {
    await new TaskDirectory[batchTaskName](app, logger).run(...batchTaskArgs)
  } catch (err) {
    logger.error(`Batch job '${batchTaskName}' failed`, err)
    await closeSentry()
    throw err
  }

  logger.info('Completed running task')
  await closeSentry()
  await process.exit(0)
})()
