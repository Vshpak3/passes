import { Test, TestingModule } from '@nestjs/testing'
import { PostService } from './post.service'
import { getRepositoryToken } from '@mikro-orm/nestjs'
import { PostEntity } from './entities/post.entity'
import { repositoryMockFactory } from '../../database/test-helpers'

describe('PostService', () => {
  let service: PostService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostService,
        {
          provide: getRepositoryToken(PostEntity),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile()

    service = module.get<PostService>(PostService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
