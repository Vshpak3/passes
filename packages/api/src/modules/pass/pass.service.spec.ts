import { Test, TestingModule } from '@nestjs/testing'
import { PassService } from './pass.service'
import { getRepositoryToken } from '@mikro-orm/nestjs'
import { PassEntity } from './entities/pass.entity'
import { EntityRepository } from '@mikro-orm/core'
import { repositoryMockFactory } from '../../database/test-helpers'

describe('PassService', () => {
  let service: PassService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PassService,
        {
          provide: getRepositoryToken(PassEntity),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile()

    service = module.get<PassService>(PassService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
