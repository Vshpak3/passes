import { ApiProperty } from '@nestjs/swagger'
import { IsUUID } from 'class-validator'

export class CreateBatchMessageRequestDto {
  @ApiProperty()
  listIds: string[]

  @ApiProperty()
  passIds: string[]

  @IsUUID()
  @ApiProperty()
  postId: string
}
