import { ApiProperty } from '@nestjs/swagger'

export class CreateListRequestDto {
  @ApiProperty()
  name: string

  @ApiProperty()
  userIds: string[]
}
