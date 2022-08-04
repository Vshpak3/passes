import { ApiProperty } from '@nestjs/swagger'

export class CircleStatusDto {
  @ApiProperty()
  id: string

  @ApiProperty()
  status: string
}
