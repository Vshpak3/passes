import { Global, Module } from '@nestjs/common'
import { RedisModule } from '@nestjs-modules/ioredis'

import { RedisLockService } from './redisLock.service'

@Global()
@Module({
  imports: [RedisModule],
  providers: [RedisLockService],
  exports: [RedisLockService],
})
export class RedisLockModule {}
