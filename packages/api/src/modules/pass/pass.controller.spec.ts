import { Test, TestingModule } from '@nestjs/testing'
import { PassController } from './pass.controller'
import { PassService } from './pass.service'
import { getRepositoryToken } from '@mikro-orm/nestjs'
import { PassEntity } from './entities/pass.entity'
import { EntityRepository } from '@mikro-orm/core'
import { repositoryMockFactory } from '../../database/test-helpers'

describe('PassController', () => {
  let controller: PassController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PassController],
      providers: [
        PassService,
        {
          provide: getRepositoryToken(PassEntity),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile()

    controller = module.get<PassController>(PassController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
