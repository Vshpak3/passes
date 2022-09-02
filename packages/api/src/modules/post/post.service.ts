import { Knex } from '@mikro-orm/mysql'
import {
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { v4 } from 'uuid'
import { Logger } from 'winston'

import { Database } from '../../database/database.decorator'
import { DatabaseService } from '../../database/database.service'
import { createOrThrowOnDuplicate } from '../../util/db-nest.util'
import { formatDateTimeToDbDateTime } from '../../util/formatter.util'
import { GetContentResponseDto } from '../content/dto/get-content.dto'
import { ContentEntity } from '../content/entities/content.entity'
import { LikeEntity } from '../likes/entities/like.entity'
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
import { POST_DELETED, POST_NOT_EXIST } from './constants/errors'
import { CreatePostRequestDto } from './dto/create-post.dto'
import { PostDto } from './dto/post.dto'
import { UpdatePostRequestDto } from './dto/update-post.dto'
import { PostEntity } from './entities/post.entity'
import { PostPassAccessEntity } from './entities/post-pass-access.entity'
import { PostTipEntity } from './entities/post-tip.entity'
import { PostUserAccessEntity } from './entities/post-user-access.entity'

export const MINIMUM_POST_TIP_AMOUNT = 5.0

type ContentLookupByPost = {
  [postId: number]: GetContentResponseDto[]
}

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

  async create(
    userId: string,
    createPostDto: CreatePostRequestDto,
  ): Promise<CreatePostRequestDto> {
    let trxErr: Error | undefined = undefined
    await this.dbWriter
      .transaction(async (trx) => {
        const postId = v4()
        const scheduledAt = createPostDto.scheduledAt
          ? formatDateTimeToDbDateTime(createPostDto.scheduledAt)
          : undefined
        const post = PostEntity.toDict<PostEntity>({
          id: postId,
          user: userId,
          text: createPostDto.text,
          private: createPostDto.private,
          price: createPostDto.price,
          expiresAt: createPostDto.expiresAt,
          scheduledAt,
        })

        await this.dbWriter(PostEntity.table)
          .insert(post, '*')
          .transacting(trx)
          .catch((err) => {
            this.logger.error(err)
            throw new InternalServerErrorException()
          })

        const contentPosts = createPostDto.content?.map((contentId) => ({
          content_entity_id: contentId,
          post_entity_id: postId,
        }))

        if (contentPosts?.length) await trx('content_post').insert(contentPosts)

        for (let i = 0; i < createPostDto.passes.length; ++i) {
          const postPassAccess = {
            post_id: postId,
            pass_id: createPostDto.passes[i],
          }

          await trx(PostPassAccessEntity.table).insert(postPassAccess)
        }
      })
      .catch((err) => {
        trxErr = err
        this.logger.error(err)
      })
    if (trxErr) {
      throw new InternalServerErrorException()
    }
    return createPostDto
  }

  async findOne(id: string, userId: string): Promise<PostDto> {
    const dbquery = this.dbReader(PostEntity.table)
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
      .whereNull(`${PostEntity.table}.deleted_at`)
      .andWhere(`${PostEntity.table}.id`, id)

    const postDtos = await this.getPostsFromQuery(userId, dbquery)

    if (postDtos.length === 0) {
      throw new NotFoundException(POST_NOT_EXIST)
    }

    return postDtos[0]
  }

  async getPostsFromQuery(
    userId: string,
    query: Knex.QueryBuilder,
  ): Promise<Array<PostDto>> {
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
      .andWhere(`${PassHolderEntity.table}.expires_at`, '>', Date.now())
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
          accessiblePostIds.has(post.id) ? contentLookup[post.id] : undefined,
        ),
    )
  }

  private async getContentLookupForPosts(
    postIds: string[],
  ): Promise<ContentLookupByPost> {
    const contentResults = await this.dbReader(ContentEntity.table)
      .innerJoin(
        'content_post',
        `${ContentEntity.table}.id`,
        'content_post.content_entity_id',
      )
      .whereIn('content_post.post_entity_id', postIds)
      .select(['*', `${ContentEntity.table}.id`])

    const ans: ContentLookupByPost = {}
    for (let i = 0; i < contentResults.length; ++i) {
      const c = contentResults[i]

      if (!(c.post_entity_id in ans)) {
        ans[c.post_entity_id] = []
      }

      ans[c.post_entity_id].push(c)
    }

    return ans
  }

  async update(
    userId: string,
    postId: string,
    updatePostDto: UpdatePostRequestDto,
  ) {
    const postDbResult = await this.dbReader(PostEntity.table)
      .select('*')
      .where('post.id', postId)
      .where('post.user_id', userId)
      .first()

    if (!postDbResult) {
      throw new NotFoundException(POST_NOT_EXIST)
    }

    if (postDbResult.deletedAt) {
      throw new NotFoundException(POST_DELETED)
    }

    //TODO: actually update post here
    this.logger.info(updatePostDto)

    //TODO: actually update post here
    this.logger.info(updatePostDto)

    return new PostDto(postDbResult, [])
  }

  async remove(userId: string, postId: string) {
    //TODO: allow admins + managers to remove posts
    const post = await this.dbReader(PostEntity.table)
      .where(PostEntity.toDict<PostEntity>({ id: postId, user: userId }))
      .first()
    if (!post) {
      throw new NotFoundException(POST_NOT_EXIST)
    }
    return true
  }

  async purchasePost(userId: string, postId: string) {
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
}
