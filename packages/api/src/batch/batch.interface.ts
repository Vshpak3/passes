import { INestApplicationContext } from '@nestjs/common'
import { Logger } from 'winston'

/*
 * Class that all batch tasks must subclass. Batch framework will invoke the run() method.
 */
export abstract class BatchTask {
  app: INestApplicationContext
  logger: Logger

  constructor(app: INestApplicationContext, logger: Logger) {
    this.app = app
    this.logger = logger
  }

  abstract run(...args: any[]): Promise<void>
}
