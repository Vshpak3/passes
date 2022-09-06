import { DtoProperty } from '../../../../web/endpoint.web'
import { PayinEntryRequestDto, PayinEntryResponseDto } from './payin-entry.dto'

export class MetamaskCircleETHEntryRequestDto extends PayinEntryRequestDto {}

export class MetamaskCircleETHEntryResponseDto extends PayinEntryResponseDto {
  @DtoProperty()
  depositAddress: string

  @DtoProperty()
  chainId: number
}
