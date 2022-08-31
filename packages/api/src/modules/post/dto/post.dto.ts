import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { GetContentResponseDto } from '../../content/dto/get-content.dto'

export class PostDto {
  @ApiProperty()
  id: string

  @ApiProperty()
  paywall: boolean

  @ApiProperty()
  userId: string

  @ApiProperty()
  username: string

  @ApiProperty()
  text: string

  @ApiPropertyOptional({ type: [GetContentResponseDto] })
  content?: GetContentResponseDto[]

  @ApiProperty()
  numLikes: number

  @ApiProperty()
  numComments: number

  @ApiProperty()
  isLiked?: boolean

  @ApiProperty()
  createdAt: Date

  @ApiProperty()
  updatedAt: Date

  @ApiPropertyOptional()
  expiresAt?: number

  @ApiPropertyOptional()
  price?: string

  @ApiProperty()
  totalTipAmount?: number

  constructor(post, paywall, content?: GetContentResponseDto[]) {
    if (post) {
      if (!paywall) {
        this.text = post.text
        this.numLikes = post.num_likes
        this.numComments = post.num_comments
        this.isLiked = post.num_likes > 0
        this.totalTipAmount = post.total_tip_amount
      }
      this.updatedAt = post.updated_at
      this.expiresAt = post.expires_at
        ? post.expires_at
        : new Date(post.expires_at)
      this.id = post.id
      this.userId = post.user_id
      this.username = post.username
      this.createdAt = post.created_at
      this.paywall = paywall
      if (content) {
        this.content = content
      }
    }
  }
}
