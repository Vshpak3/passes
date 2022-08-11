import { ApiProperty } from '@nestjs/swagger'

export class CreateListDto {
  @ApiProperty()
  name: string
}
