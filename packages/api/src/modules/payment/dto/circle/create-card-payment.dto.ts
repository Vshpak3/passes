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

  @DtoProperty({ required: false })
  description?: string

  @DtoProperty({ required: false })
  channel?: string

  @DtoProperty()
  metadata: CircleMetaDataDto
}

export class CircleCreateCardPaymentRequestDto extends CircleCreatePaymentRequestDto {
  @DtoProperty()
  verification = 'none'

  @DtoProperty({ required: false })
  autoCapture?: boolean

  @DtoProperty({ required: false })
  verificationSuccessUrl?: string

  @DtoProperty({ required: false })
  verificationFailureUrl?: string

  @DtoProperty({ required: false })
  keyId?: string

  @DtoProperty({ required: false })
  encryptedData?: string
}
