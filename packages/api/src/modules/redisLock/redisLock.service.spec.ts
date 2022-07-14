import { Test, TestingModule } from '@nestjs/testing'
import { RedisModule } from '@nestjs-modules/ioredis'

import { redisOptions } from '../../database/redis.options'
import { RedisLockService } from './redisLock.service'
describe('RedisLockService', () => {
  let service: RedisLockService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [RedisModule.forRootAsync(redisOptions)],
      providers: [RedisLockService],
    }).compile()

    service = module.get<RedisLockService>(RedisLockService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
