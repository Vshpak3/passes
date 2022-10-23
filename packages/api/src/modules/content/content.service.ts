// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable sonarjs/no-duplicate-string */
import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'
import ms from 'ms'
import * as uuid from 'uuid'

import {
  Database,
  DB_READER,
  DB_WRITER,
} from '../../database/database.decorator'
import { DatabaseService } from '../../database/database.service'
import { createPaginatedQuery } from '../../util/page.util'
import { PASS_NOT_OWNED_BY_USER } from '../pass/constants/errors'
import { PassMediaEnum } from '../pass/enum/pass-media.enum'
import { PassService } from '../pass/pass.service'
import { getCollectionMediaUri } from '../s3content/s3.nft.helper'
import { S3ContentService } from '../s3content/s3content.service'
import { CONTENT_NOT_EXIST } from './constants/errors'
import { ContentDto } from './dto/content.dto'
import { ContentBareDto } from './dto/content-bare'
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

const MAX_VAULT_CONTENT_PER_REQUEST = 9 // should be a multiple of 3
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
        })
        .update('deleted_at', new Date())
      if (count !== contentIds.length) {
        throw new ContentDeleteError('could not delete all contents')
      }
    })
    return true
  }

  // TODO: Update this logic in PASS-959
  // async markProcessed(userId: string, contentId: string): Promise<void> {
  //   await this.dbWriter<ContentEntity>(ContentEntity.table)
  //     .where({ id: contentId })
  //     .andWhere({ user_id: userId })
  //     .update({ processed: true })
  // }

  // TODO: Update this logic in PASS-959
  // async isAllProcessed(contentIds: string[]): Promise<boolean> {
  async isAllProcessed(
    userId: string,
    content: ContentBareDto[],
  ): Promise<boolean> {
    return (
      await Promise.all(
        content.map(async (content) => {
          return await this.s3contentService.doesObjectExist(
            `media/${userId}/${content.contentId}.${getContentTypeFormat(
              content.contentType,
            )}`,
          )
        }),
      )
    ).every((b) => b)
    // const content = await this.dbReader<ContentEntity>(ContentEntity.table)
    //   .whereIn('id', contentIds)
    //   .select('processed')
    // return content.every((c) => c.processed)
  }

  async checkProcessed(): Promise<void> {
    const contents = await this.dbReader<ContentEntity>(ContentEntity.table)
      .where({ processed: false, failed: false })
      .select('*')
    const checks = await Promise.all(
      contents.map(async (content) => {
        return await this.s3contentService.doesObjectExist(
          `media/${content.user_id}/${content.id}.${getContentTypeFormat(
            content.content_type,
          )}`,
        )
      }),
    )
    const now = Date.now()
    const successfulIds = contents
      .filter((_, ind) => checks[ind])
      .map((content) => content.id)
    await this.dbWriter<ContentEntity>(ContentEntity.table)
      .whereIn('id', successfulIds)
      .update('processed', true)
    const failedIds = contents
      .filter(
        (content, ind) =>
          !checks[ind] && content.created_at.valueOf() + ms('20 minutes') < now,
      )
      .map((content) => content.id)
    await this.dbWriter<ContentEntity>(ContentEntity.table)
      .whereIn('id', failedIds)
      .update('failed', true)
    return await this.dbReader()
  }

  async findContent(contentId: string): Promise<GetContentResponseDto> {
    const content = await this.dbReader<ContentEntity>(ContentEntity.table)
      .where({ id: contentId })
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
    const { category, type, lastId, createdAt, order } = getVaultQueryRequestDto
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
      order,
      createdAt,
      lastId,
    )
    const result = await query.limit(MAX_VAULT_CONTENT_PER_REQUEST)
    return result.map((content) => new ContentDto(content))
  }

  preSignMediaContent(
    userId: string,
    contentId: string,
    contentType: ContentTypeEnum,
  ) {
    return this.s3contentService.signUrlForContentViewing(
      `media/${userId}/${contentId}.${getContentTypeFormat(contentType)}`,
    )
  }

  preSignMediaContentThumbnail(userId: string, contentId: string) {
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

  preSignProfileImage(userId: string, type: 'profile' | 'banner') {
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

  preSignW9(userId: string) {
    return this.s3contentService.signUrlForContentUpload(
      `w9/${userId}/upload.pdf`,
    )
  }

  async validateContentIds(
    userId: string,
    contentIds: string[],
  ): Promise<ContentBareDto[]> {
    const filteredContent = await this.dbReader<ContentEntity>(
      ContentEntity.table,
    )
      .whereIn('id', contentIds)
      .andWhere({ user_id: userId })
      .select('id', 'content_type')
    const contents: Record<string, ContentTypeEnum> = {}

    filteredContent.forEach(
      (content) => (contents[content.id] = content.content_type),
    )
    return contentIds.map((contentId) => {
      if (!contents[contentId]) {
        throw new NoContentError('cant find content for user')
      }
      return new ContentBareDto(contentId, contents[contentId])
    })
  }

  getContentDtosFromBare(
    contents: ContentBareDto[],
    accessible: boolean,
    userId: string,
    previewIndex: number,
    isOwner?: boolean,
  ): ContentDto[] {
    return contents.map((content, index) => {
      return {
        contentId: content.contentId,
        userId,
        signedUrl:
          (index < previewIndex || accessible) && !isOwner
            ? this.preSignMediaContent(
                userId,
                content.contentId,
                content.contentType,
              )
            : undefined,
        contentType: content.contentType,
      }
    })
  }
}
