import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsUUID } from 'class-validator'

export class GetBatchMessageResponseDto {
  @IsUUID()
  @ApiProperty()
  id: string

  @ApiProperty()
  text: string

  @ApiProperty()
  list: string

  @ApiPropertyOptional()
  content?: string[]

  @ApiPropertyOptional()
  lastProcessed?: string // listMemberEntity id

  constructor(
    id: string,
    text: string,
    list: string,
    content?: string[],
    lastProcessed?: string,
  ) {
    this.id = id
    this.text = text
    this.list = list
    this.content = content
    this.lastProcessed = lastProcessed
  }
}
