import { Min } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
import { PayinMethodDto } from './payin-method.dto'

export class SubscribeResponseDto {
  @DtoProperty({ type: 'uuid' })
  subscriptionId: string

  @DtoProperty({ custom_type: PayinMethodDto })
  payinMethod: PayinMethodDto
}

export class SubscribeRequestDto {
  @DtoProperty({ type: 'uuid' })
  userId: string

  @Min(0)
  @DtoProperty({ type: 'number' })
  amount: number

  @DtoProperty({ custom_type: PayinMethodDto, optional: true })
  payinMethod?: PayinMethodDto

  @DtoProperty({ type: 'uuid' })
  passHolderId: string
}
