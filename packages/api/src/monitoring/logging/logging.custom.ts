import { LoggerService } from '@nestjs/common'
import { WinstonModule } from 'nest-winston'

import { loggingOptions } from './logging.options'

// Creates a logger to be used in the application startup so that the
// bootstrap/startup logs are formatted correctly
export const createLogger = async (): Promise<LoggerService> => {
  return WinstonModule.createLogger(await loggingOptions.useFactory())
}
