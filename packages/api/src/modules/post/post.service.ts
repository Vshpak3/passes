import { Knex } from '@mikro-orm/mysql'
import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { v4 } from 'uuid'
import { Logger } from 'winston'

import { Database } from '../../database/database.decorator'
import { DatabaseService } from '../../database/database.service'
import { createOrThrowOnDuplicate } from '../../util/db-nest.util'
import { CommentEntity } from '../comment/entities/comment.entity'
import { ContentDto } from '../content/dto/content.dto'
import { ContentEntity } from '../content/entities/content.entity'
import { LikeEntity } from '../likes/entities/like.entity'
import { MessagePostEntity } from '../messages/entities/message-post.entity'
import { PassHolderEntity } from '../pass/entities/pass-holder.entity'
import {
  PurchasePostCallbackInput,
  TipPostCallbackInput,
} from '../payment/callback.types'
import { PayinDataDto } from '../payment/dto/payin-data.dto'
import { PayinMethodDto } from '../payment/dto/payin-method.dto'
import { RegisterPayinResponseDto } from '../payment/dto/register-payin.dto'
import { PayinEntity } from '../payment/entities/payin.entity'
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
import { PostDto } from './dto/post.dto'
import { UpdatePostRequestDto } from './dto/update-post.dto'
import { PostEntity } from './entities/post.entity'
import { PostContentEntity } from './entities/post-content.entity'
import { PostPassAccessEntity } from './entities/post-pass-access.entity'
import { PostTipEntity } from './entities/post-tip.entity'
import { PostUserAccessEntity } from './entities/post-user-access.entity'

export const MINIMUM_POST_TIP_AMOUNT = 5.0

@Injectable()
export class PostService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,

    @Database('ReadOnly')
    private readonly dbReader: DatabaseService['knex'],
    @Database('ReadWrite')
    private readonly dbWriter: DatabaseService['knex'],

    @Inject(forwardRef(() => PaymentService))
    private readonly payService: PaymentService,
  ) {}

  async createPost(
    userId: string,
    createPostDto: CreatePostRequestDto,
  ): Promise<CreatePostResponseDto> {
    const postId = v4()
    await this.dbWriter
      .transaction(async (trx) => {
        const post = PostEntity.toDict<PostEntity>({
          id: postId,
          user: userId,
          text: createPostDto.text,
          isMessage: createPostDto.isMessage,
          price: createPostDto.price,
          expiresAt: createPostDto.expiresAt,
          scheduledAt: createPostDto.scheduledAt,
        })

        await trx(PostEntity.table).insert(post)

        const postContent = createPostDto.contentIds.map((contentId, index) =>
          PostContentEntity.toDict<PostContentEntity>({
            content: contentId,
            post: postId,
            index,
          }),
        )

        if (postContent.length) {
          await trx(PostContentEntity.table).insert(postContent)
        }
        await trx(ContentEntity.table)
          .update(createPostDto.isMessage ? 'in_message' : 'in_post', true)
          .whereIn('id', createPostDto.contentIds)

        // TODO: schedule access add
        const passAccesses = await trx(PassHolderEntity.table)
          .whereIn('pass_id', createPostDto.passIds)
          .whereNotNull('expires_at')
          .distinct('holder_id')
        for (let i = 0; i < passAccesses.length; ++i) {
          if (!passAccesses[i].holder_id) continue
          const postUserAccess =
            PostUserAccessEntity.toDict<PostUserAccessEntity>({
              post: postId,
              user: passAccesses[i].holder_id,
            })
          await trx(PostUserAccessEntity.table)
            .insert(postUserAccess)
            .onConflict(['post_id', 'user_id'])
            .ignore()
        }

        for (let i = 0; i < createPostDto.passIds.length; ++i) {
          const postPassAccess =
            PostPassAccessEntity.toDict<PostPassAccessEntity>({
              post: postId,
              pass: createPostDto.passIds[i],
            })
          await trx(PostPassAccessEntity.table).insert(postPassAccess)
        }
      })
      .catch((err) => {
        this.logger.error(err)
        throw err
      })
    return { postId }
  }

  async getGalleryMessages(userId: string, channelId: string) {
    const query = this.dbReader(MessagePostEntity.table)
      .innerJoin(
        PostEntity.table,
        `${MessagePostEntity.table}.post_id`,
        `${PostEntity.table}.id`,
      )
      .innerJoin(
        UserEntity.table,
        `${UserEntity.table}.id`,
        `${PostEntity.table}.user_id`,
      )
      .leftJoin(PostUserAccessEntity.table, function () {
        this.on(
          `${UserEntity.table}.id`,
          `${PostUserAccessEntity.table}.user_id`,
        ).andOn(
          `${PostEntity.table}.id`,
          `${PostUserAccessEntity.table}.post_id`,
        )
      })
      .leftJoin(
        LikeEntity.table,
        `${LikeEntity.table}.post_id`,
        `${PostEntity.table}.id`,
      )
      .select([
        `${PostEntity.table}.*`,
        `${UserEntity.table}.username`,
        `${UserEntity.table}.display_name`,
        `${PostUserAccessEntity.table}.post_id as access`,
        `${LikeEntity.table}.id as is_liked`,
      ])
      .where(`${PostEntity.table}.is_message`, true)
      .andWhere(`${MessagePostEntity.table}.user_id`, userId)
      .andWhere(`${MessagePostEntity.table}.channel_id`, channelId)
      .orderBy('created_at', 'desc')
    return await this.getPostsFromQuery(userId, query)
  }

  async findPost(postId: string, userId: string): Promise<PostDto> {
    const dbReader = this.dbReader
    const query = this.dbReader(PostEntity.table)
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
      throw new NotFoundException(POST_NOT_EXIST)
    }

    return postDtos[0]
  }

  async getPostsFromQuery(
    userId: string,
    query: Knex.QueryBuilder,
  ): Promise<PostDto[]> {
    const posts = await query

    const passAccesses = await this.dbReader(PostPassAccessEntity.table)
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

    const accessiblePosts = posts.reduce((arr, post) => {
      if (
        post.access || // single post purchase
        postsFromPass.has(post.id) || // owns pass that gives access
        post.user_id === userId || // user made post
        !post.price || // no price on post
        post.price === 0 // price of post is 0
      )
        arr.push(post)
      return arr
    }, [])

    const contentLookup = await this.getContentLookupForPosts(
      posts.map((post) => post.id),
    )

    const accessiblePostIds = new Set(accessiblePosts.map((post) => post.id))

    return posts.map(
      (post) =>
        new PostDto(
          post,
          !accessiblePostIds.has(post.id) && contentLookup[post.id],
          post.user_id === userId,
          accessiblePostIds.has(post.id) ? contentLookup[post.id] : undefined,
        ),
    )
  }

  private async getContentLookupForPosts(
    postIds: string[],
  ): Promise<Map<string, ContentDto[]>> {
    const postContents = await this.dbReader(PostContentEntity.table)
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
    const map = postContents.reduce((map, postContent) => {
      if (!map[postContent.post_id]) map[postContent.post_id] = []
      map[postContent.post_id].append(new ContentDto(postContent, '')) //TODO get signed URL
      return map
    }, {})
    for (const post in map) {
      map[post].sort((a, b) => a.order - b.order)
    }
    return map
  }

  async updatePost(
    userId: string,
    postId: string,
    updatePostDto: UpdatePostRequestDto,
  ) {
    const updated = await this.dbWriter(PostEntity.table)
      .where(PostEntity.toDict<PostEntity>({ id: postId, user: userId }))
      .update(PostEntity.toDict<PostEntity>({ ...updatePostDto }))

    return updated === 1
  }

  async removePost(userId: string, postId: string) {
    //TODO: allow admins + managers to remove posts
    const updated = await this.dbWriter(PostEntity.table)
      .where(PostEntity.toDict<PostEntity>({ id: postId, user: userId }))
      .update('deleted_at', new Date())
    return updated === 1
  }

  async purchasePost(userId: string, postId: string, earnings: number) {
    await this.dbWriter.transaction(async (trx) => {
      await createOrThrowOnDuplicate(
        () =>
          trx(PostUserAccessEntity.table).insert(
            PostUserAccessEntity.toDict<PostUserAccessEntity>({
              id: v4(),
              user: userId,
              post: postId,
            }),
          ),
        this.logger,
        `user ${userId} already has access to post ${postId}`,
      )
      await trx(PostEntity.table)
        .where('id', postId)
        .increment('num_purchases', 1)
      await trx(PostEntity.table)
        .where('id', postId)
        .increment('earnings_purchases', earnings)
    })
  }

  async createTip(userId: string, postId: string, amount: number) {
    await this.dbWriter(PostTipEntity.table).insert(
      PostTipEntity.toDict<PostTipEntity>({
        user: userId,
        post: postId,
        amount,
      }),
    )
    await this.dbWriter(PostEntity.table)
      .increment('total_tip_amount', amount)
      .where('id', postId)
  }

  async registerTipPost(
    userId: string,
    postId: string,
    amount: number,
    payinMethod?: PayinMethodDto,
  ): Promise<RegisterPayinResponseDto> {
    const post = await this.dbReader(PostEntity.table)
      .where('id', postId)
      .select('user_id')
      .first()

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
    fromDM: boolean,
    payinMethod?: PayinMethodDto,
  ): Promise<RegisterPayinResponseDto> {
    const { amount, target, blocked } = await this.registerPurchasePostData(
      userId,
      postId,
    )
    if (blocked) {
      throw new InvalidPayinRequestError('invalid post purchase')
    }

    const post = await this.dbReader(PostEntity.table)
      .where('id', postId)
      .select('user_id')
      .first()

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
      callback: fromDM
        ? PayinCallbackEnum.PURCHASE_DM_POST
        : PayinCallbackEnum.PURCHASE_FEED_POST,
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

    const post = await this.dbReader(PostEntity.table)
      .where('id', postId)
      .select('price')
      .first()

    const checkPayin = await this.dbReader(PayinEntity.table)
      .whereIn('payin_status', [
        PayinStatusEnum.CREATED,
        PayinStatusEnum.PENDING,
      ])
      .where('target', target)
      .select('id')
      .first()
    const checkAccess = await this.dbReader(PostUserAccessEntity.table)
      .where(
        PostUserAccessEntity.toDict<PostUserAccessEntity>({
          post: postId,
          user: userId,
        }),
      )
      .select('id')
      .first()
    const blocked = post.price !== undefined || post.price === 0
    checkPayin === undefined || checkAccess !== undefined

    return { amount: post.price, target, blocked }
  }

  async pinPost(userId: string, postId: string): Promise<boolean> {
    return (
      (await this.dbWriter(PostEntity.table)
        .where(PostEntity.toDict<PostEntity>({ user: userId, id: postId }))
        .update(
          PostEntity.toDict<PostEntity>({ pinnedAt: this.dbWriter.fn.now() }),
        )) === 1
    )
  }

  async unpinPost(userId: string, postId: string): Promise<boolean> {
    return (
      (await this.dbWriter(PostEntity.table)
        .where(PostEntity.toDict<PostEntity>({ user: userId, id: postId }))
        .update(PostEntity.toDict<PostEntity>({ pinnedAt: null }))) === 1
    )
  }

  async refreshPostsCounts() {
    const posts = await this.dbReader(PostEntity.table)
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
    await this.dbWriter
      .table(PostEntity.table)
      .where('id', postId)
      .update(
        'num_comments',
        this.dbWriter(CommentEntity.table)
          .where(
            CommentEntity.toDict<CommentEntity>({
              post: postId,
              blocked: false,
              deactivated: false,
              hidden: false,
              deletedAt: null,
            }),
          )
          .count(),
      )
    await this.dbWriter
      .table(PostEntity.table)
      .where('id', postId)
      .update(
        'num_likes',
        this.dbWriter(LikeEntity.table)
          .where(
            LikeEntity.toDict<LikeEntity>({
              post: postId,
            }),
          )
          .count(),
      )
  }
}
