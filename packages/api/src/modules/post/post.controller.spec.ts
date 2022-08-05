import { getRepositoryToken } from '@mikro-orm/nestjs'
import { Test, TestingModule } from '@nestjs/testing'

import { getDatabaseProviderToken } from '../../database/database.provider'
import { contextNames } from '../../database/mikro-orm.options'
import {
  databaseServiceMockFactory,
  repositoryMockFactory,
} from '../../database/test-helpers'
import { PostEntity } from './entities/post.entity'
import { PostRequiredPassEntity } from './entities/postrequiredpass.entity'
import { PostController } from './post.controller'
import { PostService } from './post.service'

describe('PostController', () => {
  let controller: PostController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostController],
      providers: [
        PostService,
        {
          provide: getRepositoryToken(PostEntity, 'ReadWrite'),
          useFactory: repositoryMockFactory,
        },
        {
          provide: getRepositoryToken(PostRequiredPassEntity),
          useFactory: repositoryMockFactory,
        },
        ...contextNames.map((contextName) => ({
          provide: getDatabaseProviderToken(contextName),
          useFactory: databaseServiceMockFactory,
        })),
      ],
    }).compile()

    controller = module.get<PostController>(PostController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
