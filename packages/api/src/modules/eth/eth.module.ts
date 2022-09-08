import { Module } from '@nestjs/common'

import { RedisLockModule } from '../redis-lock/redis-lock.module'
import { EthService } from './eth.service'

@Module({
  imports: [RedisLockModule],
  controllers: [],
  providers: [EthService],
  exports: [EthService],
})
export class EthModule {}
