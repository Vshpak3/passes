import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { MikroOrmConfigService } from './mikro-orm.config.service'

@Module({
  imports: [ConfigModule],
  controllers: [],
  providers: [MikroOrmConfigService],
  exports: [MikroOrmConfigService],
})
export class MikroOrmConfigModule {}
