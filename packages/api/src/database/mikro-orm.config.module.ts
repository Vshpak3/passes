import { Module } from '@nestjs/common'

import { MikroOrmConfigService } from './mikro-orm.config.service'

@Module({
  imports: [],
  controllers: [],
  providers: [MikroOrmConfigService],
  exports: [MikroOrmConfigService],
})
export class MikroOrmConfigModule {}
