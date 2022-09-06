import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsUUID } from 'class-validator'

import { ContentDto } from '../../content/dto/content.dto'

export class PostDto {
  @IsUUID()
  @ApiProperty()
  id: string

  @ApiProperty()
  paywall: boolean

  @IsUUID()
  @ApiProperty()
  userId: string

  @ApiProperty()
  username: string

  @ApiProperty()
  displayName: string

  @ApiProperty()
  text: string

  @ApiPropertyOptional({ type: [ContentDto] })
  content?: ContentDto[]

  @ApiProperty()
  numLikes: number

  @ApiProperty()
  numComments: number

  @ApiProperty()
  numPurchases: number

  @ApiProperty()
  isLiked?: boolean

  @ApiProperty()
  createdAt: Date

  @ApiProperty()
  updatedAt: Date

  @ApiPropertyOptional()
  scheduledAt?: string

  @ApiPropertyOptional()
  expiresAt?: Date

  @ApiPropertyOptional()
  price?: string

  @ApiProperty()
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
