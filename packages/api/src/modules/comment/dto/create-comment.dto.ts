import { ApiProperty } from '@nestjs/swagger'
import { Length } from 'class-validator'

export class CreateCommentDto {
  @ApiProperty()
  postId: string

  @ApiProperty()
  @Length(1, 150)
  content: string
}
