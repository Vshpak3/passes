import { ConfigModule, ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'

import { configOptions } from '../config/config.options'
import { DB_WRITER } from './database.decorator'
import { getMikroOrmOptions } from './mikro-orm.options'

// This is needed for the mikro-orm cli to run. This file is specified in
// package.json.

// eslint-disable-next-line import/no-default-export
export default (async () => {
  // Use standalone applications to get the configService instance
  // https://docs.nestjs.com/standalone-applications
  const app = await NestFactory.createApplicationContext(
    ConfigModule.forRoot(configOptions),
  )
  const configService = app.get(ConfigService)
  const options = getMikroOrmOptions(configService, DB_WRITER)
  await app.close()
  return options
})()
