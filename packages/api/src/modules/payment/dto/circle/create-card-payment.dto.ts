import { DtoProperty } from '../../../../web/dto.web'
import { CircleAmountDto, CircleSourceDto } from './circle-utils.dto'
import { CircleMetaDataDto } from './metadata.dto'

export class CircleCreatePaymentRequestDto {
  @DtoProperty({ type: 'string' })
  idempotencyKey: string

  @DtoProperty({ custom_type: CircleAmountDto })
  amount: CircleAmountDto

  @DtoProperty({ custom_type: CircleSourceDto })
  source: CircleSourceDto

  @DtoProperty({ type: 'string', optional: true })
  description?: string

  @DtoProperty({ type: 'string', optional: true })
  channel?: string

  @DtoProperty({ custom_type: CircleMetaDataDto })
  metadata: CircleMetaDataDto
}

export class CircleCreateCardPaymentRequestDto extends CircleCreatePaymentRequestDto {
  @DtoProperty({ type: 'string' })
  verification = 'none'

  @DtoProperty({ type: 'boolean', optional: true })
  autoCapture?: boolean

  @DtoProperty({ type: 'string', optional: true })
  verificationSuccessUrl?: string

  @DtoProperty({ type: 'string', optional: true })
  verificationFailureUrl?: string

  @DtoProperty({ type: 'string', optional: true })
  keyId?: string

  @DtoProperty({ type: 'string', optional: true })
  encryptedData?: string
}
