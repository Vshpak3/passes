import { Global, Module } from '@nestjs/common'
import { RedisModule } from '@nestjs-modules/ioredis'

import { RedisLockService } from './redis-lock.service'

@Global()
@Module({
  imports: [RedisModule],
  controllers: [],
  providers: [RedisLockService],
  exports: [RedisLockService],
})
export class RedisLockModule {}
