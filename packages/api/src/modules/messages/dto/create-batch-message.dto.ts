import { ApiProperty } from '@nestjs/swagger'

export class CreateBatchMessageRequestDto {
  @ApiProperty()
  text: string

  @ApiProperty()
  listId: string

  @ApiProperty()
  content?: string[]
}
