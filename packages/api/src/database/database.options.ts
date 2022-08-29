import type { Knex } from '@mikro-orm/mysql'

export function getKnexOptions(oldKnex: Knex): Knex.Config<any> {
  const connection = oldKnex.client.config.connection
  return {
    client: 'mysql2',
    connection: {
      database: connection.database,
      host: connection.host,
      port: connection.port,
      user: connection.user,
      password: connection.password,
      supportBigNumbers: true,
      bigNumberStrings: false,
      decimalNumbers: true,
    },
  }
}
