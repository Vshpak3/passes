import { DtoProperty } from '../../../../web/dto.web'

export class PayinEntryRequestDto {
  @DtoProperty({ type: 'uuid' })
  payinId: string
}

export class PayinEntryResponseDto {
  @DtoProperty({ type: 'uuid' })
  payinId: string
}
