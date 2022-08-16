import { Module } from '@nestjs/common'

import { RedisLockModule } from '../redisLock/redisLock.module'
import { EthController } from './eth.controller'
import { EthService } from './eth.service'

@Module({
  imports: [RedisLockModule],
  controllers: [EthController],
  providers: [EthService],
  exports: [EthService],
})
export class EthModule {}
