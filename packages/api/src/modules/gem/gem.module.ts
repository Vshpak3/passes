import { MikroOrmModule } from '@mikro-orm/nestjs'
import { Global, Module } from '@nestjs/common'

import { GemBalanceEntity } from './entities/gem.balance.entity'
import { GemTransactionEntity } from './entities/gem.transaction.entity'
import { GemService } from './gem.service'

@Global()
@Module({
  imports: [
    MikroOrmModule.forFeature([GemTransactionEntity, GemBalanceEntity]),
  ],
  controllers: [],
  providers: [GemService],
  exports: [GemService],
})
export class GemModule {}
