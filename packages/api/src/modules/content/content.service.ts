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
import { OrderEnum } from '../../util/dto/page.dto'
import { createPaginatedQuery } from '../../util/page.util'
import { PASS_NOT_OWNED_BY_USER } from '../pass/constants/errors'
import { PassMediaEnum } from '../pass/enum/pass-media.enum'
import { PassService } from '../pass/pass.service'
import { getCollectionMediaUri } from '../s3content/s3.nft.helper'
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
import { ContentDeleteError, NoContentError } from './error/content.error'
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
    const { contentType, inPost, inMessage } = createContentDto
    try {
      const id = uuid.v4()
      const data = {
        id,
        user_id: userId,
        content_type: contentType,
        in_post: inPost,
        in_message: inMessage,
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
    const { contentIds } = deleteContentDto
    await this.dbWriter.transaction(async (trx) => {
      const count = await trx<ContentEntity>(ContentEntity.table)
        .whereIn('id', contentIds)
        .andWhere({
          user_id: userId,
          in_message: false,
          in_post: false,
        })
        .update('deleted_at', new Date())
      if (count != contentIds.length) {
        throw new ContentDeleteError('could not delete all contents')
      }
    })
    return true
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
    let query = this.dbReader<ContentEntity>(ContentEntity.table)
      .whereNull('deleted_at')
      .andWhere({
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
    query = createPaginatedQuery(
      query,
      ContentEntity.table,
      ContentEntity.table,
      'created_at',
      OrderEnum.DESC,
      createdAt,
      lastId,
    )
    const result = await query
    return Promise.all(
      result.map(
        async (content) =>
          new ContentDto(
            content,
            await this.preSignMediaContentThumbnail(
              content.user_id,
              content.id,
            ),
          ),
      ),
    )
  }

  async preSignMediaContent(
    userId: string,
    contentId: string,
    contentType: ContentTypeEnum,
  ) {
    return this.s3contentService.signUrlForContentViewing(
      `media/${userId}/${contentId}.${getContentTypeFormat(contentType)}`,
    )
  }

  async preSignMediaContentThumbnail(userId: string, contentId: string) {
    return this.s3contentService.signUrlForContentViewing(
      `media/${userId}/${contentId}-thumbnail.jpeg`, // all thumbnails are jpeg
    )
  }

  async preSignUploadContent(
    userId: string,
    createContentDto: CreateContentRequestDto,
  ) {
    const contentId = await this.createContent(userId, createContentDto)
    return this.s3contentService.signUrlForContentUpload(
      `upload/${userId}/${contentId}.${getContentTypeFormat(
        createContentDto.contentType,
      )}`,
    )
  }

  async preSignProfileImage(userId: string, type: 'profile' | 'banner') {
    return this.s3contentService.signUrlForContentUpload(
      `profile/upload/${userId}/${type}.${ContentFormatEnum.IMAGE}`,
    )
  }

  async preSignPass(userId: string, passId: string, type: PassMediaEnum) {
    const pass = await this.passService.getPass(passId)
    if (pass.creatorId !== userId) {
      throw new ForbiddenException(PASS_NOT_OWNED_BY_USER)
    }

    return this.s3contentService.signUrlForContentUpload(
      getCollectionMediaUri(null, passId, type),
    )
  }

  async preSignW9(userId: string) {
    return this.s3contentService.signUrlForContentUpload(
      `w9/${userId}/upload.pdf`,
    )
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
