import { ApiProperty } from '@nestjs/swagger'

export class CreateBatchMessageDto {
  @ApiProperty()
  text: string

  @ApiProperty()
  list: string

  @ApiProperty()
  content?: string[]
}
