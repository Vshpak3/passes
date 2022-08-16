import { NestFactory } from '@nestjs/core'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'

import { AppModule } from '../app.module'
import { TaskDirectory } from '../batch/batch.directory'
;(async () => {
  const args = process.argv.slice(2)
  const batchTaskName = args[0]
  const batchTaskArgs = args.slice(1)

  // Instantiate the app
  const app = await NestFactory.createApplicationContext(AppModule)
  const logger = app.get(WINSTON_MODULE_PROVIDER)

  logger.info(
    `Running batch task '${batchTaskName}' with args: ${batchTaskArgs}`,
  )

  if (TaskDirectory[batchTaskName] === undefined) {
    throw new Error(
      `A batch task with name '${batchTaskName}' is not in the task directory`,
    )
    process.exit(1)
  }

  // Run the task
  await new TaskDirectory[batchTaskName](app, logger).run(...batchTaskArgs)

  logger.info('Completed running task')
  process.exit(0)
})()
