import { WinstonModuleOptions } from 'nest-winston'
import * as winston from 'winston'

export const loggingOptions = {
  useFactory: async (): Promise<WinstonModuleOptions> => ({
    level: 'info',
    format: winston.format.json(),
    transports: new winston.transports.Console(),
  }),
  inject: [],
}
