import { IsInt, Length, Min } from 'class-validator'

import { DtoProperty } from '../../../../web/dto.web'
import { BLOCKCHAIN_ADDRESS_LENGTH } from '../../../wallet/constants/schema'
import { PayinEntryRequestDto, PayinEntryResponseDto } from './payin-entry.dto'

export class MetamaskCircleUSDCEntryRequestDto extends PayinEntryRequestDto {}

export class MetamaskCircleUSDCEntryResponseDto extends PayinEntryResponseDto {
  @Length(1, BLOCKCHAIN_ADDRESS_LENGTH)
  @DtoProperty()
  tokenAddress: string

  @Length(1, BLOCKCHAIN_ADDRESS_LENGTH)
  @DtoProperty()
  depositAddress: string

  @IsInt()
  @Min(0)
  @DtoProperty()
  chainId: number
}
