import { ApiProperty } from '@nestjs/swagger'

export class CircleStatusResponseDto {
  @ApiProperty()
  id: string

  @ApiProperty()
  circleId: string

  @ApiProperty()
  status: string
}
