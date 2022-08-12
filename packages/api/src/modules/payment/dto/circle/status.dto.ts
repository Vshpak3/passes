import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CircleStatusDto {
  @ApiPropertyOptional()
  id?: string

  @ApiProperty()
  status: string
}
