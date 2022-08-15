import { Test, TestingModule } from '@nestjs/testing'

import { getBaseProviders } from '../../util/providers.test'
import { CollectionService } from './collection.service'

describe('CollectionService', () => {
  let service: CollectionService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CollectionService, ...getBaseProviders()],
    }).compile()

    service = module.get<CollectionService>(CollectionService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
