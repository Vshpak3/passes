import { DtoProperty } from '../../../../web/dto.web'
import { PayinEntryRequestDto, PayinEntryResponseDto } from './payin-entry.dto'

export class MetamaskCircleUSDCEntryRequestDto extends PayinEntryRequestDto {}

export class MetamaskCircleUSDCEntryResponseDto extends PayinEntryResponseDto {
  @DtoProperty()
  tokenAddress: string

  @DtoProperty()
  depositAddress: string

  @DtoProperty()
  chainId: number
}
