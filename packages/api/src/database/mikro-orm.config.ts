import { ConfigService } from '@nestjs/config'

import { getDatabaseOptions } from './mikro-orm.options'

// This is needed for the mikro-orm cli to run. This file is specified in
// package.json.
// TODO: pull from .env file
export default getDatabaseOptions(
  new ConfigService({
    'database.host': 'localhost',
    'database.port': '3306',
    'database.user': 'root',
    'database.password': 'root',
    'database.dbname': 'moment',
  }),
)
