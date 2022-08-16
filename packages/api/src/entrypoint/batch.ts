// import { NestFactory } from '@nestjs/core'
// import { AppModule } from '../app.module'

import { TaskDirectory } from '../batch.directory'
;(async () => {
  const args = process.argv.slice(2)
  const batchTaskName = args[0]
  const batchTaskArgs = args.slice(1)

  console.log(
    `Running batch task '${batchTaskName}' with args: ${batchTaskArgs}`,
  )

  if (TaskDirectory[batchTaskName] === undefined) {
    throw new Error(
      `A batch task with name '${batchTaskName}' is not in the task directory`,
    )
    process.exit(1)
  }

  // TODO: properly integrate this with the app
  // const app = await NestFactory.create(AppModule)

  // Run the task
  await TaskDirectory[batchTaskName](...batchTaskArgs)

  console.log('Completed running task')
  process.exit(0)
})()
