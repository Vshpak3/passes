import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'

import { Database } from '../../database/database.decorator'
import { DatabaseService } from '../../database/database.service'
import { PostEntity } from '../post/entities/post.entity'
import { CONTENT_NOT_EXIST, POST_NOT_EXIST } from './constants/errors'
import { CreateContentDto } from './dto/create-content.dto'
import { GetContentDto } from './dto/get-content.dto'
import { UpdateContentDto } from './dto/update-content.dto'
import { ContentEntity } from './entities/content.entity'

@Injectable()
export class ContentService {
  constructor(
    @Database('ReadOnly')
    private readonly ReadOnlyDatabaseService: DatabaseService,
    @Database('ReadWrite')
    private readonly ReadWriteDatabaseService: DatabaseService,
  ) {}

  async create(
    postId: string,
    createContentDto: CreateContentDto,
  ): Promise<GetContentDto> {
    const { knex, v4 } = this.ReadWriteDatabaseService

    const post = await this.ReadOnlyDatabaseService.knex(PostEntity.table)
      .where('id', postId)
      .select('id')
      .first()

    if (!post) {
      throw new BadRequestException(POST_NOT_EXIST)
    }

    try {
      const id = v4()
      const data = ContentEntity.toDict<ContentEntity>({
        id,
        post: postId,
        ...createContentDto,
      })
      await knex(ContentEntity.table).insert(data)

      return new GetContentDto(data)
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  async findOne(id: string): Promise<GetContentDto> {
    const content = await this.ReadOnlyDatabaseService.knex(ContentEntity.table)
      .where('id', id)
      .select('*')
      .first()
    if (!content) {
      throw new NotFoundException(CONTENT_NOT_EXIST)
    }

    return new GetContentDto(content)
  }

  async update(
    contentId: string,
    updateContentDto: UpdateContentDto,
  ): Promise<GetContentDto> {
    const { knex } = this.ReadWriteDatabaseService
    const data = ContentEntity.toDict<ContentEntity>(updateContentDto)
    const updateCount = await knex('content')
      .update(data)
      .where({ id: contentId })

    if (!updateCount) {
      throw new NotFoundException(CONTENT_NOT_EXIST)
    }

    return new GetContentDto({ id: contentId, ...updateContentDto })
  }
}
