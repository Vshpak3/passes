// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable sonarjs/no-duplicate-string */
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'

import { Database } from '../../database/database.decorator'
import { DatabaseService } from '../../database/database.service'
import { CONTENT_NOT_EXIST } from './constants/errors'
import { ContentDto } from './dto/content.dto'
import { CreateContentRequestDto } from './dto/create-content.dto'
import { GetContentResponseDto } from './dto/get-content.dto'
import { UpdateContentRequestDto } from './dto/update-content.dto'
import { ContentEntity } from './entities/content.entity'
import { ContentTypeEnum } from './enums/content-type.enum'
import { VaultCategoryEnum } from './enums/vault-category.enum'

@Injectable()
export class ContentService {
  constructor(
    @Database('ReadOnly')
    private readonly dbReader: DatabaseService['knex'],
    @Database('ReadWrite')
    private readonly dbWriter: DatabaseService['knex'],
  ) {}

  async createContent(
    userId: string,
    createContentDto: CreateContentRequestDto,
  ): Promise<GetContentResponseDto> {
    try {
      const data = ContentEntity.toDict<ContentEntity>({
        user: userId,
        ...createContentDto,
      })
      await this.dbWriter(ContentEntity.table).insert(data)
      return new GetContentResponseDto(data, '') //TODO: put in signed url
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

    return new GetContentResponseDto(content, '') //TODO: put in signed url
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

    return new GetContentResponseDto(
      {
        id: contentId,
        ...updateContentDto,
      },
      '', //TODO: put in signed url
    )
  }

  async getVault(
    userId: string,
    category?: VaultCategoryEnum,
    type?: ContentTypeEnum,
  ) {
    let query = this.dbReader(ContentEntity.table).where(
      ContentEntity.toDict<ContentEntity>({
        user: userId,
      }),
    )
    switch (category) {
      // filter content that has been used in messages
      case VaultCategoryEnum.MESSAGES: //TOODO
        query = query.andWhere(
          ContentEntity.toDict<ContentEntity>({
            inMessage: true,
          }),
        )
        break
      // filter content that has been used in posts
      case VaultCategoryEnum.POSTS:
        query = query.andWhere(
          ContentEntity.toDict<ContentEntity>({
            inPost: true,
          }),
        )

        break
      case VaultCategoryEnum.UPLOADS:
        // filter content that has not been used anywhere (uploaded directly to vault)
        query = query.andWhere(
          ContentEntity.toDict<ContentEntity>({
            inMessage: false,
            inPost: false,
          }),
        )
        break

      default:
        break
    }
    if (type)
      query = query.andWhere(
        ContentEntity.toDict<ContentEntity>({ contentType: type }),
      )
    return (await query.select([`${ContentEntity.table}.*`])).map(
      (content) => new ContentDto(content, ''),
    ) //TODO put in signed url
  }
}
