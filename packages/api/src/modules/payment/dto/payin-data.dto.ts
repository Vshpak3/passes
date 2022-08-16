import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class PayinDataDto {
  @ApiProperty()
  amount: number

  @ApiPropertyOptional()
  target?: string

  @ApiProperty()
  blocked: boolean
}
