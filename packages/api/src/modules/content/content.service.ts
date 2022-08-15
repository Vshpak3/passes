import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'
import { v4 } from 'uuid'

import { Database } from '../../database/database.decorator'
import { DatabaseService } from '../../database/database.service'
import { CONTENT_NOT_EXIST } from './constants/errors'
import { CreateContentDto } from './dto/create-content.dto'
import { GetContentDto } from './dto/get-content.dto'
import { UpdateContentDto } from './dto/update-content.dto'
import { ContentEntity } from './entities/content.entity'

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

      return new GetContentDto(data.id, data.url, data.content_Type)
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

    return new GetContentDto(content.id, content.url, content.content_Type)
  }

  async update(
    contentId: string,
    updateContentDto: UpdateContentDto,
  ): Promise<GetContentDto> {
    const data = ContentEntity.toDict<ContentEntity>(updateContentDto)
    const updateCount = await this.dbWriter('content')
      .update(data)
      .where({ id: contentId })

    if (!updateCount) {
      throw new NotFoundException(CONTENT_NOT_EXIST)
    }

    return new GetContentDto(
      contentId,
      updateContentDto.url as string,
      updateContentDto.contentType as string,
    )
  }
}
