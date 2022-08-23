import { ApiProperty } from '@nestjs/swagger'

import { GetContentDto } from '../../content/dto/get-content.dto'

export class GetPostDto {
  @ApiProperty()
  id: string

  @ApiProperty()
  userId: string

  @ApiProperty()
  text: string

  @ApiProperty({ type: [GetContentDto] })
  content?: GetContentDto[]

  @ApiProperty()
  numLikes: number

  @ApiProperty()
  numComments: number

  @ApiProperty()
  hasLiked?: boolean

  @ApiProperty()
  createdAt: string

  @ApiProperty()
  updatedAt: string

  constructor(
    id: string,
    userId: string,
    text: string,
    content: GetContentDto[],
    numLikes: number,
    numComments: number,
    createdAt: string,
    updatedAt: string,
    hasLiked?: boolean,
  ) {
    this.id = id
    this.userId = userId
    this.text = text
    this.content = content
    this.numLikes = numLikes
    this.numComments = numComments
    this.createdAt = createdAt
    this.updatedAt = updatedAt
    this.hasLiked = hasLiked
  }
}
