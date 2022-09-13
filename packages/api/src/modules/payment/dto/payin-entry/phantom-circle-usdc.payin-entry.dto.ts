import { Length } from 'class-validator'

import { DtoProperty } from '../../../../web/dto.web'
import { EXTERNAL_URL_LENGTH } from '../../../profile/constants/schema'
import { BLOCKCHAIN_ADDRESS_LENGTH } from '../../../wallet/constants/schema'
import { PayinEntryRequestDto, PayinEntryResponseDto } from './payin-entry.dto'

export class PhantomCircleUSDCEntryRequestDto extends PayinEntryRequestDto {}

export class PhantomCircleUSDCEntryResponseDto extends PayinEntryResponseDto {
  @Length(1, BLOCKCHAIN_ADDRESS_LENGTH)
  @DtoProperty()
  tokenAddress: string

  @Length(1, BLOCKCHAIN_ADDRESS_LENGTH)
  @DtoProperty()
  depositAddress: string

  @Length(1, EXTERNAL_URL_LENGTH)
  @DtoProperty()
  networkUrl: string
}
