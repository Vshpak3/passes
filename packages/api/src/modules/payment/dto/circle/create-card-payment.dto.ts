import { DtoProperty } from '../../../../web/dto.web'
import { CircleAmountDto, CircleSourceDto } from './circle-utils.dto'
import { CircleMetaDataDto } from './metadata.dto'

export class CircleCreatePaymentRequestDto {
  @DtoProperty()
  idempotencyKey: string

  @DtoProperty()
  amount: CircleAmountDto

  @DtoProperty()
  source: CircleSourceDto

  @DtoProperty({ optional: true })
  description?: string

  @DtoProperty({ optional: true })
  channel?: string

  @DtoProperty()
  metadata: CircleMetaDataDto
}

export class CircleCreateCardPaymentRequestDto extends CircleCreatePaymentRequestDto {
  @DtoProperty()
  verification = 'none'

  @DtoProperty({ optional: true })
  autoCapture?: boolean

  @DtoProperty({ optional: true })
  verificationSuccessUrl?: string

  @DtoProperty({ optional: true })
  verificationFailureUrl?: string

  @DtoProperty({ optional: true })
  keyId?: string

  @DtoProperty({ optional: true })
  encryptedData?: string
}
