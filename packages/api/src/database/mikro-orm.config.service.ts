import { Connection, IDatabaseDriver } from '@mikro-orm/core'
import {
  MikroOrmModuleOptions,
  MikroOrmOptionsFactory,
} from '@mikro-orm/nestjs'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { ContextName, getMikroOrmOptions } from './mikro-orm.options'

@Injectable()
export class MikroOrmConfigService implements MikroOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}
  createMikroOrmOptions(
    contextName: ContextName,
  ): MikroOrmModuleOptions<IDatabaseDriver<Connection>> {
    return getMikroOrmOptions(this.configService, contextName)
  }
}
