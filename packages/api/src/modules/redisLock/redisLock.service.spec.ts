import { Test, TestingModule } from '@nestjs/testing'
import { getRedisConnectionToken } from '@nestjs-modules/ioredis'

import { RedisLockService } from './redisLock.service'
describe('RedisLockService', () => {
  let service: RedisLockService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RedisLockService,
        {
          provide: getRedisConnectionToken(),
          useFactory: jest.fn(() => ({})),
        },
      ],
    }).compile()

    service = module.get<RedisLockService>(RedisLockService)
  })
  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
