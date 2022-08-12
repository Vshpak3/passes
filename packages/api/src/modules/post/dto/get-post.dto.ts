import { ApiProperty } from '@nestjs/swagger'

import { GetContentDto } from '../../content/dto/get-content.dto'

export class GetPostDto {
  @ApiProperty()
  id: string

  @ApiProperty()
  userId: string

  @ApiProperty()
  text: string

  @ApiProperty()
  content?: GetContentDto[]

  @ApiProperty()
  numLikes: number

  @ApiProperty()
  numComments: number

  @ApiProperty()
  createdAt: string

  @ApiProperty()
  updatedAt: string

  constructor(postEntity) {
    this.id = postEntity.id
    this.userId = postEntity.user_id
    this.text = postEntity.text
    this.content = postEntity.content.map((c) => new GetContentDto(c)) ?? []
    this.numLikes = postEntity.num_likes
    this.numComments = postEntity.num_comments
    this.createdAt = postEntity.created_at.toISOString()
    this.updatedAt = postEntity.updated_at.toISOString()
  }
}
