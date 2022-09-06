import { IsUUID } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
import { ContentDto } from '../../content/dto/content.dto'

export class PostDto {
  @IsUUID()
  @DtoProperty()
  id: string

  @DtoProperty()
  paywall: boolean

  @IsUUID()
  @DtoProperty()
  userId: string

  @DtoProperty()
  username: string

  @DtoProperty()
  displayName: string

  @DtoProperty()
  text: string

  @DtoProperty({ type: [ContentDto], required: false })
  content?: ContentDto[]

  @DtoProperty()
  numLikes: number

  @DtoProperty()
  numComments: number

  @DtoProperty()
  numPurchases: number

  @DtoProperty({ required: false })
  isLiked?: boolean

  @DtoProperty()
  createdAt: Date

  @DtoProperty()
  updatedAt: Date

  @DtoProperty({ required: false })
  scheduledAt?: string

  @DtoProperty({ required: false })
  expiresAt?: Date

  @DtoProperty({ required: false })
  price?: string

  @DtoProperty({ required: false })
  totalTipAmount?: number

  constructor(post, paywall, content?: ContentDto[]) {
    if (post) {
      // only content gets paywalled
      this.text = post.text
      this.numLikes = post.num_likes
      this.numComments = post.num_comments
      this.numPurchases = post.num_purchases
      this.isLiked = post.is_liked
      this.totalTipAmount = post.total_tip_amount
      this.updatedAt = post.updated_at
      this.expiresAt = post.expires_at
      this.id = post.id
      this.userId = post.user_id
      this.username = post.username
      this.displayName = post.display_name
      this.createdAt = post.created_at
      this.scheduledAt = post.scheduled_at
      this.paywall = paywall
      if (content) {
        this.content = content
      }
    }
  }
}
