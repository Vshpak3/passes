import { ApiProperty } from '@nestjs/swagger'

import { GetContentDto } from '../../content/dto/get-content.dto'
import { PostEntity } from '../entities/post.entity'

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

  constructor(postEntity: PostEntity) {
    this.id = postEntity.id
    this.userId = postEntity.user.id
    this.text = postEntity.text
    this.content =
      postEntity.content.getItems().map((c) => new GetContentDto(c)) ?? []
    this.numLikes = postEntity.numLikes
    this.numComments = postEntity.numComments
    this.createdAt = postEntity.createdAt.toISOString()
    this.updatedAt = postEntity.createdAt.toISOString()
  }
}
