import { Test, TestingModule } from '@nestjs/testing'
import { SettingsService } from './settings.service'
import { getRepositoryToken } from '@mikro-orm/nestjs'
import { SettingsEntity } from './entities/settings.entity'
import { EntityRepository } from '@mikro-orm/core'
import { repositoryMockFactory } from '../../database/test-helpers'

describe('SettingsService', () => {
  let service: SettingsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SettingsService,
        {
          provide: getRepositoryToken(SettingsEntity),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile()

    service = module.get<SettingsService>(SettingsService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
