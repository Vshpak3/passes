import { Test, TestingModule } from '@nestjs/testing'

import { mockDatabaseService } from '../../database/test-helpers'
import { ProfileService } from './profile.service'

describe('ProfileService', () => {
  let service: ProfileService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProfileService, ...mockDatabaseService],
    }).compile()

    service = module.get<ProfileService>(ProfileService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
