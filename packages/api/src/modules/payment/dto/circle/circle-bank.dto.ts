import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsUUID } from 'class-validator'

export class CircleBankDto {
  @IsUUID()
  @ApiProperty()
  id: string

  @ApiPropertyOptional()
  circleId?: string

  @ApiProperty()
  status: string

  @ApiProperty()
  description: string

  constructor(bank) {
    if (bank) {
      this.id = bank.id
      this.circleId = bank.circle_id
      this.status = bank.status
      this.description = bank.description
    }
  }
}
