import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  Length,
  Max,
  Min,
} from 'class-validator'

import { TagDto } from '../../../util/dto/tag.dto'
import { DtoProperty } from '../../../web/dto.web'
import { ContentDto } from '../../content/dto/content.dto'
import {
  USER_DISPLAY_NAME_LENGTH,
  USER_USERNAME_LENGTH,
} from '../../user/constants/schema'
import {
  POST_PRICE_MAX_PRICE,
  POST_TAG_MAX_COUNT,
  POST_TEXT_LENGTH,
} from '../constants/schema'
import { PostEntity } from '../entities/post.entity'

export class PostDto {
  @DtoProperty({ type: 'uuid' })
  postId: string

  @DtoProperty({ type: 'boolean' })
  paywall: boolean

  @DtoProperty({ type: 'uuid' })
  userId: string

  @Length(1, USER_USERNAME_LENGTH)
  @DtoProperty({ type: 'string' })
  username: string

  @Length(1, USER_DISPLAY_NAME_LENGTH)
  @DtoProperty({ type: 'string' })
  displayName: string

  @Length(0, POST_TEXT_LENGTH)
  @DtoProperty({ type: 'string' })
  text: string

  @IsArray()
  @ArrayMinSize(0)
  @ArrayMaxSize(POST_TAG_MAX_COUNT)
  @DtoProperty({ custom_type: [TagDto] })
  tags: TagDto[]

  @DtoProperty({ custom_type: [ContentDto], optional: true })
  content?: ContentDto[]

  @DtoProperty({ type: 'uuid[]' })
  passIds: string[]

  @DtoProperty({ type: 'number' })
  numLikes: number

  @Min(0)
  @DtoProperty({ type: 'number' })
  numComments: number

  @Min(0)
  @DtoProperty({ type: 'number' })
  numPurchases: number

  @Min(0)
  @DtoProperty({ type: 'currency' })
  earningsPurchases: number

  @DtoProperty({ type: 'boolean', optional: true })
  isLiked?: boolean

  @DtoProperty({ type: 'date' })
  createdAt: Date

  @DtoProperty({ type: 'date' })
  updatedAt: Date

  @DtoProperty({ type: 'date', optional: true, nullable: true })
  scheduledAt?: Date | null

  @DtoProperty({ type: 'date', optional: true, nullable: true })
  expiresAt?: Date | null

  @Min(0)
  @Max(POST_PRICE_MAX_PRICE)
  @DtoProperty({ type: 'currency', optional: true })
  price?: number

  @Min(0)
  @DtoProperty({ type: 'currency', optional: true })
  totalTipAmount?: number

  @DtoProperty({ type: 'boolean' })
  isOwner: boolean

  constructor(
    post: PostEntity & {
      is_liked: boolean
      username: string
      display_name: string
    },
    paywall,
    isOwner,
    content?: ContentDto[],
  ) {
    if (post) {
      // only content gets paywalled
      this.text = post.text
      this.numLikes = post.num_likes
      this.numComments = post.num_comments
      this.isLiked = post.is_liked
      this.updatedAt = post.updated_at
      this.expiresAt = post.expires_at
      this.postId = post.id
      this.userId = post.user_id
      this.username = post.username
      this.displayName = post.display_name
      this.createdAt = post.created_at
      this.price = post.price
      this.paywall = paywall
      this.tags = JSON.parse(post.tags)
      this.passIds = JSON.parse(post.pass_ids)
      if (isOwner) {
        this.scheduledAt = post.scheduled_at
        this.totalTipAmount = post.total_tip_amount
        this.earningsPurchases = post.earnings_purchases
        this.numPurchases = post.num_purchases
      }
      this.isOwner = isOwner
      if (content) {
        this.content = content
      }
    }
  }
}
