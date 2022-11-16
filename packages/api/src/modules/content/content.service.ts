import {
  CloudFrontClient,
  CreateInvalidationCommand,
} from '@aws-sdk/client-cloudfront'
import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import ms from 'ms'
import * as uuid from 'uuid'

import {
  Database,
  DB_READER,
  DB_WRITER,
} from '../../database/database.decorator'
import { DatabaseService } from '../../database/database.service'
import { getAwsConfig } from '../../util/aws.util'
import { isEnv } from '../../util/env'
import { createPaginatedQuery } from '../../util/page.util'
import { PASS_NOT_OWNED_BY_USER } from '../pass/constants/errors'
import { PassMediaEnum } from '../pass/enum/pass-media.enum'
import { PassService } from '../pass/pass.service'
import { getCollectionMediaUri, PassSize } from '../s3content/s3.nft.helper'
import { S3ContentService } from '../s3content/s3content.service'
import { ContentDto } from './dto/content.dto'
import { ContentBareDto } from './dto/content-bare'
import { ContentValidationDto } from './dto/content-validation.dto'
import { CreateContentRequestDto } from './dto/create-content.dto'
import { DeleteContentRequestDto } from './dto/delete-content.dto'
import { GetVaultQueryRequestDto } from './dto/get-vault-query-dto'
import {
  MarkProcessedProfileImageRequestDto,
  MarkProcessedUserContentRequestDto,
} from './dto/mark-processed'
import { MarkUploadedRequestDto } from './dto/mark-uploaded-dto'
import { ContentEntity } from './entities/content.entity'
import { ContentSizeEnum } from './enums/content-size.enum'
import { ContentTypeEnum } from './enums/content-type.enum'
import { VaultCategoryEnum } from './enums/vault-category.enum'
import { ContentDeleteError, NoContentError } from './error/content.error'
import {
  mediaContentPath,
  mediaContentThumbnailPath,
  mediaContentUploadPath,
  PROFILE_CONTENT_TYPES,
  profileImagePath,
  profileImageUploadPath,
  w9UploadPath,
} from './helpers/content-paths'

const MAX_VAULT_CONTENT_PER_REQUEST = 12 // should be a multiple of 6

@Injectable()
export class ContentService {
  private distribution: string
  private client: CloudFrontClient

  constructor(
    private readonly configService: ConfigService,
    @Database(DB_READER)
    private readonly dbReader: DatabaseService['knex'],
    @Database(DB_WRITER)
    private readonly dbWriter: DatabaseService['knex'],
    private readonly s3contentService: S3ContentService,
    private readonly passService: PassService,
  ) {
    this.distribution = configService.get('cloudfront.distribution') as string
    this.client = new CloudFrontClient(getAwsConfig(configService))
  }

  /*******************************************/
  /***** Lambda mark processed callbacks *****/
  /*******************************************/

  async markUploaded(
    userId: string,
    markUploadedDto: MarkUploadedRequestDto,
  ): Promise<void> {
    await this.dbWriter<ContentEntity>(ContentEntity.table)
      .where({ id: markUploadedDto.contentId })
      .andWhere({ user_id: userId })
      .update({ uploaded: true })
  }

  async markUserContentProcessed(
    markProcessedDto: MarkProcessedUserContentRequestDto,
  ): Promise<void> {
    await this.dbWriter<ContentEntity>(ContentEntity.table)
      .where({ id: markProcessedDto.contentId })
      .andWhere({ user_id: markProcessedDto.userId })
      .update({ processed: true })
  }

  async markProfileImageProcessed(
    markProcessedDto: MarkProcessedProfileImageRequestDto,
  ): Promise<void> {
    const userId = markProcessedDto.userId
    let paths: (PROFILE_CONTENT_TYPES | 'thumbnail')[]
    switch (markProcessedDto.type) {
      case 'image':
        paths = ['image', 'thumbnail']
        break
      case 'banner':
        paths = ['banner']
        break
      default:
        paths = ['image', 'thumbnail', 'banner']
        break
    }
    await this.client.send(
      new CreateInvalidationCommand({
        DistributionId: this.distribution,
        InvalidationBatch: {
          Paths: {
            Quantity: paths.length,
            Items: paths.map((p) => '/' + profileImagePath(userId, p)),
          },
          CallerReference: `profile-image-${userId}-${new Date().getTime()}`,
        },
      }),
    )
  }

  /*******************************************/
  /************ Deleting content *************/
  /*******************************************/

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

  async deleteProfileBanner(userId: string): Promise<void> {
    await this.s3contentService.deleteObject(profileImagePath(userId, 'banner'))
    await this.markProfileImageProcessed({ userId, type: 'banner', secret: '' })
  }

  /*******************************************/
  /******** Checking for processing **********/
  /*******************************************/

  async isAllProcessed(contents: ContentBareDto[]): Promise<boolean> {
    const content = await this.dbReader<ContentEntity>(ContentEntity.table)
      .whereIn(
        'id',
        contents.map((content) => content.contentId),
      )
      .select('processed')
    return content.every((c) => c.processed)
  }

  // Only checks for medium, which is the default we show
  private async allContentExistsInS3(contents: ContentEntity[]) {
    return await Promise.all(
      contents.map(async (content) => {
        return await this.s3contentService.doesObjectExist(
          mediaContentPath(
            content.user_id,
            content.id,
            content.content_type,
            ContentSizeEnum.MEDIUM,
          ),
        )
      }),
    )
  }

  async checkProcessed(): Promise<void> {
    const contents = await this.dbReader<ContentEntity>(ContentEntity.table)
      .where({ processed: false, failed: false })
      .select('*')
    const checks = await this.allContentExistsInS3(contents)
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
  }

  /*******************************************/
  /****************** Vault ******************/
  /*******************************************/

  async getVault(
    userId: string,
    getVaultQueryRequestDto: GetVaultQueryRequestDto,
  ) {
    const { category, type, lastId, createdAt, order } = getVaultQueryRequestDto
    let query = this.dbReader<ContentEntity>(ContentEntity.table)
      .whereNull('deleted_at')
      .andWhere({
        user_id: userId,
        processed: true,
      })
      .select('*')
    switch (category) {
      // filter content that has been used in messages
      case VaultCategoryEnum.MESSAGES:
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

  /*******************************************/
  /******** Uploading new content ************/
  /*******************************************/

  private async createContent(
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
        processed: isEnv('dev'),
      }
      await this.dbWriter<ContentEntity>(ContentEntity.table).insert(data)
      return id
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  async preSignUploadContent(
    userId: string,
    createContentDto: CreateContentRequestDto,
  ) {
    const contentId = await this.createContent(userId, createContentDto)
    return this.s3contentService.signUrlForContentUpload(
      mediaContentUploadPath(userId, contentId, createContentDto.contentType),
      this.s3contentService.shouldUseTransferAcceleration(
        createContentDto.contentLength,
      ),
    )
  }

  preSignUploadProfileImage(userId: string, type: PROFILE_CONTENT_TYPES) {
    return this.s3contentService.signUrlForContentUpload(
      profileImageUploadPath(userId, type),
    )
  }

  async preSignUploadPass(userId: string, passId: string, type: PassMediaEnum) {
    const pass = await this.passService.getPass(passId)
    if (pass.creatorId !== userId) {
      throw new ForbiddenException(PASS_NOT_OWNED_BY_USER)
    }

    return this.s3contentService.signUrlForContentUpload(
      getCollectionMediaUri(null, passId, type, PassSize.NORMAL),
    )
  }

  preSignUploadW9(userId: string) {
    return this.s3contentService.signUrlForContentUpload(w9UploadPath(userId))
  }

  /*******************************************/
  /*********** Validating content ************/
  /*******************************************/

  async validateContentIds(
    userId: string,
    contentIds: string[],
  ): Promise<ContentValidationDto> {
    if (contentIds.length === 0) {
      return { contentsBare: [], isProcessed: true }
    }
    const filteredContent = await this.dbReader<ContentEntity>(
      ContentEntity.table,
    )
      .whereIn('id', contentIds)
      .andWhere({ user_id: userId })
      .select('id', 'content_type', 'processed')
    const contents: Record<string, ContentTypeEnum> = {}

    filteredContent.forEach(
      (content) => (contents[content.id] = content.content_type),
    )
    const notProcessed = filteredContent.some((content) => !content.processed)
    const contentBares = contentIds.map((contentId) => {
      if (!contents[contentId]) {
        throw new NoContentError('cant find content for user')
      }
      return new ContentBareDto(contentId, contents[contentId])
    })
    return { contentsBare: contentBares, isProcessed: !notProcessed }
  }

  /*******************************************/
  /**** Getting gated content for download ***/
  /*******************************************/

  private preSignMediaContent(
    userId: string,
    contentId: string,
    contentType: ContentTypeEnum,
    contentSize: ContentSizeEnum,
  ) {
    return this.s3contentService.signUrlForContentViewing(
      mediaContentPath(userId, contentId, contentType, contentSize),
    )
  }

  private preSignMediaContentThumbnail(userId: string, contentId: string) {
    return this.s3contentService.signUrlForContentViewing(
      mediaContentThumbnailPath(userId, contentId),
    )
  }

  getContentDtosFromBare(
    contents: ContentBareDto[],
    accessible: boolean,
    userId: string,
    previewIndex: number,
    isOwner?: boolean,
  ): ContentDto[] {
    return contents.map((content, index) => {
      const needsSignature = (index < previewIndex || accessible) && !isOwner
      return {
        contentId: content.contentId,
        userId,
        signedUrl: needsSignature
          ? this.preSignMediaContent(
              userId,
              content.contentId,
              content.contentType,
              ContentSizeEnum.MEDIUM,
            )
          : undefined,
        signedThumbnailUrl: needsSignature
          ? this.preSignMediaContentThumbnail(userId, content.contentId)
          : undefined,
        contentType: content.contentType,
      }
    })
  }
}
