import { IsInt, IsUUID, Length, Min } from 'class-validator'

import { TagDto } from '../../../util/dto/tag.dto'
import { DtoProperty } from '../../../web/dto.web'
import { ContentDto } from '../../content/dto/content.dto'
import {
  USER_DISPLAY_NAME_LENGTH,
  USER_USERNAME_LENGTH,
} from '../../user/constants/schema'
import { POST_TEXT_LENGTH } from '../constants/schema'

export class PostDto {
  @IsUUID()
  @DtoProperty()
  postId: string

  @DtoProperty()
  paywall: boolean

  @IsUUID()
  @DtoProperty()
  userId: string

  @Length(1, USER_USERNAME_LENGTH)
  @DtoProperty()
  username: string

  @Length(1, USER_DISPLAY_NAME_LENGTH)
  @DtoProperty()
  displayName: string

  @Length(1, POST_TEXT_LENGTH)
  @DtoProperty()
  text: string

  @DtoProperty()
  tags: TagDto[]

  @DtoProperty({ type: [ContentDto], required: false })
  content?: ContentDto[]

  @IsInt()
  @Min(0)
  @DtoProperty()
  numLikes: number

  @IsInt()
  @Min(0)
  @DtoProperty()
  numComments: number

  @IsInt()
  @Min(0)
  @DtoProperty()
  numPurchases: number

  @Min(0)
  @DtoProperty()
  earningsPurchases: number

  @DtoProperty({ optional: true })
  isLiked?: boolean

  @DtoProperty()
  createdAt: Date

  @DtoProperty()
  updatedAt: Date

  @DtoProperty({ optional: true })
  scheduledAt?: string

  @DtoProperty({ optional: true })
  expiresAt?: Date

  @Min(0)
  @DtoProperty({ optional: true })
  price?: string

  @Min(0)
  @DtoProperty({ optional: true })
  totalTipAmount?: number

  constructor(post, paywall, isCreator, content?: ContentDto[]) {
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
      this.paywall = paywall
      this.tags = JSON.parse(post.tags)
      if (isCreator) {
        this.scheduledAt = post.scheduled_at
        this.totalTipAmount = post.total_tip_amount
        this.earningsPurchases = post.earnings_purchases
        this.numPurchases = post.num_purchases
      }
      if (content) {
        this.content = content
      }
    }
  }
}
