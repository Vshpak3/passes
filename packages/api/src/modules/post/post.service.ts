import { Knex } from '@mikro-orm/mysql'
import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
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
import { createPaginatedQuery } from '../../util/page.util'
import { verifyTaggedText } from '../../util/text.util'
import { CommentEntity } from '../comment/entities/comment.entity'
import { ContentService } from '../content/content.service'
import { ContentDto } from '../content/dto/content.dto'
import { ContentEntity } from '../content/entities/content.entity'
import { ContentTypeEnum } from '../content/enums/content-type.enum'
import { CreatorStatEntity } from '../creator-stats/entities/creator-stat.entity'
import { LikeEntity } from '../likes/entities/like.entity'
import { UserMessageContentEntity } from '../messages/entities/user-message-content.entity'
import { PassHolderEntity } from '../pass/entities/pass-holder.entity'
import { PassService } from '../pass/pass.service'
import {
  PurchasePostCallbackInput,
  TipPostCallbackInput,
} from '../payment/callback.types'
import { PayinDataDto } from '../payment/dto/payin-data.dto'
import { PayinMethodDto } from '../payment/dto/payin-method.dto'
import { RegisterPayinResponseDto } from '../payment/dto/register-payin.dto'
import { PayinEntity } from '../payment/entities/payin.entity'
import { BlockedReasonEnum } from '../payment/enum/blocked-reason.enum'
import { PayinCallbackEnum } from '../payment/enum/payin.callback.enum'
import { PayinStatusEnum } from '../payment/enum/payin.status.enum'
import { InvalidPayinRequestError } from '../payment/error/payin.error'
import { PaymentService } from '../payment/payment.service'
import { UserEntity } from '../user/entities/user.entity'
import { POST_NOT_EXIST } from './constants/errors'
import {
  CreatePostRequestDto,
  CreatePostResponseDto,
} from './dto/create-post.dto'
import { GetPostHistoryRequestDto } from './dto/get-post-history.dto'
import { GetPostsRequestDto, GetPostsResponseDto } from './dto/get-posts.dto'
import { PostDto } from './dto/post.dto'
import { PostHistoryDto } from './dto/post-history.dto'
import { UpdatePostRequestDto } from './dto/update-post.dto'
import { UpdatePostContentRequestDto } from './dto/update-post-content.dto'
import { PostEntity } from './entities/post.entity'
import { PostContentEntity } from './entities/post-content.entity'
import { PostHistoryEntity } from './entities/post-history.entity'
import { PostPassAccessEntity } from './entities/post-pass-access.entity'
import { PostPassHolderAccessEntity } from './entities/post-passholder-access.entity'
import { PostTipEntity } from './entities/post-tip.entity'
import { PostUserAccessEntity } from './entities/post-user-access.entity'
import {
  ForbiddenPostException,
  PostNotFoundException,
} from './error/post.error'

export const MINIMUM_POST_TIP_AMOUNT = 5.0

@Injectable()
export class PostService {
  private cloudfrontUrl: string

  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,
    private readonly configService: ConfigService,

    @Database(DB_READER)
    private readonly dbReader: DatabaseService['knex'],
    @Database(DB_WRITER)
    private readonly dbWriter: DatabaseService['knex'],

    @Inject(forwardRef(() => PaymentService))
    private readonly payService: PaymentService,
    private readonly passService: PassService,
    private readonly contentService: ContentService,
  ) {
    this.cloudfrontUrl = configService.get('cloudfront.baseUrl') as string
  }

  async createPost(
    userId: string,
    createPostDto: CreatePostRequestDto,
  ): Promise<CreatePostResponseDto> {
    verifyTaggedText(createPostDto.text, createPostDto.tags)
    const postId = v4()
    if (
      createPostDto.text.length === 0 &&
      createPostDto.contentIds.length === 0
    ) {
      throw new BadRequestException(
        'Must provide either text or content in a post',
      )
    }
    await this.passService.validatePassIds(userId, createPostDto.passIds)
    await this.contentService.validateContentIds(
      userId,
      createPostDto.contentIds,
    )
    await this.dbWriter
      .transaction(async (trx) => {
        const post = {
          id: postId,
          user_id: userId,
          text: createPostDto.text,
          tags: JSON.stringify(createPostDto.tags),
          price: createPostDto.price ?? 0,
          expires_at: createPostDto.expiresAt,
          scheduled_at: createPostDto.scheduledAt,
          pass_ids: JSON.stringify(createPostDto.passIds),
        }

        await trx<PostEntity>(PostEntity.table).insert(post)

        const postContent = createPostDto.contentIds.map(function (
          contentId,
          index,
        ) {
          return {
            content_id: contentId,
            post_id: postId,
            index,
          }
        })

        if (postContent.length) {
          await trx<PostContentEntity>(PostContentEntity.table).insert(
            postContent,
          )
        }
        await trx<ContentEntity>(ContentEntity.table)
          .update({ in_post: true })
          .whereIn('id', createPostDto.contentIds)

        // TODO: schedule access add
        const passHolders = await trx<PassHolderEntity>(PassHolderEntity.table)
          .whereIn('pass_id', createPostDto.passIds)
          .whereNotNull('expires_at')
          .whereNotNull('holder_id')
          .andWhere('expires_at', '>', new Date())
          .select(['holder_id', 'id'])
        const userToPassHolders = passHolders.reduce((map, passHolder) => {
          if (!passHolder.holder_id) {
            return map
          }
          if (!map[passHolder.holder_id]) {
            map[passHolder.holder_id] = []
          }
          map[passHolder.holder_id].push(passHolder.id)
          return map
        }, {})
        await Promise.all(
          Object.keys(userToPassHolders).map(async (userId) => {
            const postUserAccess = {
              id: v4(),
              post_id: postId,
              user_id: userId,
            }
            await trx<PostUserAccessEntity>(PostUserAccessEntity.table)
              .insert(postUserAccess)
              .onConflict(['post_id', 'user_id'])
              .ignore()
            await Promise.all(
              userToPassHolders[userId].map(async (passHolderId) => {
                await trx<PostPassHolderAccessEntity>(
                  PostPassHolderAccessEntity.table,
                )
                  .insert({
                    post_user_access_id: postUserAccess.id,
                    pass_holder_id: passHolderId,
                  })
                  .onConflict(['post_user_access_id', 'pass_holder_id'])
                  .ignore()
              }),
            )
          }),
        )

        for (let i = 0; i < createPostDto.passIds.length; ++i) {
          const postPassAccess = {
            post_id: postId,
            pass_id: createPostDto.passIds[i],
          }
          await trx<PostPassAccessEntity>(PostPassAccessEntity.table).insert(
            postPassAccess,
          )
        }
      })
      .catch((err) => {
        this.logger.error(err)
        throw err
      })
    await this.dbWriter<CreatorStatEntity>(CreatorStatEntity.table)
      .where({ user_id: userId })
      .update(
        'num_media',
        this.dbWriter<ContentEntity>(ContentEntity.table)
          .where({
            user_id: userId,
            in_post: true,
          })
          .count(),
      )
    // await this.dbWriter<CreatorStatEntity>(CreatorStatEntity.table)
    //   .where({ user_id: userId })
    //   .increment('num_posts')
    return { postId }
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
      .leftJoin(LikeEntity.table, function () {
        this.on(`${PostEntity.table}.id`, `${LikeEntity.table}.post_id`).andOn(
          `${LikeEntity.table}.liker_id`,
          dbReader.raw('?', [userId]),
        )
      })
      .select([
        `${PostEntity.table}.*`,
        `${UserEntity.table}.username`,
        `${UserEntity.table}.display_name`,
        `${PostUserAccessEntity.table}.post_id as access`,
        `${LikeEntity.table}.id as is_liked`,
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
  ): Promise<GetPostsResponseDto> {
    const { scheduledOnly, lastId, createdAt } = getPostsRequestDto
    let query = this.dbReader<PostEntity>(PostEntity.table)
      .select([`${PostEntity.table}.*`])
      .whereNull(`${PostEntity.table}.deleted_at`)
      .andWhere(`${PostEntity.table}.user_id`, userId)
    query = createPaginatedQuery(
      query,
      PostEntity.table,
      PostEntity.table,
      'created_at',
      'desc',
      createdAt,
      lastId,
    )
    if (scheduledOnly) {
      query = query.whereNotNull('scheduled_at')
    }
    const postDtos = await this.getPostsFromQuery(userId, query)
    return new GetPostsResponseDto(postDtos)
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
      .whereNull(`${PassHolderEntity.table}.expires_at`)
      .select('post_id')
    const postsFromPass = new Set(
      passAccesses.map((passAccess) => passAccess.post_id),
    )

    const accessiblePosts = posts.filter(
      (post) =>
        post.access || // single post purchase
        postsFromPass.has(post.id) || // owns pass that gives access
        post.user_id === userId || // user made post
        !post.price || // no price on post
        post.price === 0, // price of post is 0
    )

    const accessiblePostIds = new Set(accessiblePosts.map((post) => post.id))

    const contentLookup = await this.getContentLookupForPosts(
      posts.map((post) => post.id),
      accessiblePostIds as Set<string>,
    )

    return posts.map(
      (post) =>
        new PostDto(
          post,
          !accessiblePostIds.has(post.id) &&
            contentLookup[post.id] !== undefined,
          post.user_id === userId,
          contentLookup[post.id],
        ),
    )
  }

  private async getContentLookupForPosts(
    postIds: string[],
    accessiblePostIds: Set<string>,
  ): Promise<Record<string, ContentDto[]>> {
    const postContents = await this.dbReader<PostContentEntity>(
      PostContentEntity.table,
    )
      .innerJoin(
        ContentEntity.table,
        `${ContentEntity.table}.id`,
        `${PostContentEntity.table}.content_id`,
      )
      .whereIn(`${PostContentEntity.table}.post_id`, postIds)
      .select([
        `${PostContentEntity.table}.post_id`,
        `${ContentEntity.table}.*`,
      ])
    const map = postContents.reduce(async (map, postContent) => {
      map = await map

      if (!map[postContent.post_id]) {
        map[postContent.post_id] = []
      }
      map[postContent.post_id].push(
        new ContentDto(
          postContent,
          accessiblePostIds.has(postContent.post_id)
            ? await this.contentService.preSignMediaContent(
                postContent.user_id,
                postContent.id,
                postContent.content_type,
              )
            : undefined,
        ),
      )
      return map
    }, {})
    Object.keys(map).forEach((key) =>
      map[key].sort((a, b) => a.order - b.order),
    )
    return map
  }

  async updatePost(
    userId: string,
    postId: string,
    updatePostDto: UpdatePostRequestDto,
  ) {
    if (
      (updatePostDto.text && !updatePostDto.tags) ||
      (!updatePostDto.text && updatePostDto.tags)
    ) {
      throw new BadRequestException('needs both text and tags')
    }
    if (updatePostDto.text && updatePostDto.tags) {
      verifyTaggedText(updatePostDto.text, updatePostDto.tags)
    }
    const updated = await this.dbWriter<PostEntity>(PostEntity.table)
      .where({ id: postId, user_id: userId })
      .update({
        text: updatePostDto.text,
        tags: JSON.stringify(updatePostDto.tags),
        price: updatePostDto.price,
        expires_at: updatePostDto.expiresAt,
      })
    return updated === 1
  }

  async updatePostContent(
    userId: string,
    postId: string,
    updatePostDto: UpdatePostContentRequestDto,
  ) {
    await this.dbWriter.transaction(async (trx) => {
      await trx<PostContentEntity>(PostContentEntity.table)
        .where({ post_id: postId })
        .delete()
      const postContent = updatePostDto.contentIds.map(function (
        contentId,
        index,
      ) {
        return {
          content_id: contentId,
          post_id: postId,
          index,
        }
      })

      if (postContent.length) {
        await trx<PostContentEntity>(PostContentEntity.table).insert(
          postContent,
        )
      }
    })
    await this.dbWriter<CreatorStatEntity>(CreatorStatEntity.table)
      .where({ user_id: userId })
      .update(
        'num_media',
        this.dbWriter<ContentEntity>(ContentEntity.table)
          .where({
            user_id: userId,
            in_post: true,
          })
          .count(),
      )
    return true
  }

  async removePost(userId: string, postId: string) {
    const updated = await this.dbWriter<PostEntity>(PostEntity.table)
      .where({ id: postId, user_id: userId, deleted_at: null })
      .update({ deleted_at: new Date() })
    // await this.dbWriter<CreatorStatEntity>(CreatorStatEntity.table)
    //   .where({ user_id: userId })
    //   .decrement('num_posts', updated)
    return updated === 1
  }

  async purchasePost(
    userId: string,
    postId: string,
    payinId: string,
    earnings: number,
  ) {
    await this.dbWriter.transaction(async (trx) => {
      await trx<PostUserAccessEntity>(PostUserAccessEntity.table)
        .insert({
          user_id: userId,
          post_id: postId,
          payin_id: payinId,
        })
        .onConflict(['post_id', 'user_id'])
        .merge(['payin_id'])
      await trx<PostEntity>(PostEntity.table)
        .where({ id: postId })
        .increment('num_purchases', 1)
      await trx<PostEntity>(PostEntity.table)
        .where({ id: postId })
        .increment('earnings_purchases', earnings)

      const contentIds = (
        await trx<PostContentEntity>(PostContentEntity.table)
          .where({ post_id: postId })
          .select('content_id')
      ).map((postContent) => postContent.content_id)

      await Promise.all(
        contentIds.map(async (contentId) => {
          await trx<UserMessageContentEntity>(UserMessageContentEntity.table)
            .insert({
              user_id: userId,
              content_id: contentId,
            })
            .onConflict()
            .ignore()
        }),
      )
    })
  }

  async revertPostPurchase(postId: string, payinId: string, earnings: number) {
    const id = (
      await this.dbReader<PostUserAccessEntity>(PostUserAccessEntity.table)
        .where({ payin_id: payinId })
        .select('id')
        .first()
    )?.id
    if (!id) {
      throw new ForbiddenPostException(
        `cant find post access for payinId ${payinId}`,
      )
    }

    const passAccess = await this.dbReader<PostPassHolderAccessEntity>(
      PostPassHolderAccessEntity.table,
    )
      .where({ post_user_access_id: id })
      .first()

    await this.dbWriter.transaction(async (trx) => {
      if (passAccess) {
        await trx<PostUserAccessEntity>(PostUserAccessEntity.table)
          .update({ payin_id: undefined })
          .where({ id: id })
      } else {
        await trx<PostEntity>(PostEntity.table).where({ id: id }).delete()
      }
      await trx<PostEntity>(PostEntity.table)
        .where({ id: postId })
        .decrement('num_purchases', 1)
      await trx<PostEntity>(PostEntity.table)
        .where({ id: postId })
        .decrement('earnings_purchases', earnings)
    })
  }

  async createTip(
    payinId: string,
    userId: string,
    postId: string,
    amount: number,
  ) {
    await this.dbWriter<PostTipEntity>(PostTipEntity.table).insert({
      payin_id: payinId,
      user_id: userId,
      post_id: postId,
      amount,
    })
    await this.dbWriter<PostEntity>(PostEntity.table)
      .increment('total_tip_amount', amount)
      .where({ id: postId })
  }

  async deleteTip(payinId: string, postId: string, amount: number) {
    await this.dbWriter<PostEntity>(PostEntity.table)
      .increment('total_tip_amount', amount)
      .where({ id: postId })
    await this.dbWriter<PostTipEntity>(PostTipEntity.table)
      .where({ payin_id: payinId })
      .delete()
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
      throw new InvalidPayinRequestError('blocked')
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
    const checkPayin = await this.dbReader<PayinEntity>(PayinEntity.table)
      .whereIn('payin_status', [
        PayinStatusEnum.CREATED,
        PayinStatusEnum.PENDING,
      ])
      .where({ target: target })
      .select('id')
      .first()
    const checkAccess = await this.dbReader<PostUserAccessEntity>(
      PostUserAccessEntity.table,
    )
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
    } else if (checkPayin !== undefined) {
      blocked = BlockedReasonEnum.PURCHASE_IN_PROGRESS
    } else if (checkAccess !== undefined) {
      blocked = BlockedReasonEnum.ALREADY_HAS_ACCESS
    }

    return { amount: post.price, target, blocked }
  }

  async pinPost(userId: string, postId: string): Promise<boolean> {
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
        .update({ pinned_at: undefined })) === 1
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
        .andWhere(function () {
          return this.where('scheduled_at', '<', new Date()).orWhereNull(
            'scheduled_at',
          )
        })
        .count(),
    )
  }

  async refreshPostsCounts() {
    const posts = await this.dbReader<PostEntity>(PostEntity.table)
      .whereNull('deleted_at')
      .select('id')
    await Promise.all(
      posts.map(async (post) => {
        try {
          await this.refreshPostCounts(post.id)
        } catch (err) {
          this.logger.error(`Error updating post counts for ${post.id}`, err)
        }
      }),
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
        this.dbWriter<LikeEntity>(LikeEntity.table)
          .where({
            post_id: postId,
          })
          .count(),
      )
  }

  async isAllPostContentReady(postId: string): Promise<boolean> {
    const user = await this.dbReader<PostEntity>(PostEntity.table)
      .where({ id: postId })
      .select('user_id')
      .first()

    if (!user) {
      throw new InternalServerErrorException(
        `Unexpected missing user id for post ${postId}`,
      )
    }

    const contentIds = await this.dbReader<PostContentEntity>(
      PostContentEntity.table,
    )
      .where({ post_id: postId })
      .select('content_id')

    // TODO: join on content entity to get type

    const results = await Promise.all(
      contentIds.map(async (contentId) => {
        return await this.contentService.preSignMediaContent(
          user.user_id,
          contentId.content_id,
          ContentTypeEnum.IMAGE,
        )
      }),
    )

    return results.filter((r) => !r).length === 0
  }
}
