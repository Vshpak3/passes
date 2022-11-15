import { PickType } from '@nestjs/swagger'
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
import { UserDto } from '../../user/dto/user.dto'
import { MAX_PAID_POST_PRICE } from '../constants/limits'
import { POST_TAG_MAX_COUNT, POST_TEXT_LENGTH } from '../constants/schema'
import { PostEntity } from '../entities/post.entity'

export class PostDto extends PickType(UserDto, [
  'userId',
  'username',
  'displayName',
] as const) {
  @DtoProperty({ type: 'uuid' })
  postId: string

  @DtoProperty({ type: 'boolean' })
  accessible: boolean

  @Length(0, POST_TEXT_LENGTH)
  @DtoProperty({ type: 'string' })
  text: string

  @IsArray()
  @ArrayMinSize(0)
  @ArrayMaxSize(POST_TAG_MAX_COUNT)
  @DtoProperty({ custom_type: [TagDto] })
  tags: TagDto[]

  @DtoProperty({ custom_type: [ContentDto], optional: true })
  contents?: ContentDto[]

  @DtoProperty({ type: 'number' })
  previewIndex: number

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
  expiresAt?: Date | null

  @DtoProperty({ type: 'date', optional: true, nullable: true })
  deletedAt?: Date | null

  @DtoProperty({ type: 'date', optional: true, nullable: true })
  hiddenAt?: Date | null

  @DtoProperty({ type: 'date', optional: true, nullable: true })
  pinnedAt?: Date | null

  @Min(0)
  @Max(MAX_PAID_POST_PRICE)
  @DtoProperty({ type: 'currency', optional: true })
  price?: number

  @Min(0)
  @DtoProperty({ type: 'currency', optional: true })
  totalTipAmount?: number

  @DtoProperty({ type: 'boolean' })
  isOwner: boolean

  @DtoProperty({ type: 'date', nullable: true, optional: true })
  paidAt?: Date | null

  @DtoProperty({ type: 'boolean' })
  paying: boolean

  @DtoProperty({ type: 'boolean' })
  contentProcessed: boolean

  @DtoProperty({ type: 'number' })
  yourTips: number

  constructor(
    post:
      | (PostEntity & {
          is_liked?: string
          username: string
          display_name: string
          paid_at?: Date | null
          paying?: boolean
          your_tips?: number
        })
      | undefined,
    isOwner,
    accessible,
    contents?: ContentDto[],
  ) {
    super()
    if (contents) {
      this.contents = contents
    }
    if (post) {
      this.text = post.text
      this.numLikes = post.num_likes
      this.numComments = post.num_comments
      this.isLiked = !!post.is_liked
      this.updatedAt = post.updated_at
      this.expiresAt = post.expires_at
      this.postId = post.id
      this.userId = post.user_id
      this.username = post.username
      this.displayName = post.display_name
      this.createdAt = post.created_at
      this.price = post.price
      this.tags = JSON.parse(post.tags)
      this.passIds = JSON.parse(post.pass_ids)
      this.previewIndex = post.preview_index
      this.deletedAt = post.deleted_at
      this.hiddenAt = post.hidden_at
      this.pinnedAt = post.pinned_at
      this.paidAt = post.paid_at
      this.paying = !!post.paying
      this.contentProcessed = post.content_processed
      this.yourTips = post.your_tips ?? 0
      if (isOwner) {
        this.totalTipAmount = post.total_tip_amount
        this.earningsPurchases = post.earnings_purchases
        this.numPurchases = post.num_purchases
      }
      this.isOwner = isOwner
      this.accessible = accessible
    }
  }
}
