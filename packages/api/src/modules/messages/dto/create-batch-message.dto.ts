import { ApiProperty } from '@nestjs/swagger'

export class CreateBatchMessageRequestDto {
  @ApiProperty()
  text: string

  @ApiProperty()
  list: string

  @ApiProperty()
  content?: string[]
}
