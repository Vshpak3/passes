import { Test, TestingModule } from '@nestjs/testing'
import { SettingsController } from './settings.controller'
import { SettingsService } from './settings.service'
import { getRepositoryToken } from '@mikro-orm/nestjs'
import { SettingsEntity } from './entities/settings.entity'
import { repositoryMockFactory } from '../../database/test-helpers'

describe('SettingsController', () => {
  let controller: SettingsController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SettingsController],
      providers: [
        SettingsService,
        {
          provide: getRepositoryToken(SettingsEntity),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile()

    controller = module.get<SettingsController>(SettingsController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
