import { Knex } from '@mikro-orm/mysql'
import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { v4 } from 'uuid'
import { Logger } from 'winston'

import {
  Database,
  DB_READER,
  DB_WRITER,
} from '../../database/database.decorator'
import { DatabaseService } from '../../database/database.service'
import { verifyTaggedText } from '../../util/text.util'
import { CommentEntity } from '../comment/entities/comment.entity'
import { ContentService } from '../content/content.service'
import { ContentDto } from '../content/dto/content.dto'
import { ContentEntity } from '../content/entities/content.entity'
import { CreatorStatEntity } from '../creator-stats/entities/creator-stat.entity'
import { LikeEntity } from '../likes/entities/like.entity'
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
import { S3ContentService } from '../s3content/s3content.service'
import { UserEntity } from '../user/entities/user.entity'
import { POST_NOT_EXIST } from './constants/errors'
import {
  CreatePostRequestDto,
  CreatePostResponseDto,
} from './dto/create-post.dto'
import { PostDto } from './dto/post.dto'
import { UpdatePostRequestDto } from './dto/update-post.dto'
import { UpdatePostContentRequestDto } from './dto/update-post-content.dto'
import { PostEntity } from './entities/post.entity'
import { PostContentEntity } from './entities/post-content.entity'
import { PostPassAccessEntity } from './entities/post-pass-access.entity'
import { PostPassHolderAccessEntity } from './entities/post-passholder-access.entity'
import { PostTipEntity } from './entities/post-tip.entity'
import { PostUserAccessEntity } from './entities/post-user-access.entity'
import { ForbiddenPostException } from './error/post.error'

export const MINIMUM_POST_TIP_AMOUNT = 5.0

@Injectable()
export class PostService {
  cloudfrontUrl: string
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
    private readonly s3ContentService: S3ContentService,
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
    await this.passService.validatePassIds(userId, createPostDto.passIds)
    await this.contentService.validateContentIds(
      userId,
      createPostDto.contentIds,
    )
    await this.dbWriter
      .transaction(async (trx) => {
        const post = PostEntity.toDict<PostEntity>({
          id: postId,
          user: userId,
          text: createPostDto.text,
          tags: JSON.stringify(createPostDto.tags),
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
          .update('in_post', true)
          .whereIn('id', createPostDto.contentIds)

        // TODO: schedule access add
        const passHolders = await trx(PassHolderEntity.table)
          .whereIn('pass_id', createPostDto.passIds)
          .whereNotNull('expires_at')
          .whereNotNull('holder_id')
          .andWhere('expires_at', '>', new Date())
          .select(['holder_id', 'id'])
        const userToPassHolders = passHolders.reduce((map, passHolder) => {
          if (!map[passHolder.holder_id]) {
            map[passHolder.holder_id] = []
          }
          map[passHolder.holder_id].push(passHolder.id)
          return map
        }, {})
        for (const userId in userToPassHolders) {
          const postUserAccess =
            PostUserAccessEntity.toDict<PostUserAccessEntity>({
              id: v4(),
              post: postId,
              user: userId,
            })
          await trx(PostUserAccessEntity.table)
            .insert(postUserAccess)
            .onConflict(['post_id', 'user_id'])
            .ignore()
          for (const passHolderId in userToPassHolders[userId]) {
            await trx(PostPassHolderAccessEntity.table)
              .insert(
                PostPassHolderAccessEntity.toDict<PostPassHolderAccessEntity>({
                  postUserAccess: postUserAccess.id,
                  passHolder: passHolderId,
                }),
              )
              .onConflict(['post_user_access_id', 'pass_holder_id'])
              .ignore()
          }
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
    await this.dbWriter(CreatorStatEntity.table)
      .where('user_id', userId)
      .update({
        num_media: this.dbWriter(ContentEntity.table)
          .where(
            ContentEntity.toDict<ContentEntity>({
              user: userId,
              inPost: true,
            }),
          )
          .count(),
      })
    return { postId }
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
      ) {
        arr.push(post)
      }
      return arr
    }, [])

    const accessiblePostIds = new Set(accessiblePosts.map((post) => post.id))

    const contentLookup = await this.getContentLookupForPosts(
      posts.map((post) => post.id),
      accessiblePostIds as Set<string>,
    )

    return posts.map(
      (post) =>
        new PostDto(
          post,
          !accessiblePostIds.has(post.id) && contentLookup[post.id],
          post.user_id === userId,
          contentLookup[post.id],
        ),
    )
  }

  private async getContentLookupForPosts(
    postIds: string[],
    accessiblePostIds: Set<string>,
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
    const map = postContents.reduce(async (map, postContent) => {
      map = await map

      if (!map[postContent.post_id]) {
        map[postContent.post_id] = []
      }
      map[postContent.post_id].append(
        new ContentDto(
          postContent,
          accessiblePostIds.has(postContent.post_id)
            ? await this.s3ContentService.signUrl(
                `${this.cloudfrontUrl}/media/${postContent.user_id}/${postContent.user_id}`,
              )
            : undefined,
        ),
      )
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
    if (
      (updatePostDto.text && !updatePostDto.tags) ||
      (!updatePostDto.text && updatePostDto.tags)
    ) {
      throw new BadRequestException('needs both text and tags')
    }
    if (updatePostDto.text && updatePostDto.tags) {
      verifyTaggedText(updatePostDto.text, updatePostDto.tags)
    }
    const updated = await this.dbWriter(PostEntity.table)
      .where(PostEntity.toDict<PostEntity>({ id: postId, user: userId }))
      .update(
        PostEntity.toDict<PostEntity>({
          text: updatePostDto.text,
          tags: JSON.stringify(updatePostDto.tags),
          price: updatePostDto.price,
          expiresAt: updatePostDto.expiresAt,
        }),
      )
    return updated === 1
  }

  async updatePostContent(
    userId: string,
    postId: string,
    updatePostDto: UpdatePostContentRequestDto,
  ) {
    await this.dbWriter.transaction(async (trx) => {
      await trx(PostContentEntity.table).where('post_id', postId).delete()
      const postContent = updatePostDto.contentIds.map((contentId, index) =>
        PostContentEntity.toDict<PostContentEntity>({
          content: contentId,
          post: postId,
          index,
        }),
      )

      if (postContent.length) {
        await trx(PostContentEntity.table).insert(postContent)
      }
    })
    await this.dbWriter(CreatorStatEntity.table)
      .where('user_id', userId)
      .update({
        num_media: this.dbWriter(ContentEntity.table)
          .where(
            ContentEntity.toDict<ContentEntity>({
              user: userId,
              inPost: true,
            }),
          )
          .count(),
      })
    return true
  }

  async removePost(userId: string, postId: string) {
    // TODO: allow admins + managers to remove posts
    const updated = await this.dbWriter(PostEntity.table)
      .where(PostEntity.toDict<PostEntity>({ id: postId, user: userId }))
      .update('deleted_at', new Date())
    return updated === 1
  }

  async purchasePost(
    userId: string,
    postId: string,
    payinId: string,
    earnings: number,
  ) {
    await this.dbWriter.transaction(async (trx) => {
      await trx(PostUserAccessEntity.table)
        .insert(
          PostUserAccessEntity.toDict<PostUserAccessEntity>({
            user: userId,
            post: postId,
            payin: payinId,
          }),
        )
        .onConflict(['post_id', 'user_id'])
        .merge(['payin_id'])
      await trx(PostEntity.table)
        .where('id', postId)
        .increment('num_purchases', 1)
      await trx(PostEntity.table)
        .where('id', postId)
        .increment('earnings_purchases', earnings)
    })
  }

  async revertPostPurchase(postId: string, payinId: string, earnings: number) {
    const id = (
      await this.dbReader(PostUserAccessEntity.table)
        .where('payin_id', payinId)
        .select('id')
        .first()
    ).id
    if (!id) {
      throw new ForbiddenPostException(
        `cant find post access for payinId ${payinId}`,
      )
    }

    const passAccess = await this.dbReader(PostPassHolderAccessEntity.table)
      .where(
        PostPassHolderAccessEntity.toDict<PostPassHolderAccessEntity>({
          postUserAccess: id,
        }),
      )
      .first()

    await this.dbWriter.transaction(async (trx) => {
      if (passAccess) {
        await trx(PostUserAccessEntity.table)
          .update(
            PostUserAccessEntity.toDict<PostUserAccessEntity>({
              payin: null,
            }),
          )
          .where('id', id)
      } else {
        await trx(PostEntity.table).where('id', id).delete()
      }
      await trx(PostEntity.table)
        .where('id', postId)
        .decrement('num_purchases', 1)
      await trx(PostEntity.table)
        .where('id', postId)
        .decrement('earnings_purchases', earnings)
    })
  }

  async createTip(
    payinId: string,
    userId: string,
    postId: string,
    amount: number,
  ) {
    await this.dbWriter(PostTipEntity.table).insert(
      PostTipEntity.toDict<PostTipEntity>({
        payin: payinId,
        user: userId,
        post: postId,
        amount,
      }),
    )
    await this.dbWriter(PostEntity.table)
      .increment('total_tip_amount', amount)
      .where('id', postId)
  }

  async deleteTip(payinId: string, postId: string, amount: number) {
    await this.dbWriter(PostEntity.table)
      .increment('total_tip_amount', amount)
      .where('id', postId)
    await this.dbWriter(PostTipEntity.table)
      .where(
        PostTipEntity.toDict<PostTipEntity>({
          payin: payinId,
        }),
      )
      .delete()
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
    payinMethod?: PayinMethodDto,
  ): Promise<RegisterPayinResponseDto> {
    const { amount, target, blocked } = await this.registerPurchasePostData(
      userId,
      postId,
    )
    if (blocked) {
      throw new InvalidPayinRequestError('blocked')
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
    await this.dbWriter(PostEntity.table)
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
    await this.dbWriter(PostEntity.table)
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
