import { ApiProperty } from '@nestjs/swagger'
import { IsUUID } from 'class-validator'

export class CircleStatusResponseDto {
  @IsUUID()
  @ApiProperty()
  id: string

  @IsUUID()
  @ApiProperty()
  circleId: string

  @ApiProperty()
  status: string
}
