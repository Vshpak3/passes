import { Knex } from '@mikro-orm/mysql'
import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import { InjectRedis, Redis } from '@nestjs-modules/ioredis'
import { InjectSentry, SentryService } from '@ntegral/nestjs-sentry'
import CryptoJS from 'crypto-js'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { v4 } from 'uuid'
import { Logger } from 'winston'

import {
  Database,
  DB_READER,
  DB_WRITER,
} from '../../database/database.decorator'
import { DatabaseService } from '../../database/database.service'
import { createOrThrowOnDuplicate } from '../../util/db-nest.util'
import { OrderEnum } from '../../util/dto/page.dto'
import { isEnv } from '../../util/env'
import { createPaginatedQuery } from '../../util/page.util'
import { rejectIfAny } from '../../util/promise.util'
import { verifyTaggedText } from '../../util/text.util'
import { CommentEntity } from '../comment/entities/comment.entity'
import { ContentService } from '../content/content.service'
import { ContentBareDto } from '../content/dto/content-bare'
import { ContentEntity } from '../content/entities/content.entity'
import { CreatorStatEntity } from '../creator-stats/entities/creator-stat.entity'
import { EmailService } from '../email/email.service'
import { PostLikeEntity } from '../likes/entities/like.entity'
import { UserMessageContentEntity } from '../messages/entities/user-message-content.entity'
import { PassHolderEntity } from '../pass/entities/pass-holder.entity'
import { AccessTypeEnum } from '../pass/enum/access.enum'
import { PassService } from '../pass/pass.service'
import {
  PurchasePostCallbackInput,
  TipPostCallbackInput,
} from '../payment/callback.types'
import { PayinDataDto } from '../payment/dto/payin-data.dto'
import { PayinMethodDto } from '../payment/dto/payin-method.dto'
import { RegisterPayinResponseDto } from '../payment/dto/register-payin.dto'
import { BlockedReasonEnum } from '../payment/enum/blocked-reason.enum'
import { PayinCallbackEnum } from '../payment/enum/payin.callback.enum'
import { InvalidPayinRequestError } from '../payment/error/payin.error'
import { PaymentService } from '../payment/payment.service'
import { ScheduledEventEntity } from '../scheduled/entities/scheduled-event.entity'
import { ScheduledEventTypeEnum } from '../scheduled/enum/scheduled-event.type.enum'
import { checkScheduledAt } from '../scheduled/scheduled.util'
import { UserEntity } from '../user/entities/user.entity'
import { POST_NOT_EXIST } from './constants/errors'
import {
  MAX_PINNED_POST,
  MAX_POST_BUYERS_PER_REQUEST,
  MAX_POST_CATEGORIES,
  MAX_POSTS_PER_REQUEST,
  MIN_PAID_POST_PRICE,
} from './constants/limits'
import {
  CreatePostRequestDto,
  CreatePostResponseDto,
} from './dto/create-post.dto'
import { CreatePostCategoryRequestDto } from './dto/create-post-category.dto'
import { DeletePostCategoryRequestDto } from './dto/delete-post-category.dto'
import { EditPostRequestDto } from './dto/edit-post.dto'
import { EditPostCategoryRequestDto } from './dto/edit-post-category.dto'
import {
  GetPostBuyersRequestDto,
  PostBuyerDto,
} from './dto/get-post-buyers.dto'
import { GetPostHistoryRequestDto } from './dto/get-post-history.dto'
import { GetPostsRequestDto } from './dto/get-posts.dto'
import { PostDto } from './dto/post.dto'
import { PostCategoryDto } from './dto/post-category.dto'
import { PostHistoryDto } from './dto/post-history.dto'
import { PostNotificationDto } from './dto/post-notification.dto'
import { PostToCategoryRequestDto } from './dto/post-to-category.dto'
import { ReorderPostCategoriesRequestDto } from './dto/reorder-post-categories.dto'
import { PostEntity } from './entities/post.entity'
import { PostCategoryEntity } from './entities/post-category.entity'
import { PostHistoryEntity } from './entities/post-history.entity'
import { PostPassAccessEntity } from './entities/post-pass-access.entity'
import { PostTipEntity } from './entities/post-tip.entity'
import { PostToCategoryEntity } from './entities/post-to-category.entity'
import { PostUserAccessEntity } from './entities/post-user-access.entity'
import { PostNotificationEnum } from './enum/post.notification.enum'
import {
  BadPostPropertiesException,
  ForbiddenPostException,
  PostNotFoundException,
} from './error/post.error'

@Injectable()
export class PostService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,
    @InjectSentry() private readonly sentry: SentryService,

    @Database(DB_READER)
    private readonly dbReader: DatabaseService['knex'],
    @Database(DB_WRITER)
    private readonly dbWriter: DatabaseService['knex'],

    @Inject(forwardRef(() => PaymentService))
    private readonly payService: PaymentService,
    private readonly passService: PassService,
    private readonly contentService: ContentService,
    private readonly emailService: EmailService,

    @InjectRedis('post_publisher') private readonly redisService: Redis,
  ) {}

  async validateCreatePost(
    userId: string,
    createPostDto: CreatePostRequestDto,
  ) {
    if (createPostDto.scheduledAt) {
      checkScheduledAt(createPostDto.scheduledAt)
    }
    const { text, tags, price, contentIds, passIds } = createPostDto
    if (!!price && price < MIN_PAID_POST_PRICE && price > 0) {
      throw new BadRequestException(
        `Post price can not be less than ${MIN_PAID_POST_PRICE}`,
      )
    }
    verifyTaggedText(text, tags)
    if (text.length === 0 && contentIds.length === 0) {
      throw new BadPostPropertiesException(
        'Must provide either text or content in a post',
      )
    }
    await this.passService.validatePassIds(userId, passIds)
    return await this.contentService.validateContentIds(userId, contentIds)
  }

  async publishPost(userId: string, createPostDto: CreatePostRequestDto) {
    const postId = v4()
    const { contentsBare, isProcessed } = await this.validateCreatePost(
      userId,
      createPostDto,
    )
    await this.dbWriter
      .transaction(async (trx) => {
        await trx<PostEntity>(PostEntity.table).insert({
          id: postId,
          user_id: userId,
          text: createPostDto.text,
          tags: JSON.stringify(createPostDto.tags),
          price: createPostDto.price ?? 0,
          expires_at: createPostDto.expiresAt,
          pass_ids: JSON.stringify(createPostDto.passIds),
          contents: JSON.stringify(contentsBare),
          content_processed: isProcessed || isEnv('dev'),
          preview_index: createPostDto.previewIndex,
        })

        await trx<ContentEntity>(ContentEntity.table)
          .update({ in_post: true })
          .whereIn('id', createPostDto.contentIds)

        // DEPRECTED: no acocunt access type

        // const passHolders = await trx<PassHolderEntity>(PassHolderEntity.table)
        //   .whereIn('pass_id', createPostDto.passIds)
        //   .andWhere(function () {
        //     return this.where('expires_at', '>', new Date()).orWhereNull(
        //       'expires_at',
        //     )
        //   })
        //   .andWhere('access_type', AccessTypeEnum.ACCOUNT_ACCESS)
        //   .whereNotNull('holder_id')
        //   .select('holder_id', 'id')
        // const userToPassHolders = passHolders.reduce((map, passHolder) => {
        //   if (!passHolder.holder_id) {
        //     return map
        //   }
        //   if (!map[passHolder.holder_id]) {
        //     map[passHolder.holder_id] = []
        //   }
        //   map[passHolder.holder_id].push(passHolder.id)
        //   return map
        // }, {})
        // if (Object.keys(userToPassHolders).length) {
        //   await trx<PostUserAccessEntity>(PostUserAccessEntity.table).insert(
        //     Object.keys(userToPassHolders).map((userId) => {
        //       return {
        //         post_id: postId,
        //         user_id: userId,
        //         pass_holder_ids: JSON.stringify(userToPassHolders[userId]),
        //         paid_at: new Date(),
        //       }
        //     }),
        //   )
        // }
        await this.updatePassAccess(trx, postId, createPostDto.passIds, false)
        await trx<CreatorStatEntity>(CreatorStatEntity.table)
          .increment('num_posts', 1)
          .where('user_id', userId)
      })
      .catch((err) => {
        this.logger.error(err)
        throw err
      })
    await this.emailService.sendTaggedUserEmails(createPostDto.tags, 'post')

    return postId
  }

  async createPost(
    userId: string,
    createPostDto: CreatePostRequestDto,
  ): Promise<CreatePostResponseDto> {
    if (createPostDto.scheduledAt) {
      await this.validateCreatePost(userId, createPostDto)
      const scheduledAt = createPostDto.scheduledAt
      createPostDto.scheduledAt = undefined
      await this.dbWriter<ScheduledEventEntity>(
        ScheduledEventEntity.table,
      ).insert({
        user_id: userId,
        type: ScheduledEventTypeEnum.CREATE_POST,
        body: JSON.stringify(createPostDto),
        scheduled_at: scheduledAt,
      })
    } else {
      return { postId: await this.publishPost(userId, createPostDto) }
    }
    return { postId: undefined }
  }

  async findPost(postId: string, userId: string): Promise<PostDto> {
    const dbReader = this.dbReader
    const query = this.dbReader<PostEntity>(PostEntity.table)
      .innerJoin(
        UserEntity.table,
        `${UserEntity.table}.id`,
        `${PostEntity.table}.user_id`,
      )
      .leftJoin(PostUserAccessEntity.table, function () {
        this.on(
          `${PostUserAccessEntity.table}.post_id`,
          `${PostEntity.table}.id`,
        ).andOn(
          `${PostUserAccessEntity.table}.user_id`,
          dbReader.raw('?', [userId]),
        )
      })
      .leftJoin(PostTipEntity.table, function () {
        this.on(
          `${PostTipEntity.table}.post_id`,
          `${PostEntity.table}.id`,
        ).andOn(`${PostTipEntity.table}.user_id`, dbReader.raw('?', [userId]))
      })
      .leftJoin(PostLikeEntity.table, function () {
        this.on(
          `${PostEntity.table}.id`,
          `${PostLikeEntity.table}.post_id`,
        ).andOn(`${PostLikeEntity.table}.liker_id`, dbReader.raw('?', [userId]))
      })
      .select([
        `${PostEntity.table}.*`,
        `${UserEntity.table}.username`,
        `${UserEntity.table}.display_name`,
        `${PostUserAccessEntity.table}.paid_at as paid_at`,
        `${PostUserAccessEntity.table}.paying as paying`,
        `${PostTipEntity.table}.amount as your_tips`,
        `${PostLikeEntity.table}.id as is_liked`,
      ])
      .whereNull(`${PostEntity.table}.deleted_at`)
      .andWhere(`${PostEntity.table}.id`, postId)

    const postDtos = await this.getPostsFromQuery(userId, query)

    if (postDtos.length === 0) {
      throw new PostNotFoundException(POST_NOT_EXIST)
    }

    return postDtos[0]
  }

  async getPosts(
    userId: string,
    getPostsRequestDto: GetPostsRequestDto,
  ): Promise<PostDto[]> {
    const { lastId, createdAt } = getPostsRequestDto
    let query = this.dbReader<PostEntity>(PostEntity.table)
      .select([`${PostEntity.table}.*`])
      .whereNull(`${PostEntity.table}.hidden_at`)
      .andWhere(`${PostEntity.table}.user_id`, userId)
    query = createPaginatedQuery(
      query,
      PostEntity.table,
      PostEntity.table,
      'created_at',
      OrderEnum.DESC,
      createdAt,
      lastId,
    ).limit(MAX_POSTS_PER_REQUEST)
    return await this.getPostsFromQuery(userId, query)
  }

  async getPostsFromQuery(
    userId: string,
    query: Knex.QueryBuilder,
  ): Promise<PostDto[]> {
    const posts: any[] = await query

    const passAccesses = await this.dbReader<PostPassAccessEntity>(
      PostPassAccessEntity.table,
    )
      .innerJoin(
        PassHolderEntity.table,
        `${PostPassAccessEntity.table}.pass_id`,
        `${PassHolderEntity.table}.pass_id`,
      )
      .whereIn(
        `${PostPassAccessEntity.table}.post_id`,
        posts.map((post) => post.id),
      )
      .andWhere(`${PassHolderEntity.table}.holder_id`, userId)
      .andWhere(
        `${PassHolderEntity.table}.access_type`,
        AccessTypeEnum.PASS_ACCESS,
      )
      .andWhere(function () {
        return this.where(
          `${PassHolderEntity.table}.expires_at`,
          '>',
          new Date(),
        ).orWhereNull(`${PassHolderEntity.table}.expires_at`)
      })
      .select('post_id', `${PassHolderEntity.table}.id`)

    const postsFromPass = new Set(
      passAccesses.map((passAccess) => passAccess.post_id),
    )

    const postCategories = await this.dbReader<PostToCategoryEntity>(
      PostToCategoryEntity.table,
    )
      .leftJoin(
        PostCategoryEntity.table,
        `${PostCategoryEntity.table}.id`,
        `${PostToCategoryEntity.table}.post_category_id`,
      )
      .whereIn(
        `${PostToCategoryEntity.table}.post_id`,
        posts.map((post) => post.id),
      )
      .select(
        `${PostCategoryEntity.table}.*`,
        `${PostToCategoryEntity.table}.post_id`,
      )
    const categoriesMap = new Map<string, PostCategoryDto[]>()
    posts.forEach((post) => (categoriesMap[post.id] = []))
    postCategories.forEach((postCategory) => {
      categoriesMap[postCategory.post_id].add(new PostCategoryDto(postCategory))
    })

    return posts.map((post) => {
      const accessible =
        post.paid_at || // single post purchase
        postsFromPass.has(post.id) || // owns pass that gives access
        post.user_id === userId || // user made post
        !post.price || // no price on post
        post.price === 0 // price of post is 0
      return new PostDto(
        post,
        post.user_id === userId,
        accessible,
        categoriesMap[post.id],
        this.contentService.getContentDtosFromBare(
          JSON.parse(post.contents),
          accessible,
          post.user_id,
          post.preview_index,
          post.user_id === userId,
        ),
      )
    })
  }

  async editPost(userId: string, editPostDto: EditPostRequestDto) {
    const {
      text,
      tags,
      price,
      expiresAt,
      contentIds,
      previewIndex,
      postId,
      passIds,
    } = editPostDto
    if ((text && !tags) || (!text && tags)) {
      throw new BadRequestException('needs both text and tags')
    }

    await this.passService.validatePassIds(userId, passIds)
    const { contentsBare, isProcessed } =
      await this.contentService.validateContentIds(userId, contentIds)
    if (text && tags) {
      verifyTaggedText(text, tags)
    }
    let updated = 0
    await this.dbWriter.transaction(async (trx) => {
      await this.updatePassAccess(trx, postId, passIds, true)
      updated = await trx<PostEntity>(PostEntity.table)
        .where({ id: postId, user_id: userId })
        .update({
          text: text,
          tags: JSON.stringify(tags),
          price: price,
          expires_at: expiresAt,
          content_processed: isProcessed,
          contents: JSON.stringify(contentsBare),
          preview_index: previewIndex,
          pass_ids: JSON.stringify(passIds),
        })
    })
    return updated === 1
  }

  async updatePassAccess(
    trx: Knex.Transaction,
    postId: string,
    passIds: string[],
    remove: boolean,
  ) {
    if (remove) {
      await trx<PostPassAccessEntity>(PostPassAccessEntity.table)
        .where({ post_id: postId })
        .whereNotIn('pass_id', passIds)
        .delete()
    }
    if (passIds.length) {
      await trx<PostPassAccessEntity>(PostPassAccessEntity.table)
        .insert(
          passIds.map((passId) => {
            return { post_id: postId, pass_id: passId }
          }),
        )
        .onConflict()
        .ignore()
    }
  }

  async removePost(userId: string, postId: string) {
    const updated = await this.dbWriter<PostEntity>(PostEntity.table)
      .where({ id: postId, user_id: userId, deleted_at: null })
      .update({ deleted_at: new Date(), pinned_at: null })
    await this.dbWriter<CreatorStatEntity>(CreatorStatEntity.table)
      .where({ user_id: userId })
      .decrement('num_posts', updated)
    return updated === 1
  }

  async hidePost(userId: string, postId: string) {
    const updated = await this.dbWriter<PostEntity>(PostEntity.table)
      .whereNotNull('deleted_at')
      .andWhere({ id: postId, user_id: userId })
      .update({ hidden_at: new Date() })
    return updated === 1
  }

  async purchasingPost(userId: string, postId: string, payinId: string) {
    await this.dbWriter<PostUserAccessEntity>(PostUserAccessEntity.table)
      .insert({
        user_id: userId,
        post_id: postId,
        payin_id: payinId,
        paying: true,
      })
      .onConflict(['post_id', 'user_id'])
      .merge(['payin_id', 'paying'])
    const notification: PostNotificationDto = {
      postId,
      paying: true,
      notification: PostNotificationEnum.PAYING,
      recieverId: userId,
    }
    await this.redisService.publish('post', JSON.stringify(notification))
  }

  async failPostPurchase(userId: string, postId: string, payinId: string) {
    const updated = await this.dbWriter<PostUserAccessEntity>(
      PostUserAccessEntity.table,
    )
      .update({ payin_id: null, paying: false })
      .where({
        payin_id: payinId,
        user_id: userId,
        post_id: postId,
      })
    if (updated) {
      const notification: PostNotificationDto = {
        postId,
        paying: false,
        notification: PostNotificationEnum.FAILED_PAYMENT,
        recieverId: userId,
      }
      await this.redisService.publish('post', JSON.stringify(notification))
    }
  }

  async purchasePost(
    userId: string,
    postId: string,
    payinId: string,
    earnings: number,
  ) {
    const post = await this.dbReader<PostEntity>(PostEntity.table)
      .where({ id: postId })
      .select('contents', 'user_id', 'preview_index')
      .first()
    if (!post) {
      throw new InternalServerErrorException(
        `post not found when purchasing ${payinId}`,
      )
    }
    const contents: ContentBareDto[] = JSON.parse(post.contents)
    const paidAt = new Date()
    await this.dbWriter.transaction(async (trx) => {
      await trx<PostUserAccessEntity>(PostUserAccessEntity.table)
        .insert({
          user_id: userId,
          post_id: postId,
          payin_id: payinId,
          paid_at: paidAt,
          paying: false,
        })
        .onConflict(['post_id', 'user_id'])
        .merge(['payin_id', 'paid_at', 'paying'])
      await trx<PostEntity>(PostEntity.table)
        .where({ id: postId })
        .increment('num_purchases', 1)
      await trx<PostEntity>(PostEntity.table)
        .where({ id: postId })
        .increment('earnings_purchases', earnings)

      await Promise.allSettled(
        contents.map(async (content) => {
          await trx<UserMessageContentEntity>(UserMessageContentEntity.table)
            .insert({
              user_id: userId,
              content_id: content.contentId,
            })
            .onConflict()
            .ignore()
        }),
      )
    })
    const notification: PostNotificationDto = {
      postId,
      paying: false,
      paidAt: paidAt,
      notification: PostNotificationEnum.PAID,
      recieverId: userId,
      contents: this.contentService.getContentDtosFromBare(
        contents,
        true,
        post.user_id,
        post.preview_index,
        false,
      ),
    }
    await this.redisService.publish('post', JSON.stringify(notification))
    return post.user_id
  }

  async revertPostPurchase(postId: string, payinId: string, earnings: number) {
    const access = await this.dbReader<PostUserAccessEntity>(
      PostUserAccessEntity.table,
    )
      .where({ payin_id: payinId })
      .select('id', 'pass_holder_ids')
      .first()
    if (!access) {
      throw new ForbiddenPostException(
        `cant find post access for payinId ${payinId}`,
      )
    }
    const updated = await this.dbWriter<PostUserAccessEntity>(
      PostUserAccessEntity.table,
    )
      .update({ payin_id: null })
      .where({ id: access.id, payin_id: payinId })
    if (updated) {
      if (!JSON.parse(access.pass_holder_ids).length) {
        await this.dbWriter<PostUserAccessEntity>(PostUserAccessEntity.table)
          .where({ id: access.id })
          .update({ paid_at: new Date() })
      }
      await this.dbWriter.transaction(async (trx) => {
        await trx<PostEntity>(PostEntity.table)
          .where({ id: postId })
          .decrement('num_purchases', 1)
        await trx<PostEntity>(PostEntity.table)
          .where({ id: postId })
          .decrement('earnings_purchases', earnings)
      })
    }
  }

  async createTip(userId: string, postId: string, amount: number) {
    await this.dbWriter<PostTipEntity>(PostTipEntity.table)
      .insert({
        user_id: userId,
        post_id: postId,
        amount,
      })
      .onConflict()
      .merge({
        amount: this.dbWriter.raw('amount + ?', [amount]),
      })
    await this.dbWriter<PostEntity>(PostEntity.table)
      .increment('total_tip_amount', amount)
      .where({ id: postId })
    const yourTips = await this.dbWriter<PostTipEntity>(PostTipEntity.table)
      .where({ user_id: userId, post_id: postId })
      .select('amount')
      .first()
    if (yourTips) {
      const notification: PostNotificationDto = {
        postId,
        notification: PostNotificationEnum.TIP,
        recieverId: userId,
        yourTips: yourTips.amount,
      }
      await this.redisService.publish('post', JSON.stringify(notification))
    }
  }

  async deleteTip(userId: string, postId: string, amount: number) {
    await this.dbWriter<PostEntity>(PostEntity.table)
      .increment('total_tip_amount', amount)
      .where({ id: postId })
    await this.dbWriter<PostTipEntity>(PostTipEntity.table)
      .where({ user_id: userId, post_id: postId })
      .decrement('amount', amount)
  }

  async registerTipPost(
    userId: string,
    postId: string,
    amount: number,
    payinMethod?: PayinMethodDto,
  ): Promise<RegisterPayinResponseDto> {
    const post = await this.dbReader<PostEntity>(PostEntity.table)
      .where({ id: postId })
      .select('user_id')
      .first()
    if (!post) {
      throw new PostNotFoundException(`post ${postId} not found`)
    }
    const callbackInput: TipPostCallbackInput = {
      userId,
      postId,
      amount,
    }
    if (payinMethod === undefined) {
      payinMethod = await this.payService.getDefaultPayinMethod(userId)
    }

    return await this.payService.registerPayin({
      userId,
      amount,
      payinMethod,
      callback: PayinCallbackEnum.TIP_POST,
      callbackInputJSON: callbackInput,
      creatorId: post.user_id,
    })
  }

  async registerPurchasePost(
    userId: string,
    postId: string,
    payinMethod?: PayinMethodDto,
  ): Promise<RegisterPayinResponseDto> {
    const { amount, target, blocked } = await this.registerPurchasePostData(
      userId,
      postId,
    )
    if (blocked) {
      throw new InvalidPayinRequestError(blocked)
    }

    const post = await this.dbReader<PostEntity>(PostEntity.table)
      .where({ id: postId })
      .select('user_id')
      .first()
    if (!post) {
      throw new PostNotFoundException(`post ${postId} not found`)
    }
    const callbackInput: PurchasePostCallbackInput = {
      userId,
      postId,
    }
    if (payinMethod === undefined) {
      payinMethod = await this.payService.getDefaultPayinMethod(userId)
    }

    return await this.payService.registerPayin({
      userId,
      target,
      amount,
      payinMethod,
      callback: PayinCallbackEnum.PURCHASE_POST,
      callbackInputJSON: callbackInput,
      creatorId: post.user_id,
    })
  }

  async registerPurchasePostData(
    userId: string,
    postId: string,
    payinMethod?: PayinMethodDto,
  ): Promise<PayinDataDto> {
    const target = CryptoJS.SHA256(`post-${userId}-${postId}`).toString(
      CryptoJS.enc.Hex,
    )

    const post = await this.dbReader<PostEntity>(PostEntity.table)
      .where({ id: postId })
      .select('price')
      .first()
    if (!post) {
      throw new PostNotFoundException(`post ${postId} not found`)
    }

    const checkAccess = await this.dbReader<PostUserAccessEntity>(
      PostUserAccessEntity.table,
    )
      .whereNotNull('paid_at')
      .where({
        post_id: postId,
        user_id: userId,
      })
      .select('id')
      .first()

    let blocked: BlockedReasonEnum | undefined = undefined
    if (await this.payService.checkPayinBlocked(userId)) {
      blocked = BlockedReasonEnum.PAYMENTS_DEACTIVATED
    } else if (post.price === undefined || post.price === 0) {
      blocked = BlockedReasonEnum.NO_PRICE
    } else if (await this.payService.checkPayinTargetBlocked(target)) {
      blocked = BlockedReasonEnum.PURCHASE_IN_PROGRESS
    } else if (checkAccess !== undefined) {
      blocked = BlockedReasonEnum.ALREADY_HAS_ACCESS
    }

    if (!this.payService.validatePayinData(userId, payinMethod)) {
      blocked = BlockedReasonEnum.NO_PAYIN_METHOD
    }

    return { amount: post.price, target, blocked }
  }

  async pinPost(userId: string, postId: string): Promise<boolean> {
    if (
      (
        await this.dbWriter<PostEntity>(PostEntity.table)
          .whereNotNull('pinned_at')
          .whereNotNull('deleted_at')
          .andWhere('user_id', userId)
          .count('*')
      )[0]['count(*)'] >= MAX_PINNED_POST
    ) {
      throw new BadPostPropertiesException(
        `Can only pin a max of ${MAX_PINNED_POST} posts`,
      )
    }
    return (
      (await this.dbWriter<PostEntity>(PostEntity.table)
        .where({ user_id: userId, id: postId })
        .update({ pinned_at: this.dbWriter.fn.now() })) === 1
    )
  }

  async unpinPost(userId: string, postId: string): Promise<boolean> {
    return (
      (await this.dbWriter<PostEntity>(PostEntity.table)
        .where({ user_id: userId, id: postId })
        .update({ pinned_at: null })) === 1
    )
  }

  async createPostHistory() {
    await this.dbWriter
      .from(
        this.dbWriter.raw('?? (??, ??, ??, ??, ??, ??)', [
          PostHistoryEntity.table,
          'post_id',
          'num_likes',
          'num_comments',
          'num_purchases',
          'earnings_purchases',
          'total_tip_amount',
        ]),
      )
      .insert(
        this.dbWriter<PostEntity>(PostEntity.table).select([
          'id',
          'num_likes',
          'num_comments',
          'num_purchases',
          'earnings_purchases',
          'total_tip_amount',
        ]),
      )
  }

  async getPostHistory(
    userId: string,
    getPostHistoryRequestDto: GetPostHistoryRequestDto,
  ) {
    const { postId, start, end } = getPostHistoryRequestDto
    const post = await this.dbReader<PostEntity>(PostEntity.table).where({
      id: postId,
      user_id: userId,
    })
    if (!post) {
      throw new PostNotFoundException(
        `post ${postId} not found for user ${userId}`,
      )
    }
    const postHistories = await this.dbReader<PostHistoryEntity>(
      PostHistoryEntity.table,
    )
      .where('post_id', postId)
      .andWhere('created_at', '>=', start)
      .andWhere('created_at', '<=', end)
    return postHistories.map((postHistory) => new PostHistoryDto(postHistory))
  }

  async refreshNumPosts() {
    await this.dbWriter<CreatorStatEntity>(CreatorStatEntity.table).update(
      'num_posts',
      this.dbWriter<PostEntity>(PostEntity.table)
        .where({
          user_id: this.dbWriter.raw(`${CreatorStatEntity.table}.user_id`),
          deleted_at: null,
        })
        .count(),
    )
  }

  async refreshPostsCounts() {
    const posts = await this.dbReader<PostEntity>(PostEntity.table)
      .whereNull('deleted_at')
      .select('id')
    rejectIfAny(
      await Promise.allSettled(
        posts.map(async (post) => {
          try {
            await this.refreshPostCounts(post.id)
          } catch (err) {
            this.logger.error(`Error updating post counts for ${post.id}`, err)
            this.sentry.instance().captureException(err)
          }
        }),
      ),
    )
  }

  async refreshPostCounts(postId: string) {
    await this.dbWriter<PostEntity>(PostEntity.table)
      .where({ id: postId })
      .update(
        'num_comments',
        this.dbWriter<CommentEntity>(CommentEntity.table)
          .where({
            post_id: postId,
            blocked: false,
            deactivated: false,
            hidden: false,
            deleted_at: null,
          })
          .count(),
      )
    await this.dbWriter<PostEntity>(PostEntity.table)
      .where({ id: postId })
      .update(
        'num_likes',
        this.dbWriter<PostLikeEntity>(PostLikeEntity.table)
          .where({
            post_id: postId,
          })
          .count(),
      )
  }

  async checkRecentPostsContentProcessed(checkProcessedUntil: number) {
    const postIds = (
      await this.dbWriter<PostEntity>(PostEntity.table)
        .where({ content_processed: false })
        .andWhere('updated_at', '>', new Date(Date.now() - checkProcessedUntil))
        .select('id')
    ).map((post) => post.id)
    rejectIfAny(
      await Promise.allSettled(
        postIds.map(async (postId) => {
          await this.checkPostContentProcessed(postId)
        }),
      ),
    )
  }

  async checkPostContentProcessed(postId: string): Promise<void> {
    const post = await this.dbWriter<PostEntity>(PostEntity.table)
      .where({ id: postId })
      .select('contents', 'content_processed', 'user_id')
      .first()

    if (!post) {
      throw new BadRequestException(`No post with id ${postId}`)
    }

    const contents = JSON.parse(post.contents) as ContentBareDto[]

    const isProcessed = await this.contentService.isAllProcessed(contents)

    if (isProcessed) {
      await this.dbWriter<PostEntity>(PostEntity.table)
        .where({ id: postId })
        .update({ content_processed: true })
      const contentsBare = JSON.parse(post.contents) as ContentBareDto[]
      const contents = this.contentService.getContentDtosFromBare(
        contentsBare,
        true,
        post.user_id,
        0,
        true,
      )
      const notification: PostNotificationDto = {
        postId,
        contentProcessed: true,
        notification: PostNotificationEnum.PROCESSED,
        recieverId: post.user_id,
        contents,
      }
      await this.redisService.publish('post', JSON.stringify(notification))
    }
  }

  async getPostBuyers(
    userId: string,
    getPostBuyersRequestDto: GetPostBuyersRequestDto,
  ): Promise<PostBuyerDto[]> {
    const { postId, lastId, paidAt } = getPostBuyersRequestDto
    await this.checkPost(userId, postId)
    let query = this.dbReader<PostUserAccessEntity>(PostUserAccessEntity.table)
      .innerJoin(
        UserEntity.table,
        `${UserEntity.table}.id`,
        `${PostUserAccessEntity.table}.user_id`,
      )
      .whereNotNull(`${PostUserAccessEntity.table}.paid_at`)
      .where(`${PostUserAccessEntity.table}.post_id`, postId)
      .select(
        `${PostUserAccessEntity.table}.id`,
        `${PostUserAccessEntity.table}.user_id`,
        `${PostUserAccessEntity.table}.paid_at`,
        `${UserEntity.table}.username`,
        `${UserEntity.table}.display_name`,
      )

    query = createPaginatedQuery(
      query,
      PostUserAccessEntity.table,
      PostUserAccessEntity.table,
      'paid_at',
      OrderEnum.DESC,
      paidAt,
      lastId,
    ).limit(MAX_POST_BUYERS_PER_REQUEST)

    const postBuyers = await query
    return postBuyers.map((postBuyer) => new PostBuyerDto(postBuyer))
  }

  async createPostCategory(
    userId: string,
    createPostCategoryRequestDto: CreatePostCategoryRequestDto,
  ) {
    const { name } = createPostCategoryRequestDto
    const id = v4()
    const count = (
      await this.dbWriter<PostCategoryEntity>(PostCategoryEntity.table)
        .where({
          user_id: userId,
        })
        .count()
    )[0]['count(*)'] as number
    if (count >= MAX_POST_CATEGORIES) {
      throw new BadRequestException(
        `Can't have more than ${MAX_POST_CATEGORIES} post categories`,
      )
    }
    await this.dbWriter.transaction(async (trx) => {
      await createOrThrowOnDuplicate(
        () =>
          trx<PostCategoryEntity>(PostCategoryEntity.table).insert({
            id,
            user_id: userId,
            name,
            order: -1,
          }),
        this.logger,
        `Post category ${name} already exists`,
      )
      await trx<PostCategoryEntity>(PostCategoryEntity.table)
        .update(
          'order',
          this.dbWriter<PostCategoryEntity>(PostCategoryEntity.table)
            .where({
              user_id: userId,
            })
            .count(),
        )
        .where({ id })
    })
    return id
  }

  async reorderPostCategories(
    userId: string,
    reorderPostCategoriesRequestDto: ReorderPostCategoriesRequestDto,
  ) {
    const { postCategoryIds } = reorderPostCategoriesRequestDto
    await this.dbWriter.transaction(async (trx) => {
      await Promise.all(
        postCategoryIds.map(async (postCategoryId, index) => {
          await trx<PostCategoryEntity>(PostCategoryEntity.table)
            .where({ user_id: userId, id: postCategoryId })
            .update({ order: index })
        }),
      )
    })
  }

  async editPostCategory(
    userId: string,
    editPostCategoryRequestDto: EditPostCategoryRequestDto,
  ) {
    const { postCategoryId, name } = editPostCategoryRequestDto
    return await createOrThrowOnDuplicate(
      () =>
        this.dbWriter<PostCategoryEntity>(PostCategoryEntity.table)
          .where({
            user_id: userId,
            id: postCategoryId,
          })
          .update({ name }),
      this.logger,
      `Post category ${name} already exists`,
    )
  }

  async deletePostCategory(
    userId: string,
    deletePostCategoryRequestDto: DeletePostCategoryRequestDto,
  ) {
    const { postCategoryId, order } = deletePostCategoryRequestDto
    await this.checkPostCategory(userId, postCategoryId)
    let updated = 0
    await this.dbWriter.transaction(async (trx) => {
      await trx<PostToCategoryEntity>(PostToCategoryEntity.table)
        .where({
          post_category_id: postCategoryId,
        })
        .delete()
      updated = await trx<PostCategoryEntity>(PostCategoryEntity.table)
        .where({
          user_id: userId,
          id: postCategoryId,
          order,
        })
        .delete()
    })
    if (!updated) {
      throw new BadRequestException(
        'order and name not found for post category',
      )
    }
    return updated
  }

  async addPostToCategory(
    userId: string,
    postToCategoryRequestDto: PostToCategoryRequestDto,
  ) {
    const { postId, postCategoryId } = postToCategoryRequestDto
    await this.checkPost(userId, postId)
    await this.checkPostCategory(userId, postCategoryId)
    await this.dbWriter.transaction(async (trx) => {
      await createOrThrowOnDuplicate(
        () =>
          trx<PostToCategoryEntity>(PostToCategoryEntity.table).insert({
            post_id: postId,
            post_category_id: postCategoryId,
          }),
        this.logger,
        'Post already exists in category',
      )
      await trx<PostCategoryEntity>(PostCategoryEntity.table).increment(
        'count',
        1,
      )
    })

    return true
  }

  async removePostFromCategory(
    userId: string,
    postToCategoryRequestDto: PostToCategoryRequestDto,
  ) {
    const { postId, postCategoryId } = postToCategoryRequestDto
    await this.checkPost(userId, postId)
    await this.checkPostCategory(userId, postCategoryId)
    let update = 0

    await this.dbWriter.transaction(async (trx) => {
      update = await trx<PostToCategoryEntity>(PostToCategoryEntity.table)
        .where({ post_id: postId, post_category_id: postCategoryId })
        .delete()
      await trx<PostCategoryEntity>(PostCategoryEntity.table).decrement(
        'count',
        update,
      )
    })
    return update === 1
  }

  async checkPost(userId: string, postId: string) {
    if (
      !(await this.dbWriter<PostEntity>(PostEntity.table)
        .where({ id: postId, user_id: userId })
        .select('id')
        .first())
    ) {
      throw new BadRequestException('Post not found')
    }
  }

  async checkPostCategory(userId: string, postCategoryId: string) {
    if (
      !(await this.dbWriter<PostCategoryEntity>(PostCategoryEntity.table)
        .where({ id: postCategoryId, user_id: userId })
        .select('id')
        .first())
    ) {
      throw new BadRequestException('Post category not found')
    }
  }
}
