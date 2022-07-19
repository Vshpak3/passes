import { MikroOrmModule } from '@mikro-orm/nestjs'
import { Global, Module } from '@nestjs/common'

import { GemBalanceEntity } from './entities/gem.balance.entity'
import { GemPackageEntity } from './entities/gem.package.entity'
import { GemTransactionEntity } from './entities/gem.transaction.entity'
import { GemController } from './gem.controller'
import { GemService } from './gem.service'

@Global()
@Module({
  imports: [
    MikroOrmModule.forFeature([
      GemTransactionEntity,
      GemBalanceEntity,
      GemPackageEntity,
    ]),
  ],
  controllers: [GemController],
  providers: [GemService],
  exports: [GemService],
})
export class GemModule {}
