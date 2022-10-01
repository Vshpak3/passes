// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable sonarjs/no-duplicate-string */
import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'
import * as uuid from 'uuid'

import {
  Database,
  DB_READER,
  DB_WRITER,
} from '../../database/database.decorator'
import { DatabaseService } from '../../database/database.service'
import { PASS_NOT_OWNED_BY_USER } from '../pass/constants/errors'
import { PassService } from '../pass/pass.service'
import { S3ContentService } from '../s3content/s3content.service'
import { CONTENT_NOT_EXIST } from './constants/errors'
import { ContentDto } from './dto/content.dto'
import { CreateContentRequestDto } from './dto/create-content.dto'
import { DeleteContentRequestDto } from './dto/delete-content.dto'
import { GetContentResponseDto } from './dto/get-content.dto'
import { GetVaultQueryRequestDto } from './dto/get-vault-query-dto'
import { ContentEntity } from './entities/content.entity'
import { ContentFormatEnum } from './enums/content-format.enum'
import { ContentTypeEnum } from './enums/content-type.enum'
import { VaultCategoryEnum } from './enums/vault-category.enum'
import { NoContentError } from './error/content.error'
import { getContentTypeFormat } from './helpers/content-type-format.helper'

export const MAX_CONTENT_PER_REQUeST = 10

@Injectable()
export class ContentService {
  constructor(
    @Database(DB_READER)
    private readonly dbReader: DatabaseService['knex'],
    @Database(DB_WRITER)
    private readonly dbWriter: DatabaseService['knex'],
    private readonly s3contentService: S3ContentService,
    private readonly passService: PassService,
  ) {}

  async createContent(
    userId: string,
    createContentDto: CreateContentRequestDto,
  ): Promise<string> {
    try {
      const id = uuid.v4()
      const data = {
        id,
        user_id: userId,
        content_type: createContentDto.contentType,
      }
      await this.dbWriter<ContentEntity>(ContentEntity.table).insert(data)
      return id
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  async deleteContent(
    userId: string,
    deleteContentDto: DeleteContentRequestDto,
  ): Promise<boolean> {
    const { contentId } = deleteContentDto
    const deleted = await this.dbWriter<ContentEntity>(ContentEntity.table)
      .where({
        id: contentId,
        user_id: userId,
        in_message: false,
        in_post: false,
      })
      .delete()
    return deleted === 1
  }

  async findContent(id: string): Promise<GetContentResponseDto> {
    const content = await this.dbReader<ContentEntity>(ContentEntity.table)
      .where({ id: id })
      .select('*')
      .first()
    if (!content) {
      throw new NotFoundException(CONTENT_NOT_EXIST)
    }

    return new GetContentResponseDto(content, '')
  }

  async getVault(
    userId: string,
    getVaultQueryRequestDto: GetVaultQueryRequestDto,
  ) {
    const { category, type, lastId, createdAt } = getVaultQueryRequestDto
    let query = this.dbReader<ContentEntity>(ContentEntity.table).where({
      user_id: userId,
    })
    switch (category) {
      // filter content that has been used in messages
      case VaultCategoryEnum.MESSAGES: //TOODO
        query = query.andWhere({ in_message: true })
        break
      // filter content that has been used in posts
      case VaultCategoryEnum.POSTS:
        query = query.andWhere({ in_post: true })

        break
      case VaultCategoryEnum.UPLOADS:
        // filter content that has not been used anywhere (uploaded directly to vault)
        query = query.andWhere({
          in_message: false,
          in_post: false,
        })
        break

      default:
        break
    }
    if (type) {
      query = query.andWhere({ content_type: type })
    }
    if (createdAt) {
      query = query.andWhere(
        `${ContentEntity.table}.created_at`,
        '<=',
        createdAt,
      )
    }
    query = query.select('*').orderBy([
      { column: `${ContentEntity.table}.created_at`, order: 'desc' },
      { column: `${ContentEntity.table}.id`, order: 'desc' },
    ])
    const result = await query
    const index = result.findIndex((content) => content.id === lastId)
    return result.slice(index + 1).map((content) => new ContentDto(content, ''))
  }

  async preSignUploadContent(userId: string, contentType: ContentTypeEnum) {
    const contentId = await this.createContent(userId, { contentType })
    return this.s3contentService.preSignUrl(
      `upload/${userId}/${contentId}.${getContentTypeFormat(contentType)}`,
    )
  }

  async preSignMediaContent(
    userId: string,
    contentId: string,
    contentType: ContentTypeEnum,
  ) {
    return this.s3contentService.preSignUrl(
      `media/${userId}/${contentId}.${getContentTypeFormat(contentType)}`,
    )
  }

  async preSignProfileImage(userId: string, type: 'profile' | 'banner') {
    return this.s3contentService.preSignUrl(
      `profile/upload/${userId}/${type}.${ContentFormatEnum.IMAGE}`,
    )
  }

  async preSignPass(userId: string, passId: string) {
    const pass = await this.passService.findPass(passId)
    if (pass.creatorId !== userId) {
      throw new ForbiddenException(PASS_NOT_OWNED_BY_USER)
    }

    return this.s3contentService.preSignUrl(
      `pass/upload/${userId}/${pass.passId}.${ContentFormatEnum.IMAGE}`,
    )
  }

  async preSignW9(userId: string) {
    return this.s3contentService.preSignUrl(`w9/${userId}/upload.pdf`)
  }

  async validateContentIds(userId: string, contentIds: string[]) {
    const filteredContent = await this.dbReader<ContentEntity>(
      ContentEntity.table,
    )
      .whereIn('id', contentIds)
      .andWhere({ user_id: userId })
      .select('id')
    const filteredContentIds = new Set(
      filteredContent.map((content) => content.id),
    )

    contentIds.forEach((contentId) => {
      if (!filteredContentIds.has(contentId)) {
        throw new NoContentError('cant find content for user')
      }
    })
  }
}
