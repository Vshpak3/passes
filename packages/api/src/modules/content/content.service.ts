// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable sonarjs/no-duplicate-string */
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'
import { v4 } from 'uuid'

import { Database } from '../../database/database.decorator'
import { DatabaseService } from '../../database/database.service'
import { CONTENT_NOT_EXIST } from './constants/errors'
import { ContentType, VaultCategory } from './constants/validation'
import { ContentDto } from './dto/content.dto'
import { CreateContentRequestDto } from './dto/create-content.dto'
import { GetContentResponseDto } from './dto/get-content.dto'
import { UpdateContentRequestDto } from './dto/update-content.dto'
import { ContentEntity } from './entities/content.entity'
import { ContentMessageEntity } from './entities/content-message.entity'

@Injectable()
export class ContentService {
  constructor(
    @Database('ReadOnly')
    private readonly dbReader: DatabaseService['knex'],
    @Database('ReadWrite')
    private readonly dbWriter: DatabaseService['knex'],
  ) {}

  async create(
    userId: string,
    createContentDto: CreateContentRequestDto,
  ): Promise<GetContentResponseDto> {
    try {
      const id = v4()
      const data = ContentEntity.toDict<ContentEntity>({
        id,
        user: userId,
        ...createContentDto,
      })
      await this.dbWriter(ContentEntity.table).insert(data)

      return new GetContentResponseDto(data)
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  async findOne(id: string): Promise<GetContentResponseDto> {
    const content = await this.dbReader(ContentEntity.table)
      .where('id', id)
      .select('*')
      .first()
    if (!content) {
      throw new NotFoundException(CONTENT_NOT_EXIST)
    }

    return new GetContentResponseDto(content)
  }

  async update(
    contentId: string,
    updateContentDto: UpdateContentRequestDto,
  ): Promise<GetContentResponseDto> {
    const data = ContentEntity.toDict<ContentEntity>(updateContentDto)
    const updateCount = await this.dbWriter(ContentEntity.table)
      .update(data)
      .where({ id: contentId })

    if (!updateCount) {
      throw new NotFoundException(CONTENT_NOT_EXIST)
    }

    return new GetContentResponseDto({
      id: contentId,
      ...updateContentDto,
    })
  }

  async getVault(userId: string, category?: VaultCategory, type?: ContentType) {
    let query = this.dbReader(ContentEntity.table).where(
      ContentEntity.toDict<ContentEntity>({
        user: userId,
      }),
    )
    switch (category) {
      // filter content that has been used in messages
      case VaultCategory.MESSAGES:
        query = query
          .innerJoin(
            ContentMessageEntity.table,
            `${ContentEntity.table}.id`,
            `${ContentMessageEntity.table}.content_id`,
          )
          .select(['*', `${ContentEntity.table}.id`])
        break
      // filter content that has been used in posts
      case VaultCategory.POSTS:
        query = query
          .innerJoin(
            'content_post',
            `${ContentEntity.table}.id`,
            'content_post.content_entity_id',
          )
          .select(['*', `${ContentEntity.table}.id`])
        break
      case VaultCategory.UPLOADS:
        // filter content that has not been used anywhere (uploaded directly to vault)
        query = query
          .leftJoin(
            ContentMessageEntity.table,
            `${ContentEntity.table}.id`,
            `${ContentMessageEntity.table}.content_id`,
          )
          .leftJoin(
            'content_post',
            `${ContentEntity.table}.id`,
            'content_post.content_entity_id',
          )
          .andWhere(`${ContentMessageEntity.table}.content_id`, null)
          .andWhere('content_post.content_entity_id', null)
          .select(['*', `${ContentEntity.table}.id`])
        break

      default:
        break
    }
    if (type)
      query = query.andWhere(
        ContentEntity.toDict<ContentEntity>({ contentType: type }),
      )
    return (await query).map((content) => new ContentDto(content))
  }
}
