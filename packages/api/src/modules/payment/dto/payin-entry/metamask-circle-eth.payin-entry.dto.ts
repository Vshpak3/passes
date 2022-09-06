import { DtoProperty } from '../../../../web/dto.web'
import { PayinEntryRequestDto, PayinEntryResponseDto } from './payin-entry.dto'

export class MetamaskCircleETHEntryRequestDto extends PayinEntryRequestDto {}

export class MetamaskCircleETHEntryResponseDto extends PayinEntryResponseDto {
  @DtoProperty()
  depositAddress: string

  @DtoProperty()
  chainId: number
}
