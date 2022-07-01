import { configValidationSchema, configConfiguration } from './config.schema'

export const configOptions = {
  isGlobal: true,
  envFilePath: [`./src/config/.env.${process.env.NODE_ENV}`],
  load: [configConfiguration],
  validationSchema: configValidationSchema,
  cache: true,
  validationOptions: {
    // Won't work because of system env variables
    // allowUnknown: false,
    abortEarly: true,
  },
}
