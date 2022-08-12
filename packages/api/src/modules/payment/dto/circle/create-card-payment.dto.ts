import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { CircleAmountDto, CircleSourceDto } from './circle-utils.dto'
import { CircleMetaDataDto } from './metadata.dto'

export class CircleCreatePaymentDto {
  @ApiProperty()
  idempotencyKey: string

  @ApiProperty()
  amount: CircleAmountDto

  @ApiProperty()
  source: CircleSourceDto

  @ApiPropertyOptional()
  description?: string

  @ApiPropertyOptional()
  channel?: string

  @ApiProperty()
  metadata: CircleMetaDataDto
}

export class CircleCreateCardPaymentDto extends CircleCreatePaymentDto {
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
