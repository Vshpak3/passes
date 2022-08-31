import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { GetContentResponseDto } from '../../content/dto/get-content.dto'

export class PostDto {
  @ApiProperty()
  id: string

  @ApiProperty()
  userId: string

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
  expiresAt?: Date

  @ApiPropertyOptional()
  price?: string

  @ApiProperty()
  totalTipAmount?: number

  constructor(post, content?: GetContentResponseDto[]) {
    if (post) {
      this.id = post.id
      this.userId = post.user_id
      this.text = post.text
      this.numLikes = post.num_likes
      this.numComments = post.num_comments
      this.createdAt = post.created_at
      this.updatedAt = post.updated_at
      this.expiresAt = post.expires_at
        ? post.expires_at
        : new Date(post.expires_at)
      this.isLiked = !!post.is_liked
      this.totalTipAmount = post.total_tip_amount
    }
    if (content) {
      this.content = content
    }
  }
}
