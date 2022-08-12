import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CircleBankDto {
  @ApiProperty()
  id: string

  @ApiPropertyOptional()
  circleBankId?: string

  @ApiProperty()
  status: string

  @ApiProperty()
  description: string

  constructor(bank) {
    if (bank) {
      this.id = bank.id
      this.circleBankId = bank.circle_bank_id
      this.status = bank.status
      this.description = bank.description
    }
  }
}
