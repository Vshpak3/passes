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
import { CreateContentDto } from './dto/create-content.dto'
import { GetContentDto } from './dto/get-content.dto'
import { UpdateContentDto } from './dto/update-content.dto'
import { ContentEntity } from './entities/content.entity'
import { ContentMessageEntity } from './entities/content-message.entity'
import { ContentPostEntity } from './entities/content-post.entity'

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
    createContentDto: CreateContentDto,
  ): Promise<GetContentDto> {
    try {
      const id = v4()
      const data = ContentEntity.toDict<ContentEntity>({
        id,
        user: userId,
        ...createContentDto,
      })
      await this.dbWriter(ContentEntity.table).insert(data)

      return new GetContentDto(data)
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  async findOne(id: string): Promise<GetContentDto> {
    const content = await this.dbReader(ContentEntity.table)
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
    const data = ContentEntity.toDict<ContentEntity>(updateContentDto)
    const updateCount = await this.dbWriter(ContentEntity.table)
      .update(data)
      .where({ id: contentId })

    if (!updateCount) {
      throw new NotFoundException(CONTENT_NOT_EXIST)
    }

    return new GetContentDto({
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
            ContentPostEntity.table,
            `${ContentEntity.table}.id`,
            `${ContentPostEntity.table}.content_id`,
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
            ContentPostEntity.table,
            `${ContentEntity.table}.id`,
            `${ContentPostEntity.table}.content_id`,
          )
          .andWhere(`${ContentMessageEntity.table}.content_id`, null)
          .andWhere(`${ContentPostEntity.table}.content_id`, null)
          .select(['*', `${ContentEntity.table}.id`])
        break

      default:
        break
    }
    if (type)
      query = query.andWhere(
        ContentEntity.toDict<ContentEntity>({ contentType: type }),
      )
    return (await query).map((content) => new GetContentDto(content))
  }
}
