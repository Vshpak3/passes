import { Module } from '@nestjs/common'

import { RedisLockService } from '../redisLock/redisLock.service'
import { EthController } from './eth.controller'
import { EthService } from './eth.service'

@Module({
  controllers: [EthController],
  providers: [EthService, RedisLockService],
})
export class EthModule {}
