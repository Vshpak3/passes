import { DtoProperty } from '../../../../web/endpoint.web'
import { PayinEntryRequestDto, PayinEntryResponseDto } from './payin-entry.dto'

export class PhantomCircleUSDCEntryRequestDto extends PayinEntryRequestDto {}

export class PhantomCircleUSDCEntryResponseDto extends PayinEntryResponseDto {
  @DtoProperty()
  tokenAddress: string

  @DtoProperty()
  depositAddress: string

  @DtoProperty()
  networkUrl: string
}
