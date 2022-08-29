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
import { GetContentResponseDto } from '../content/dto/get-content.dto'
import { ContentEntity } from '../content/entities/content.entity'
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
import { POST_DELETED, POST_NOT_EXIST } from './constants/errors'
import { CreatePostRequestDto } from './dto/create-post.dto'
import { PostDto } from './dto/post.dto'
import { UpdatePostRequestDto } from './dto/update-post.dto'
import { PostEntity } from './entities/post.entity'
import { PostPassAccessEntity } from './entities/post-pass-access.entity'
import { PostTipEntity } from './entities/post-tip.entity'
import { PostUserAccessEntity } from './entities/post-user-access.entity'

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
        const post = PostEntity.toDict<PostEntity>({
          id: postId,
          user: userId,
          text: createPostDto.text,
          private: createPostDto.private,
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

  async findOne(id: string, userId?: string): Promise<PostDto> {
    const postDbResult = await this.dbReader(PostEntity.table)
      .leftJoin('content_post', 'content_post.post_id', 'post.id')
      .leftJoin(ContentEntity.table, 'content.id', 'content_post.post_id')
      .select(
        'post.id',
        // eslint-disable-next-line sonarjs/no-duplicate-string
        'post.user_id',
        'post.text',
        'post.num_likes',
        'post.num_comments',
        'post.created_at',
        'post.updated_at',
        'content.id as content_id',
        'content.url',
        'content.content_type',
        'post.deleted_at',
        this.dbReader.raw(
          `exists(select * from post_like l where l.post_id = ${PostEntity.table}.id and l.liker_id = '${userId}') as is_liked`,
        ),
      )
      .where('post.id', id)

    if (!postDbResult[0]) {
      throw new NotFoundException(POST_NOT_EXIST)
    }

    if (postDbResult[0].deleted_at) {
      throw new NotFoundException(POST_DELETED)
    }

    const postContent = postDbResult
      .map((postContentRow) => {
        if (
          postContentRow.content_id &&
          postContentRow.url &&
          postContentRow.content_type
        ) {
          return new GetContentResponseDto({
            id: postContentRow.content_id,
            ...postContentRow,
          })
        } else {
          return undefined
        }
      })
      .filter(
        (postContentDtoOrUndefined) => postContentDtoOrUndefined != undefined,
      )

    return new PostDto(
      postDbResult[0].id,
      postDbResult[0].user_id,
      postDbResult[0].text,
      postContent as GetContentResponseDto[],
      postDbResult[0].num_likes,
      postDbResult[0].num_comments,
      postDbResult[0].created_at.toISOString(),
      postDbResult[0].updated_at.toISOString(),
      !!postDbResult[0].is_liked,
    )
  }

  async update(
    userId: string,
    postId: string,
    updatePostDto: UpdatePostRequestDto,
  ) {
    const postDbResult = await this.dbReader(PostEntity.table)
      .select(
        'post.id',
        'post.user_id',
        'post.deleted_at',
        'post.text',
        'post.num_likes',
        'post.num_comments',
        'post.created_at',
        'post.updated_at',
      )
      .where('post.id', postId)
      .where('post.user_id', userId)

    if (!postDbResult[0]) {
      throw new NotFoundException(POST_NOT_EXIST)
    }

    if (postDbResult[0].deletedAt) {
      throw new NotFoundException(POST_DELETED)
    }

    //TODO: actually update post here
    this.logger.info(updatePostDto)

    //TODO: actually update post here
    this.logger.info(updatePostDto)

    return new PostDto(
      postDbResult[0].id,
      postDbResult[0].user_id,
      postDbResult[0].text,
      [],
      postDbResult[0].num_likes,
      postDbResult[0].num_comments,
      postDbResult[0].created_at.toISOString(),
      postDbResult[0].updated_at.toISOString(),
    )
  }

  async remove(userId: string, postId: string) {
    const post = await this.dbReader(PostEntity.table)
      .where({ id: postId })
      .first()
    if (!post) {
      throw new NotFoundException(POST_NOT_EXIST)
    }
    return true
  }

  async addUserAccess(userId: string, postId: string) {
    await createOrThrowOnDuplicate(
      () =>
        this.dbWriter(PostUserAccessEntity.table).insert(
          PostUserAccessEntity.toDict<PostUserAccessEntity>({
            id: v4(),
            user: userId,
            post: postId,
          }),
        ),
      this.logger,
      `user ${userId} already has access to post ${postId}`,
    )
  }

  async createTip(userId: string, postId: string, amount: number) {
    await this.dbWriter(PostTipEntity.table).insert(
      PostTipEntity.toDict<PostTipEntity>({
        id: v4(),
        user: userId,
        post: postId,
        amount,
      }),
    )
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
      creatorId: post.userId,
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
      creatorId: post.userId,
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
}
