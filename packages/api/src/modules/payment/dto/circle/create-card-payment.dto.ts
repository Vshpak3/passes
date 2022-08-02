import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { AmountDto, SourceDto } from './circle-utils.dto'
import { MetaData } from './metadata.dto'

export class BasePaymentDto {
  @ApiProperty()
  idempotencyKey: string
  @ApiProperty()
  amount: AmountDto
  @ApiProperty()
  source: SourceDto
  @ApiPropertyOptional()
  description?: string
  @ApiPropertyOptional()
  channel?: string
  @ApiProperty()
  metadata: MetaData
}

export class CreateCardPaymentDto extends BasePaymentDto {
  @ApiProperty()
  verification = 'none'
  @ApiPropertyOptional()
  autoCapture?: boolean
  @ApiPropertyOptional()
  verificationSuccessUrl?: string
  @ApiPropertyOptional()
  verificationFailureUrl?: string
  @ApiPropertyOptional()
  keyId?: string
  @ApiPropertyOptional()
  encryptedData?: string
}
